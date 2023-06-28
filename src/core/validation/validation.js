const ObjectId = require('mongoose').Types.ObjectId;

function cardTypeByNumber(cardNumber) {

	if (cardNumber) {
		cardNumber = cardNumber.toString().trim();

		let p = {};
		p['51'] = p['52'] = p['53'] = p['54'] = p['55'] = 'Mastercard';
		p['34'] = p['37'] = 'American Express';
		p['4'] = 'VISA';
		p['6'] = 'Discover Card';
		p['35'] = 'JCB';
		p['30'] = p['36'] = p['38'] = 'Diners Club';

		for (let k in p) {
			if (cardNumber.indexOf(k) === 0) {
				return p[k];
			}
		}
	}
	return null;
}

function isValidCardNumber(cardNumber) {
	if (!cardNumber) {
		return false;
	}

	if (cardNumber.length < 13) {
		return false;
	}
	// accept only digits, dashes or spaces
	if (/[^0-9-\s]+/.test(cardNumber)) {
		return false;
	}

	// The Luhn Algorithm. It's so pretty.
	let nCheck = 0, nDigit = 0, bEven = false;
	cardNumber = cardNumber.replace(/\D/g, "");

	for (let n = cardNumber.length - 1; n >= 0; --n) {
		let cDigit = cardNumber.charAt(n),
			nDigit = parseInt(cDigit, 10);

		if (bEven) {
			if ((nDigit *= 2) > 9) {
				nDigit -= 9;
			}
		}

		nCheck += nDigit;
		bEven = !bEven;
	}

	return (nCheck % 10) == 0;
}

function isValidExpiry(expiryMonth, expiryYear) {
	if (!expiryMonth || !expiryYear) {
		return false;
	}
	expiryMonth = parseInt(expiryMonth, 10);
	expiryYear = parseInt(expiryYear, 10);
	if (isNaN(expiryMonth) || isNaN(expiryYear) || expiryMonth > 12 || expiryMonth < 1) {
		return false;
	}
	const today = new Date();
	return !(today.getFullYear() > expiryYear ||
		(today.getFullYear() === expiryYear && today.getMonth() >= expiryMonth));
}

function isValidCVV(cardNumber, cvv) {
	if (!cardNumber || !cvv) {
		return false;
	}

	const cardType = cardTypeByNumber(cardNumber);
	if (!cardType) {
		return false;
	}
	const requiredLength = (cardType === 'American Express' ? 4 : 3);

	if (typeof cvv === "string" || typeof cvv === "number") {
		if (cvv.toString().replace(/\D+/g, '').length === requiredLength) {
			return true;
		}
	}

	return false;
}

function isValidRoutingNumber(routingNumber) {
	if (!routingNumber) {
		return false;
	}
	routingNumber = routingNumber.toString().match(/\d+/g);

	if (!routingNumber) {
		return false;
	}

	routingNumber = routingNumber.join('');

	if (!routingNumber || routingNumber.length !== 9) {
		return false;
	}

	const a = routingNumber.toString().split('');
	const d = [];
	for (let i = 0; i < a.length; i++) {
		d.push(parseInt(a[i], 10));
	}
	return d[8] === (
		7 * (d[0] + d[3] + d[6]) +
		3 * (d[1] + d[4] + d[7]) +
		9 * (d[2] + d[5])
	) % 10;
}

function isSet(data) {
	return data != undefined && data != null;
}

function isValidNumber(data) {
	return (isSet(data) && !isNaN(parseFloat(data)));
}

function isValidName(name) {
	return (isSet(name) && (/^[A-z .]+$/.test(name)));
}

function isValidEmail(emailAddress) {
	return (isSet(emailAddress) && emailAddress.match(/[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+\/=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?/i));
}

function isValidString(data) {
	return (isSet(data) && (data || data === "") && typeof data === "string");
}

function isValidPassword(password) {
	return isValidString(password) && password.length >= 6 && password.match(/^[\x00-\xFF]*$/);
}

function isValidBoolean(data) {
	return (data === true || data === false);
}

function isValidInteger(data) {
	return (isSet(data) && (data === parseInt(data, 10)));
}

function isValidNonNegativeNumber(data) {
	return (isSet(data) && (data === parseInt(data, 10) || data === parseFloat(data, 10)) && data >= 0);
}

function isValidPositiveNumber(data) {
	return (isSet(data) && (data === parseInt(data, 10) || data === parseFloat(data, 10)) && data > 0);
}

function isValidNonNegativeInteger(data) {
	return (isSet(data) && (data === parseInt(data, 10)) && data >= 0);
}

function isValidPositiveInteger(data) {
	return (isSet(data) && (data === parseInt(data, 10)) && data > 0);
}

function isValidArray(data) {
	return (isSet(data) && Object.prototype.toString.call(data) === '[object Array]');
}

function isValidIP(data) {
	const matcher = /^(?:(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)\.){3}(?:2[0-4]\d|25[0-5]|1\d{2}|[1-9]?\d)$/;
	if (isValidString(data) && data === "::1") { //TODO: remove this
		return true;
	}

	return isValidString(data) && matcher.test(data);
}

function isValidNonEmptyString(data, makeTrim) {
	if (!isValidString(data)) {
		return false;
	}

	if (makeTrim) {
		data = data.trim();
	}
	return data.length > 0;
}

function isValidUrl(data) {
	const urlregex = /^(https?):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;

	return isSet(data) && urlregex.test(data);
}

function isValidPhone(data) {
	//const urlregex = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
	return isSet(data);// && urlregex.test(data);
}

function isValidDate(data) {
	if (!isSet(data)) {
		return false;
	}

	if (Object.prototype.toString.call(data) === "[object Date]") {
		// it is a date
		if (isNaN(data.getTime())) {  // d.valueOf() could also work
			// date is not valid
			return false;
		}
		else {
			// date is valid
			return true;
		}
	}
	else {
		// not a date
		return false;
	}
}

function isValidId(id) {
	if (!isSet(id)) {
		return false;
	}

	return ObjectId.isValid(id);
};


numberTo6 = function (n) {
	return (Math.floor(n * 1000000) / 1000000);
};


module.exports = {
	obj: isSet,
	cardNumber: isValidCardNumber,
	expiry: isValidExpiry,
	cvv: isValidCVV,
	email: isValidEmail,
	password: isValidPassword,
	name: isValidName,
	routingNumber: isValidRoutingNumber,
	boolean: isValidBoolean,
	integer: isValidInteger,
	nonNegativeInteger: isValidNonNegativeInteger,
	positiveInteger: isValidPositiveInteger,
	nonNegativeNumber: isValidNonNegativeNumber,
	positiveNumber: isValidPositiveNumber,
	number: isValidNumber,
	array: isValidArray,
	ip: isValidIP,
	str: isValidString,
	nonEmptyStr: isValidNonEmptyString,
	url: isValidUrl,
	phone: isValidPhone,
	date: isValidDate,
	id: isValidId
};