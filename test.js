var fs = require('fs');
 
fs.readFile('test.txt', 'utf8', function(err, contents) {
    //console.log(contents);
	console.log(contents.indexOf("paragraph"));
});
 
//var string = contents;


 
//console.log('after calling readFile');