const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var http = require('http');
var url = require('url');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

/**
 * Get Authentication token from user
 */
var auth = (credential_path) => new Promise((resolve,reject)=>{

  fs.readFile(credential_path, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
        credentials = JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

           // Check if we have previously stored a token.
          fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getAccessToken(oAuth2Client, resolve);
    
          //previously stored token found
          oAuth2Client.setCredentials(JSON.parse(token));
          resolve(oAuth2Client);
        });
    }); 
})



/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}


/*
* List File Using Google Drive API 
* @return callback function
*/
var listFiles = (credential_path,callback)=> {
  auth(credential_path)
  .then((auth)=>{
    const drive = google.drive({version: 'v3', auth});
      drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
      }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
          let file_data = []; 
          files.map((file) => {
            // console.log(`${file.name} (${file.id})`);
            file_data.push(file);
          });
          callback(file_data);
        } else {
          // console.log('No files found.');
          callback({'status':'error', 'message':'No Files Found'});
        }
      });
  });

}


/*
* Upload file to google Drive
* @param file_name, file_pathm mimeType and callback function 
* @return call back function 
*/
var upload = (credential_path,file_name, file_path, mimeType, folder_id=false, callback) =>{
  auth(credential_path)
  .then((auth)=>{
    const drive = google.drive({version: 'v3', auth});
     if(!folder_id)
     {
          var fileMetadata = {
          'name': file_name
        };
     }
     else
     {
        var fileMetadata = {
        'name': file_name, 
        'parents':[folder_id]
      };
     }
      
    var media = {
      mimeType: mimeType,
      body: fs.createReadStream(file_path)
    };
    drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        callback(file.data.id)
      }
    });
  })

}


/*
* Create a folder to google Drive
* @param folder_name, callback function 
* @return call back function 
*/
var createFolder = (credential_path,folder_name, folder_id=false, callback) =>{
  auth(credential_path)
  .then((auth)=>{
    const drive = google.drive({version: 'v3', auth});

     if(!folder_id)
     {
          var fileMetadata = {
          'name': folder_name,
          mimeType: 'application/vnd.google-apps.folder',
        };
     }
     else
     {
        var fileMetadata = {
        'name': folder_name, 
        'parents':[folder_id],
        mimeType: 'application/vnd.google-apps.folder',
      };
     }

    drive.files.create({
      resource: fileMetadata,
      fields: 'id'
    }, function (err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        callback(file.data.id)
      }
    });
  })

}


 
/**
 * Get Authentication token from user
 */
var auth_manual = (credential_path) => new Promise((resolve,reject)=>{

  fs.readFile(credential_path, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
        credentials = JSON.parse(content);
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

           // Check if we have previously stored a token.
          fs.readFile(TOKEN_PATH, (err, token) => {
          if (err)
          {
             const authUrl = oAuth2Client.generateAuthUrl({
                    access_type: 'offline',
                    scope: SCOPES,
                  });
             resolve(authUrl);
          }
          else
          {
            //previously stored token found
              oAuth2Client.setCredentials(JSON.parse(token));
              resolve(false);
          }
        });
    }); 
})




var saveAccessToken = (credential_path, code) => {

fs.readFile(credential_path, (err, content) =>{
if (err) return console.log('Error loading client secret file:', err);

credentials = JSON.parse(content);
const {client_secret, client_id, redirect_uris} = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
      });
});
}




module.exports = {
  auth_console : auth, 
  listFiles : listFiles, 
  upload : upload,
  createFolder:createFolder, 
  auth_manual :auth_manual, 
  saveAccessToken : saveAccessToken
}