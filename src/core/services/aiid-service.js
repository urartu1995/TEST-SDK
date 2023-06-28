
'use strict';
var fs = require('fs');
const HttpHelper = require('../utils/http-helper');

class AiidService {
	clientId;
	clientSecret; 

	constructor(clientId, clientSecret) {
		this.clientId = clientId;
		this.clientSecret = clientSecret;
	}

	async generateAiidFile(name, description, hashCode, sourceId, type) {
		// callService(method, endpoint, configs, data, headers)
		let result = await HttpHelper.callService('POST', '/aigx', {secretAccessKey: this.clientSecret}, {name, description, hashCode, sourceId, type})

		console.log(result,'result - mresult result result')

		return result.result;
	}

	async verifyAiidFileById(aigxId, hashCode, signature) {
		return HttpHelper.callService('POST', `/aigx/${aigxId}/verify`, {secretAccessKey: this.clientSecret}, {aigxId, hashCode, signature})
	}
}


module.exports = AiidService;
