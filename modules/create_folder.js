const drive = require('../index'); 
const config = require('./config');


/*
* create folder
* Folder name, folder_id(Parent Folder false for root)
*/
drive.createFolder(config.creds,'my test folder', false, function(id){
	console.log(id);
})