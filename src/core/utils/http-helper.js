
'use strict';
// const sdkConfig = require('config');
// const rp = require('request-promise');
const axios = require('axios');
// "host": "http://localhost:9018/api/v1",
//https://ew6i64bdoc.execute-api.us-west-2.amazonaws.com/dev/api/v1
let sdkConfig = {
    "host": "https://ew6i64bdoc.execute-api.us-west-2.amazonaws.com/dev/api/v1",
    "authorizationHeaderKey": "Authorization",
    "authorizationJWTPrefix": "ai-id-api",
    "authorizationInfoPrefix": "ai-id",
}


class HTTPHelper {

    static async callService(method, endpoint, configs, data, headers) {
        const options = {
            method: method,
            url: (configs.host ? configs.host : sdkConfig.host) + endpoint,
            data: data,
            headers: {},
            json: true // Automatically stringifies the body to JSON
        };
        if(headers) {
            options.headers = headers;
        }

        options.headers["Content-Type"] = "application/json";

        if(configs.secretAccessKey !== "") {
            options.headers['Authorization'] = `${sdkConfig.authorizationJWTPrefix} <${configs.secretAccessKey}>`;
        }
		console.log(options,'options ');

		try {
            const resp = await axios(options);
            if(!resp.data || !resp.data.status) {
                throw new Exception(resp.data ? resp.data.message : "", "ERROR CODE");
            }
            return resp.data;
        } catch(e) {
            console.log(e.message,'error ');
        }
        return null;
    }
}


module.exports = HTTPHelper;
