'use strict';

// imports
const csv=require('csvtojson')
const image=require('./Image.js')
const json2csv = require('json2csv');
const fs = require('fs');

// API Enviorment variables
const wineImageURLBase = 'https://www.wine.com/labels/'
const cloudinaryImageURLBase = 'https://res.cloudinary.com/winecom/image/upload/'
const csvFilePath='media_service_data_temp.csv'

const fields = ['associated_entity_id','cloudinaryURL','wineURL'];
const output_file_name = 'missing_cloudinary_urls.csv';
const missing_wine_image_file_name = 'missing_wine_urls.csv';
const low_res_cloudinary_image_file_name = 'low_res_cloudinary_urls.csv';


// csv()
// .fromFile(csvFilePath)
// .on('json',(jsonObj)=>{
// 	processProductchecks(jsonObj);
// })
// .on('done',(error)=>{
// 	console.log('end')
// })

function processProductchecks(jsonObj){
	// combine csv header row and csv line to a json object
	 const wineImageURL_l = wineImageURLBase + jsonObj.associated_entity_id + 'l.jpg';
	 const wineImageURL_h = wineImageURLBase + jsonObj.associated_entity_id + 'h.jpg';
	 const cloudinaryImageURL = cloudinaryImageURLBase + jsonObj.associated_entity_id + '.jpg';
	 image.getImageInfo(wineImageURL_h, jsonObj.associated_entity_id, (imageRow_h) => {
	 	if (imageRow_h.metadata && imageRow_h.metadata !== "undefined"){
		 	image.getImageInfo(cloudinaryImageURL, jsonObj.associated_entity_id, (imageRowCloudinary_h) => {
		 		if (imageRowCloudinary_h.metadata && imageRowCloudinary_h.metadata  !== "undefined"){
		 			console.log('GOOD h IMAGE.... associated_entity_id: ' + imageRowCloudinary_h.associated_entity_id + ' imageRowCloudinary_h.metadata: ' + JSON.stringify(imageRowCloudinary_h.metadata));
		 			if (imageRowCloudinary_h.metadata.width && imageRowCloudinary_h.metadata.width < 200){
			 			const row = {
									  "associated_entity_id": imageRowCloudinary_h.associated_entity_id,
									  "cloudinaryURL": cloudinaryImageURL,
									  "wineURL": wineImageURL_h
									};
			 			writeToFile_low_res_cloudinary_image([row]);
		 			}
		 		}else{
		 			console.log('MISSING h IMAGE.... associated_entity_id: ' + imageRowCloudinary_h.associated_entity_id + ' ....need to add image to cloudinary for associated_entity_id: ' + imageRowCloudinary_h.associated_entity_id);
		 		}
		 	});	
	 	}else{		 	
	 		image.getImageInfo(wineImageURL_l, jsonObj.associated_entity_id, (imageRow_l) => {
				if (imageRow_l.metadata && imageRow_l.metadata !== "undefined"){
				 	image.getImageInfo(cloudinaryImageURL, jsonObj.associated_entity_id, (imageRowCloudinary_l) => {
				 		if (imageRowCloudinary_l.metadata && imageRowCloudinary_l.metadata  !== "undefined"){
				 			console.log('GOOD l IMAGE.... associated_entity_id: ' + imageRowCloudinary_l.associated_entity_id + ' imageRowCloudinary_l.metadata: ' + JSON.stringify(imageRowCloudinary_l.metadata));
				 		}else{
				 			console.log('MISSING l IMAGE.... associated_entity_id: ' + imageRowCloudinary_l.associated_entity_id + ' ....Need to add image to cloudinary for associated_entity_id: ' + imageRowCloudinary_l.associated_entity_id);
				 			const row = {
										  "associated_entity_id": imageRowCloudinary_l.associated_entity_id,
										  "cloudinaryURL": cloudinaryImageURL,
										  "wineURL": wineImageURL_l
										};
				 			writeToFile_h([row]);
				 		}
				 	});	
			 	}else{
			 		console.log('IMAGE DOES NOT EXIST IN WINE FOR associated_entity_id: ' + jsonObj.associated_entity_id);
		 			const row = {
								  "associated_entity_id": jsonObj.associated_entity_id,
								  "cloudinaryURL": cloudinaryImageURL,
								  "wineURL": wineImageURL_l
								};
		 			writeToFile_missing_wine_image([row]);

			 	}
	 		});
	 	}
	 })
}


function writeToFile_h(fileContent) {
    var csv = json2csv({ data: fileContent, fields: fields , hasCSVColumnTitle: false});
    csv = "\r\n" + csv;
    fs.appendFile(output_file_name, csv, function(err) {
      if (err) {
        console.log('error writting to file. filename: ' + output_file_name);
        throw err;
      }
    });
}

function writeToFile_missing_wine_image(fileContent) {
    var csv = json2csv({ data: fileContent, fields: fields , hasCSVColumnTitle: false});
    csv = "\r\n" + csv;
    fs.appendFile(missing_wine_image_file_name, csv, function(err) {
      if (err) {
        console.log('error writting to file. filename: ' + missing_wine_image_file_name);
        throw err;
      }
    });
}


function writeToFile_low_res_cloudinary_image(fileContent) {
    var csv = json2csv({ data: fileContent, fields: fields , hasCSVColumnTitle: false});
    csv = "\r\n" + csv;
    fs.appendFile(low_res_cloudinary_image_file_name, csv, function(err) {
      if (err) {
        console.log('error writting to file. filename: ' + low_res_cloudinary_image_file_name);
        throw err;
      }
    });
}

module.exports.processProductchecks = processProductchecks; 