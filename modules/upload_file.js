const drive = require('../index'); 
const config = require('./config');

/*
*upload files 
*@param file name , file path , mime type of file, google drive folder id (false for root)
*/
drive.upload(config.creds, 'test123.pdf', 'files/test.pdf', 'application/pdf', false, function(data){
	console.log('File uploaded successfully,  File id is : '+ data);
}); 

