const drive = require('../index'); 
var config = require('./config');

// Simple Authentication on Console
drive.auth_console(config.creds)
.then((accesstoken)=>{
	//do what ever you want to do with google drive api
})