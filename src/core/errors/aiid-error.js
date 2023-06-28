
'use strict';

const _ = require('lodash');
const util = require('util');

var ErrorMessages = {
	1000010: 'Invalid request. Key value missing.',
	1000020: 'Invalid request.',
	1000030: 'Not found.',
	1000100: 'Good news, new update available, please goes to App Store update now.',
	1000110: 'You are currently on an older, unsupported version of the AIID app. Please update on the App Store now.',
	1000200: 'We’re currently maintaining our system to provide a better service to you.',
	1000300: 'Account is banned.',
	1000310: 'Account is cancelled.',
	1000320: 'Account is not exist.',
	1000325: 'Account exist.',
	1000330: 'Account is invalid',
	1000340: 'Account is unverified',
	1000350: 'Account is inactive',
	1000401: 'Invalid credentials.',
	1000403: 'Forbidden.',
	1000500: 'Incorrect current password.',
	1001000: 'Facebook account is not registered.',
	1001100: 'Your email is already registered to an account.',
	1001200: 'Your phone is already registered to an account.',
	1001300: 'Please wait %s seconds to request a new CODE.',
	1001500: 'Invalid email format.',
	1001501: 'Invalid date format.',
	1001502: 'Incomplete date range.',
	1001503: 'Invalid page limit.',
	1001504: 'Invalid page number.',
	1001505: 'Invalid date range.',
	1001510: 'Invalid phone format.',
	1001520: 'Invalid user id format, special character is not allowed.',
	1001540: 'Invalid phone verification code.',
	1001550: 'Invalid facebook account.',
	1001560: 'Invalid referral code.',
	1001600: 'Unknown error',
	1001610: 'Validation error',
	1001620: 'System error',
	1001630: 'Already exists',
	9000000: 'Unexpected error occurred, please try again later. If the error persists, please contact our support.'
};

/**
 * Constructs a new AIID.Error object with the given code and message.
 * @class AIID.Error
 * @constructor
 * @param {Number} code An error code constant from <code>AIID.Error</code>.
 * @param {Object| String} options  details information of error.
 * @reference https://gist.github.com/justmoon/15511f92e5216fa2624b
 */
const AIIDError = function AIIDError(code, options = {}) {
	Error.captureStackTrace(this, this.constructor);

	// If options is string : make it be message.
	if (typeof options === 'string') {
		options = {
			message: options,
		};
	}

	options = _.defaults(options, {
		status: null,
		message: null,
		params: [],
	});

	this.name = this.constructor.name;
	this.code = code;

	// priority over options.message
	this.message = (options.message && options.message != null) ? util.format(options.message, ...options.params) : options.message;
	this.message = (this.message && this.message != null) ? this.message : util.format(ErrorMessages[code], ...options.params);

	if (!options.status) {
		if (code === AIIDError.INTERNAL_SERVER_ERROR) {
			options.status = 500;
		} else {
			options.status = 400;
		}
	}

	this.status = options.status;
};

module.exports = AIIDError;

require('util').inherits(module.exports, Error);

/*
 * Invalid request. Key value missing.
 */
AIIDError.MISSING_KEY_VALUE = 1000010;

/*
 * Invalid request.
 */
AIIDError.INVALID_REQUEST = 1000020;

/* Not found.
 */
AIIDError.NOT_FOUND = 1000030;

/*
 * Good news, new update available, please goes to App Store update now.
 */
AIIDError.APP_UPDATE_AVAILABLE = 1000100;

/*
 /* You are currently on an older, unsupported version of the AIID app. Please update on the App Store now.
 */
 AIIDError.UNSUPPORTED_VERSION_AIID_APP = 1000110;


/*
 * We’re currently maintaining our system to provide a better service to you.
 */
AIIDError.UNDER_MAINTENANCE = 1000200;

/*
 * Account is banned.
 */
AIIDError.ACCOUNT_IS_BANNED = 1000300;

/*
 * Account is cancelled.
 */
AIIDError.ACCOUNT_IS_CANCELLED = 1000310;

/*
 * Account is not exist.
 */
AIIDError.ACCOUNT_NOT_EXIST = 1000320;

/*
 * Account exist.
 */
AIIDError.ACCOUNT_EXIST = 1000325;

/*
 * Account is invalid.
 */
AIIDError.ACCOUNT_IS_INVALID = 1000330;

/*
 * Account is unverified.
 */
AIIDError.ACCOUNT_IS_UNVERIFIED = 1000340;

/*
 * Account is inactive.
 */
AIIDError.ACCOUNT_IS_INACTIVE = 1000350;

/*
 * Invalid credentials.
 */
AIIDError.UNAUTHORIZED = 1000401;

/**
 * Forbidden.
 */
AIIDError.FORBIDDEN = 1000403;

/*
 * Incorrect current password.
 */
AIIDError.INCORRECT_CURRENT_PASSWORD = 1000500;

/*
 * Your email is already registered to an account.
 */
AIIDError.EMAIL_TAKEN = 1001100;

/*
 * Your phone is already registered to an account.
 */
AIIDError.PHONE_NO_TAKEN = 1001200;

/*
 * Please wait %s seconds to request a new CODE.
 */
AIIDError.REQUEST_CODE_TOO_FREQUENT = 1001300;

/*
 * Invalid email format.
 */
AIIDError.INVALID_EMAIL = 1001500;

/*
 * Invalid date format.
 */
AIIDError.INVALID_DATE_FORMAT = 1001501;

/*
 * Incomplete date range.
 */
AIIDError.INCOMPLETE_DATE_RANGE = 1001502;

/*
 * Invalid page limit.
 */
AIIDError.INVALID_PAGE_LIMIT = 1001503;

/*
 * Invalid page number.
 */
AIIDError.INVALID_PAGE_NUMBER = 1001504;

/*
 * Invalid date range.
 */
AIIDError.INVALID_DATE_RANGE = 1001505;

/*
 * Invalid phone format.
 */
AIIDError.INVALID_PHONE_NO = 1001510;

/*
 * Invalid user id format, special character is not allowed.
 */
AIIDError.INVALID_USER_ID = 1001520;

/*
 * Invalid phone verification code.
 */
AIIDError.INVALID_VERIFY_CODE = 1001540;

/*
 * Invalid facebook account.
 */
AIIDError.INVALID_FACEBOOK_ACCOUNT = 1001550;

/*
 * Invalid referral code.
 */
AIIDError.INVALID_REFERRAL_CODE = 1001560;

/*
 * Invalid or expired password-reset token.
 */
AIIDError.INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN = 1001590;

/*
 * Unknown error
 */
AIIDError.UNKNOWN = 1001600;

/*
 * Validation error
 */
AIIDError.VALIDATION = 1001610;

/*
 * System error
 */
AIIDError.SYSTEM = 1001620;

/*
 * Already exists
 */
AIIDError.ALREADY_EXISTS = 1001630;


/*
 * System error, please contact admin.
 */
AIIDError.INTERNAL_SERVER_ERROR = 9000000;

