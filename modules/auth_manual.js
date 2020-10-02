const drive = require('../index'); 
const readline = require('readline');
const config = require('./config');





//Manual Authentication 
drive.auth_manual(config.creds)
.then((auth_url)=>{
	if(!auth_url)
	{
		console.log("You are already signed in, you can delete token.json to sign in from different accout");
	}
	else
	{
	//get the auth url by calling auth_manaual() function and get the code by clicking or redirecting to that code also you can usue a web check in form to get code 
	console.log('Click here:', auth_url);
	  const rl = readline.createInterface({
	    input: process.stdin,
	    output: process.stdout,
	  });
	  rl.question('Enter the code from that page here: ', (code) => {
	  rl.close();
	  	drive.saveAccessToken(code);  //a separate function to save token 
	});

	}
});