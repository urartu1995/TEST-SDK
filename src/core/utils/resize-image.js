
'use strict';
const sharp = require('sharp');
var fs = require('fs');

class ResizeImage {
	constructor() {
	}

	static async resize(imageBinary, sizes) {
		let resizedImages = [];
		let buf = new Buffer(imageBinary.replace(/^data:image\/\w+;base64,/, ""), 'base64');
		for (const size of sizes) {
			let resizedImage = await sharp(buf)
				.resize(size.width, size.height)
				.max()
				.toFormat('png')
				.toBuffer();
			resizedImages.push({
				data: resizedImage,
				width: size.width,
				height: size.height
			});
		}
		return resizedImages;
	}
}


module.exports = ResizeImage;
