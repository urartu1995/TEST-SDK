
'use strict';
const crypto = require('crypto');
var fs = require('fs');
const AiidService = require('../core/services/aiid-service')

class AiidManager {
	clientId;
	secretKey
	aiidServiceClient;

	constructor(clientId, secretKey) {
		this.clientId = clientId;
		this.secretKey = secretKey;
		this.aiidServiceClient = new AiidService(clientId, secretKey);
	}

	_calculateHash(filePath) {
		const fileBuffer = fs.readFileSync(filePath);
		const hashSum = crypto.createHash('sha256');

		hashSum.update(fileBuffer);
		
		return hashSum.digest('hex');
	}

	_calculateHashOnContent(filePath, contentOffset) {
		return new Promise((resolve, reject) => {
			const fd = fs.createReadStream(filePath, { start: contentOffset});

			var hash = crypto.createHash('sha256');
			hash.setEncoding('hex');

			fd.on('end', function() {
				hash.end();
				resolve(hash.read());
			});

			fd.on('error', (err) => {
				reject(err);
			  });			

			// read all file and pipe it (write it) to the hash object
			fd.pipe(hash);
		  });
	}

	_writeToFile(originalFilePath, outputFilePath, header, signature, successCallback, failureCallback) {
		const inputStream = fs.createReadStream(originalFilePath)
		const outputStream = fs.createWriteStream(outputFilePath)
	
		outputStream.write(signature);

		let length = header.length;
		var lengthBuffer = Buffer.alloc(4);
		lengthBuffer.writeInt32LE(length, 0)

		outputStream.write(lengthBuffer);

		outputStream.write(header);

		inputStream.pipe(outputStream)
		
		outputStream.on('finish', () => {
			successCallback()
		})

		outputStream.on('error', function (error) {
			failureCallback();
		})
	}

	async _readFileAsPromise(path, options) {
		return new Promise((resolve, reject) => {
		  const fileStream = fs.createReadStream(path, options);
	  
		  let chunks;
		  fileStream.on('data', (data) => {
			chunks = data;
		  });
	  
		  fileStream.on('close', () => {
			// resolve(chunks.toString('utf-8'));
			resolve(chunks);
		  });
	  
		  fileStream.on('error', (err) => {
			reject(err);
		  });
		});
	}
	  

	async parseAiidFile(filePath) {
		const signatureBuffer = await this._readFileAsPromise(filePath, { start: 0, end: 511 });
		const signature = signatureBuffer.toString('utf-8')

		const lengthBuffer = await this._readFileAsPromise(filePath, { start: 512, end: 515 });
		const length = lengthBuffer.readInt32LE();

		const headerBuffer = await this._readFileAsPromise(filePath, { start: 516, end: 516 + length - 1 });
		const headerStrBase64 = headerBuffer.toString('utf-8');
		var bufToDecode = Buffer.from(headerStrBase64, 'base64');
		const headerStr = bufToDecode.toString('utf-8');
		const result = {signature, headers: JSON.parse(headerStr), contentOffset: length + 516};

		return result;
	}

	async generateAiidFile(filePath, outputFilePath, name, description, sourceId, type, successCallback, failureCallback) {
		
		let hashCode = this._calculateHash(filePath);

		let {aigxId, aigxSignature} = await this.aiidServiceClient.generateAiidFile(name, description, hashCode, sourceId, type);

		let header = {aigxId, name, description, sourceId,type};
		let headerBase64 = new Buffer(JSON.stringify(header)).toString("base64");

		this._writeToFile(filePath, outputFilePath, headerBase64, aigxSignature, successCallback, failureCallback)
	}

	async verifyAiidFile(filePath) {
		let header = await this.parseAiidFile(filePath);
		let hash = await this._calculateHashOnContent(filePath, header.contentOffset);
		return this.verifyAiidFileById(header.headers.aigxId, hash, header.signature);
	}

	async verifyAiidFileById(aiidId, hash, signature) {
		let result = await this.aiidServiceClient.verifyAiidFileById(aiidId, hash, signature)
		return result.result;
	}
}


module.exports = AiidManager;
