const measureSizeOf = require('image-size');
const https = require('https');
const imagesize = require('imagesize');

module.exports.getImageInfo = (imageURL, associated_entity_id,  callback) => {

	var request = https.get(imageURL, function (response) {
		imagesize(response, function (err, result) {
		    // do something with result
		 	if (result) {		
		 		//console.log("Image: " + imageURL + " Imagesize metadata:" + JSON.stringify(result));
				const imageRow = {
				  "associated_entity_id": associated_entity_id,
				  "imageURL": imageURL,
				  "metadata": result
				};
				callback(imageRow);
		 	}else{		
				const imageRow = {
				  "associated_entity_id": associated_entity_id,
				  "imageURL": imageURL,
				  "metadata": "undefined"
				};
				callback(imageRow);
		 	}
		    // we don't need more data
	    	request.abort();
		});
	});

}
