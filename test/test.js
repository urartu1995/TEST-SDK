
'use strict';


const mongoose = require('mongoose');
const config = require('config');
const authService = require('../src/account/services/auth-service');
const AIID = require('../src/core/utils/aiid');
jest.unmock('mongoose');

describe('SomeTest', () => {
	beforeAll((done) => {
		mongoose.connect(`mongodb://${config.mongoDB.host}/${config.mongoDB.database}`);

		let db = mongoose.connection;

		db.on('error', (err) => {
			done.fail(err);
		});

		db.once('connected', async () => {
			done();
		});
	});


	it('proves that one equals one', async () => {
		await expect(authService.login("superadmin@mailinator.com", "Qw12345678")).rejects.toThrow(AIID.Error);
	});
});