
'use strict';
const _ = require('lodash');
const crypto2 = require('crypto2');
const config = require('config');
const moment = require('moment');
const json2csv = require('@json2csv/plainjs');
const ObjectId = require('mongoose').Types.ObjectId;
const valid = require('../validation/validation');

const AppUtil = {

	parseDate: (val) => {
		const dateFormat = 'YYYY-MM-DD HH:mm:ss';
		if (val) {
			let date = moment.utc(val, dateFormat, true);
			if (date.isValid()) {
				return date.toDate();
			}
		}
		return null;
	},

	parseBool: function parseBool(val) {
		if ((typeof val === 'string' && (val.toLowerCase() === 'true' || val.toLowerCase() === 'yes' || val === '1')) || val === 1 || val === true) {
			return true;
		}
		else if ((typeof val === 'string' && (val.toLowerCase() === 'false' || val.toLowerCase() === 'no' || val === '0')) || val === 0 || val === false) {
			return false;
		}

		return null;
	},

	sessionUuid4TokenEncode: function (session, uuid4) {
		let sessionArray = [];

		let uuid4Array = uuid4.split('-');

		sessionArray[0] = session.slice(0, 6);
		sessionArray[1] = session.slice(6, 24);

		uuid4Array.splice(0, 0, sessionArray[0]);
		uuid4Array.push(sessionArray[1]);

		return uuid4Array.join('-');
	},

	sessionUuid4TokenDecode: function (token) {
		let tokenArray = token.split('-');
		let sessionId = [];
		sessionId[0] = tokenArray.splice(0, 1);
		sessionId[1] = tokenArray.splice(tokenArray.length - 1, 1);

		return {
			sessionId: sessionId.join(''),
			uuid4: tokenArray.join('-')
		};
	},

	encryptPass: function async (message, privateKey) {
		return crypto2.encrypt(message, privateKey, config.aesIVSecret);
	},

	getStringBetween: function (str, start, end) {
		const startIndex = str.indexOf(start);

		if (startIndex === -1) {
			return "";
		}
		const endIndex = str.indexOf(end);
		if (endIndex === -1) {
			return "";
		}

		if (endIndex <= startIndex + 1) {
			return "";
		}

		return str.substring(startIndex + 1, endIndex);
	},

	getPagingAndSorting(requestQuery, allowedSortingFields) {
		let { page, limit, sortBy, sortType } = requestQuery;
		let pagingAndSorting = { sort: { "created_at": -1 } };

		if (page) {
			pagingAndSorting.page = parseInt(page);
			pagingAndSorting.limit = limit ? parseInt(limit) : config.defaultPageLimit;
			;
		}

		if (sortBy && allowedSortingFields && allowedSortingFields.some(sort => sort === sortBy)) {
			sortType = sortType ? parseInt(sortType) : -1;
			pagingAndSorting.sort = _.set({}, sortBy, sortType);
		}

		return pagingAndSorting;
	},

	makeDateRangeFilter(query) {
		let filter = {};
		if (query.fromDate) {
			let fromDate = this.parseDate(query.fromDate);
			if (fromDate) {
				filter.fromDate = fromDate;
			}
		}

		if (query.toDate) {
			let toDate = this.parseDate(query.toDate);
			if (toDate) {
				filter.toDate = toDate;
			}
		}

		return filter;
	},

	extractFields(data, fieldList) {
		let result = {};

		for (let prop in data) {
			if (fieldList.includes(prop)) {
				result[prop] = data[prop];
			}
		}
		return result;
	},

	extractValidUrl(link) {
		if (!valid.str(link)) {
			return null;
		}

		if (!(link.indexOf("http://") === 0 || link.indexOf("https://") === 0)) {
			link = "http://" + link;
		}

		if (!valid.url(link)) {
			return null;
		}

		return link;
	},

	isValidId(id) {
		if (!valid.obj(id)) {
			return false;
		}

		return ObjectId.isValid(id);
	},

	json2csv(data) {
		try {
			return json2csv.json2csv(data);
		} catch (err) {
			return null;
		}
	},

	clone(obj) {
		return JSON.parse(JSON.stringify(obj));
	},

	async generateSigningKey() {
		return await crypto2.createKeyPair(); // { privateKey, publicKey }
	},

	async generateSignature(message, privateKey) {
		return await crypto2.sign.sha256(message, privateKey);
	},

	async verifySignature(message, signature, publicKey) {
		return await crypto2.verify.sha256(message, publicKey, signature);
	}
};

module.exports = AppUtil;