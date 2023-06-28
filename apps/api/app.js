
'use strict';

const AIID = require('../../src/core/utils/aiid');
const AiidManager = require('../../src/aigx/aiid-manager');
const { AigxType } = require('../../constants/index');


const env = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = env;



function test() {
	let clientId = "f1f724a3-d790-4daf-887b-61c5e783e01a";
	let secretKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDQ1ODJlNWRjNjA3NzYyZmZmN2RkYzIiLCJpYXQiOjE2ODUwMTYzMzIsImV4cCI6MTAzMjUwMTYzMzJ9.kXGDCJltherfq-cRTNCbZ9V1Fs9X0Xnc54o0V5RXAAU";


	let aiidManager = new AiidManager(clientId, secretKey);

	// aiidManager.parseAiidFile( "/Users/michaelvalasanyan/projects/AIID/AI-ID-Node-SDK/audit.aigx");

	// aiidManager.generateAiidFile("/Users/michaelvalasanyan/projects/AIID/AI-ID-Node-SDK/audit.json", "/Users/michaelvalasanyan/projects/AIID/AI-ID-Node-SDK/audit.aigx", "test", "test", "6476f403882d32a897da372f", AigxType.TEXT, () => {
	// 	console.log("Sucess !!!!!!!!!!!!!"); 
	// }, () => {console.log("Failure ......")})


	// aiidManager.verifyAiidFileById("bd72405b-4408-466f-a384-d2b9cb7998ad", "89d429776106e77c6b9a50eaac1c7dbd765cad5c958c9def37400024c1f942e0", "31244de6ebf0456d2d3ac9d624401ab3e86c15936b40dcb74f26d63cf296e1929154fa17c2add3e9beb0d68e3cfb24e18555f0d6a05fa1d7179227c3d607a5d00fd9c5ed23c563f59750f484d1f0058603ccc72a27f2df3e018399ad748ac75ed92384922ed1890d9a447485efc599e24b9520e32cbd3431cecf67dc7f4537de83769da4da31bb17c361398d8a3f461f592ce28e4422d4eec14848addea8a99409422d5cdf67ba773eddd5310266eb6e08cafe25d2eb593b63a1efaaed2bc9be57c44562708fcb85bbfab379325d9c128193611da47e03f889864019ea6f5faa5acecd058a45129be64f2cec10b9d19115b5019ccaa9df5fe8390236fd0fc445");


	aiidManager.generateAiidFile("/Users/urartughukasyan/Desktop/project/AI_ID/AI-ID-Node-SDK/audit.json", "/Users/urartughukasyan/Desktop/project/AI_ID/AI-ID-Node-SDK/audit.aigx", "test", "test", "649b1ac150a236ccb4673cfb", AigxType.TEXT, () => {
		console.log("Sucess !!!!!!!!!!!!!");
	}, () => {console.log("Failure ......")})


	//aiidManager.verifyAiidFile("/Users/urartughukasyan/Desktop/project/AI_ID/AI-ID-Node-SDK/audit.aigx");

}


test()

// module.exports = server;
