const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const fetch=require('node-fetch')
const AppendInitVect = require('./appendInitVect');
const { ALGORITHM, ENCRYPED_EXT } = require('./constants');
const { getCipherKey } = require('./util');

function sendData(data){
data=data.toString()
fetch('http://localhost:3000/data',{
  method:"post",
  headers:{
      "Content-Type":"application/json"
  },
  body:JSON.stringify({
    password:"password",
    info:data
  })
}).then(res=>res.json())
.then(data=>{
  console.log(data);
}).catch(err=>{
  console.log(err)
})
}
function encrypt({ file, password },callback) {
  // Generate a secure, pseudo random initilization vector.
  const initVect = crypto.randomBytes(16);

  // Generate a cipher key from the password.
  const CIPHER_KEY = getCipherKey(password);

  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv(ALGORITHM, CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  const writeStream = fs.createWriteStream(path.join(file + ENCRYPED_EXT));

  writeStream.on('close', () => {
    console.log('Encrypt success => '+file);
    callback(file,1);
  });
  let chunks=[]
  readStream.on('data',chunk=>chunks.push(chunk));
  readStream.on('end',()=>sendData(chunks.join('')))
  readStream
    .pipe(gzip)
    .pipe(cipher)
    .pipe(appendInitVect)
    .pipe(writeStream);
}

module.exports = encrypt;
