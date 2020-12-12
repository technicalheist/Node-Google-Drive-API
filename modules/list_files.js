const drive = require('../index'); 
const config = require('./config');



//list files 
drive.listFiles(config.creds,function(data){
	console.log(data);
}); 
