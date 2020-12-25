# Node Google Drive API 
## This is a simple google drive api using node. Accessing google drive api made simple using this node structure. 

## This is an open source repository and everyone is welcome to extend this repository with MIT License. This repository is using official google drive apis and made simple for further uses. Please visit https://developers.google.com/drive/api/v3/quickstart/nodejs for more information. 

### Features 
* Auto Auth 
* Manual Authentication (Use your web or console validation)
* Upload File in root folder or specific folder 
* List File 
* Create Folder in root folder or specific folder 

### How to Use 
##### Simple Clone this repository 

1. Go to https://console.developers.google.com/
2. Create a project if not yet created or choose existing one 
3. Click on Enable APIS and Services and enable gooogle drive api 
4. Click on Credentials (Right Sidebar menu)
5. Click on create credential
6. Select OAuth Client ID 
7. From Dropdown Application type select Tvs and Limited input device 
8. Click on Create
9. Now on Credentials page click on download icon in OAuth 2.0 Client IDs section
10. rename this to credentials.json 
11. open config.js inside modules folder and set the path for credential_path see modules folder function for help

 Include index.js where you want to use
```
const drive = require('./index'); 
var config = require('./config'); ///your config file
```

##### Using NPM : npm i gdrive-node

1. Follow the above procedure to get your credentials.json from the google developer console
2. create a config.js file and paste : ```exports.creds = "credentials.json"```
3. create app.js file and paste following code 


```
const drive = require('gdrive-node'); 
var config = require('./config'); ///your config file
```
- you can also use .env file instead of config.js

##### Now Call the following functions to operate. 

1. Authentication 

```

drive.auth(config.creds)
.then((accesstoken)=>{

//do whatever you want to do with google api

})

````

2. Upload file  use 'false' as 5th parameter for root directory or pass folder id for parent folder id

```
drive.upload(config.creds, 'test123.pdf', 'files/test.pdf', 'application/pdf', false, function(data){
	console.log('File uploaded successfully,  File id is : '+ data);
}); 

```

3. Create Folder : use 'false' for root directtory or pass folder id for parent folder id

```
drive.createFolder(config.creds,'my test folder', false, function(id){
	console.log(id);
})

```

4. Manually Authentication 

```
const readline = require('readline'); //for manually verification only

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

```



##### More Coming Soon
