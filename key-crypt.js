const encrypt = require('./lib/encrypt');
const decrypt = require('./lib/decrypt');
let readline = require('readline');
let fs = require('fs');
let path = require('path');
const { ALGORITHM, ENCRYPED_EXT, UNENCRYPED_EXT } = require('./lib/constants');

let rl = readline.createInterface({
  	input: process.stdin,
  	output: process.stdout
});

rl.stdoutMuted = false;

rl.question('Operation [directory::password] to proceed (Operations = encrypt|decrypt|exit)\n', function(input) {
	let inputArr = input.split(' ');
	let dirArr = inputArr[1].split('::');
	if(inputArr[0] === 'encrypt' || inputArr[0] === 'decrypt') {
		processFiles(dirArr[0],inputArr[0],dirArr[1]);
	}
	else if(inputArr[0] === 'exit') {
		rl.close();
	}
	else {
		console.log('INVALID. Operation must be encrypt or decrypt');
	}
	rl.close();
});


rl._writeToOutput = function _writeToOutput(stringToWrite) {
  	if (rl.stdoutMuted)
  	  	rl.output.write("*");
  	else
  	  	rl.output.write(stringToWrite);
};


function processFiles(dir,operation,pass){
	fs.readdir(dir, function (err, files) {
	  	if (err) {
	  	  	console.error("Could not list the directory.");
	  	  	process.exit(1);
	  	}

	  	files.forEach(function (file, index){
	  	  	fs.stat(dir+'/'+file, function (error, stat) {
		  	    if (error) {
		  	      	console.error("Error stating file.", error);
		  	      	return;
		  	    }
		  	    if(stat.isFile()){
		  	    	if(operation === "encrypt"){
						  encrypt({ file: dir+'/'+file, password: pass },renameFile);
						}
		  	    	if(operation === "decrypt"){decrypt({ file: dir+'/'+file, password: pass },renameFile);}
		  	    }
		  	    else if(stat.isDirectory()){
		  	    	//console.log("got directory: "+file);
		  	    	processFiles(dir+'/'+file,operation,pass);
		  	    }

	      	});
	  	});
	});
}

function renameFile(file,op){
	let ext = '';
	if(op == 1){
		ext = ENCRYPED_EXT;
	}
	else if(op == 2){
		ext = UNENCRYPED_EXT;
	}
	fs.unlink(file, () => {
		fs.rename(file+ext, file, (err) => {
		  if (err) throw err;
		});
	}, (err) => {
	  if (err) throw err;
	});
}
