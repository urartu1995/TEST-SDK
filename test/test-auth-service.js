/**
 * Created by Hovhannes Atoyan on 6/19/18.
 *
 * Test file source: src/account/services/auth-service.js
 */

const AIID = require('../src/core/utils/aiid');
const mongoose = require('mongoose');
const config = require('config');
const authService = require('../src/account/services/auth-service');
jest.unmock('mongoose');

describe('========== Testing auth-service ==========', () => {
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

	afterAll(async () => {
		let conClose = await mongoose.disconnect();
	});

	test('1. Unit Testing for the function login(email, password)', async () => {
		// Negative case
		let wrongEmail = "wronguser@aaa.bbb";
		//let wrongEmail = "superadmin@mailinator.com";
		let wrongPassword = "Qw12345678";

		await expect(authService.login(wrongEmail, wrongPassword)).rejects.toThrow(AIID.Error);
	});

});


