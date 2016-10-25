var express = require('express');
var router = express.Router();

var mammoth = require('mammoth');

var path = require('path');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);


var querystring = require('querystring');
var http = require('http');
var request = require("request");
var session = require('express-session');
var fileUpload = require('express-fileupload');
var request = require("request");
var unique = require('array-unique');
const fileType = require('file-type');
const readChunk = require('read-chunk');
//var filetype = require('file-type');
//var readChunk = require('read-chunk');

let PDFParser = require("pdf2json");


//----- Creating a mysql connecrion --------//

var mysql = require('mysql')

//------ Checking The Doc File -----------//


module.exports.readText = router.get('/readText', function(req, res, callback){

const buffer = readChunk.sync('SudeshnaPatra[1_0].pdf', 0, 262);
console.log(fileType(buffer));

	
/*const url = '';
 
http.get(url, res => {
    res.once('data', chunk => {
        res.destroy();
        console.log(fileType(chunk));
        //=> {ext: 'gif', mime: 'image/gif'} 
    });
}); */
});

//------ End Here ---------------------//











//----- Reading Doc --------------//

module.exports.readDoc = router.get('/readDoc', function(req, res, callback){
	
	//----- mammoth reading file -----//
	
	mammoth.extractRawText({path: "lasttest.docx"}, "p[style-name='Section Title'] => h1:fresh")
    .then(function(docx) {
		
		
		
		var myJSONString = JSON.stringify(docx);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "")
                                      .replace(/\\'/g, "")
                                      .replace(/\\"/g, '')
                                      .replace(/\\&/g, "")
                                      .replace(/\\r/g, "")
                                      .replace(/\\t/g, "")
                                      .replace(/\\b/g, "")
                                      .replace(/\\f/g, "");
		var jsonObject = JSON.parse(myEscapedJSONString);
		res.send(jsonObject.value);
		
		var string = jsonObject.value;
		console.log(string.indexOf("paragraph"))
        		
		//console.log(myEscapedJSONString);

		//res.send(docx);
        fs.writeFile("kiran.txt", docx, callback);
    });
	
	//------ End Here -------------//
	
	
	
	
	
	fs.readFile('test.txt', 'utf8', function(err, contents) {
    //console.log(contents);
	//res.send(contents);
	//console.log(contents.indexOf("paragraph"));
});
});



//------ End Here -----------------//

//------- REGISTER PAGE ------------//

module.exports.readDjango = router.get('/readDjango' , function(req, res){
	res.render('index',{ title : 'Test' });
});

//-------- END HERE -------------//

module.exports.userRecord = router.post('/userRecord' , function(req, res){
	console.log("Hello");
	var email = req.body.email;
	 var data = querystring.stringify({
      username: req.body.username,
      password: req.body.password,
	  fullname: req.body.fullname,
	  address: req.body.address,
	  phone: req.body.phone,
	  email: req.body.email
    });
	
	var options = {
    host: '121.242.13.22',
    port: 8015,
    path: '/user_register/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
	  var jsonObject = JSON.parse(chunk);
	  if(jsonObject.Status == 1){
		
			res.redirect('/Djangologin');
			
		
	  }
	  else{
		  
		  res.redirect('/userRecord');
	  }
	  
    });
	
	 response.on('end', function() {
      //res.send('ok');
	  console.log("Ok");
    })
  });
  
  
  httpreq.write(data);
  
 
  
});

module.exports.Djangologin = router.get('/Djangologin' , function(req, res){
	res.render('login',{ title : 'Login Here' });
});


//----- Login Details Here --------------//


module.exports.newuserLoginRecord = router.post('/newuserLoginRecord' , function(req, res){
	
	console.log("Hello Wolrd");
	 var data = querystring.stringify({
      username: req.body.username,
      password: req.body.password
	  
    });
	
	var options = {
    host: '121.242.13.22',
    port: 8015,
    path: '/user_login/',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(data)
    }
  };
  
  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
	  var jsonObject = JSON.parse(chunk);
	  if(jsonObject.Status == 1){
		    console.log(jsonObject.id);
		    req.session.id= jsonObject.id;
			req.session.email = jsonObject.email;
			
			res.redirect('/Djangohome');
			
		
	  }
	  else{
		  
		  res.redirect('/readDjango');
	  }
	  
    });
	
	 response.on('end', function() {
      //res.send('ok');
	  console.log("Ok");
    })
  });
  
  
  httpreq.write(data);
	
});


//------ End Here --------------------------//

//------ Getting DjangoHome -----//

module.exports.Djangohome = router.get('/Djangohome' , function(req, res){
	//console.log(appDir);
	
	//------------- GETTING DATA OF THE PAGE ----------------------------------//
	
	var url = "http://121.242.13.22:8015/techprofile/?format=json&user_id="+req.session.id;
	var userData= [];
	var Array;

      request({
       url: url,
         json: true
         }, function (error, response, body) {

         if (!error && response.statusCode === 200) {
             //console.log(body) // Print the json response
			 
			 //---- Getting Json data ---//
			 
			     //Array = body;
                 //console.log(Array[0]["url"].toString());
				 console.log(body);
				 
				 res.render('home',{ title : 'Home', user_id : req.session.id, user_email : req.session.email,cv_data: body });
			 
			 //------ End Here ---------//
			 
			 //var userData = JSON.parse(body);
			 
        }
     });
	
	
	
	//------------------------ END HERE ---------------------------------------//
	
	//res.render('home',{ title : 'Home', user_id : req.session.id, user_email : req.session.email,cv_data: userData });
});

//------ End Here -----------//

module.exports.newuserCVRecord = router.post('/newuserCVRecord' , function(req, res,callback){
	
	var sampleFile;
	var content ;
	var link_cv;
 
    if (!req.files) {
        res.send('No files were uploaded.');
        return;
    }
	
    sampleFile = req.files.sampleFile;
	
	
	
	
	var file_ext = sampleFile.mimetype;
	
	
	var user_id = req.body.user_id;
	var user_email = req.body.user_email;
	
	
	
	
	if(file_ext=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
	 link_cv = user_email+'_'+user_id+'.docx';
	}
	if(file_ext=="application/pdf"){
	 link_cv = user_email+'_'+user_id+'.pdf';
		
	} 
	

	//var link_cv = user_email+'_'+user_id+'.docx';
	
	
	
	var cv =  appDir+'/public/upload/'+link_cv;
	
	
	
	
    
	
	
	   sampleFile.mv(cv, function(err) {
        if (err) {

            res.status(500).send(err);
        }
        else {
			console.log('File Uploaded');
            //res.send('File uploaded!');
			
			//------------------ Reading Docx --------------------//
			
			
			
			if(file_ext=="application/vnd.openxmlformats-officedocument.wordprocessingml.document"){
				
				mammoth.extractRawText({path: cv}, "p[style-name='Section Title'] => h1:fresh")
    .then(function(docx) {
		
		
		
		var myJSONString = JSON.stringify(docx);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "")
                                      .replace(/\\'/g, "")
                                      .replace(/\\"/g, '')
                                      .replace(/\\&/g, "")
                                      .replace(/\\r/g, "")
                                      .replace(/\\t/g, "")
                                      .replace(/\\b/g, "")
                                      .replace(/\\f/g, "");
		var jsonObject = JSON.parse(myEscapedJSONString);
		//res.send(jsonObject.value);
		//res.send(myEscapedJSONString);
		
		var cvText = jsonObject.value;
		
		
		fs.readFile('technology.txt', 'utf8', function(err, contents) {
        console.log(contents);
		
		//------ Matching common word between string -----//
		
		var words1 = cvText.split(/\s+/g),
            words2 = contents.split(/\s+/g),
    i,
    j;
	    var keywords = [];
		var uniqueNames = [];

for (i = 0; i < words2.length; i++) {
    for (j = 0; j < words1.length; j++) {
        if (words2[i].toLowerCase() == words1[j].toLowerCase()) {
		   keywords.push(words2[i]);
		   
           console.log('word '+words2[i]+' was found in both strings');
        }
    }
}     
        keywords = unique(keywords);
		var key_terms = keywords.toString();
		
		//------ End Here -----------------------------//
	   
	

		
		
		//------ UPLOADING AND SENDING FILE TO ANOTHER SERVER ---------//
		var data = querystring.stringify({
          user_id: user_id,
          email_user_email: user_email,
	      cv_upload : link_cv,
		  cv_text : jsonObject.value,
		  skills : key_terms
	    });
		
			var options = {
              host: '121.242.13.22',
              port: 8015,
              path: '/profile_upload/',
              method: 'POST',
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Content-Length': Buffer.byteLength(data)
                  }
             };
		
		
		  var httpreq = http.request(options, function (response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
         console.log("body: " + chunk);
	      var jsonObject = JSON.parse(chunk);
	     if(jsonObject.Status == 1){
		    console.log(jsonObject.id);
		    req.session.id= jsonObject.id;
			req.session.email = jsonObject.email;
			 
			res.redirect('/Djangohome');
		}
	  else{
		  
		  res.redirect('/userRecord');
	  }
	  
    });
	
	 response.on('end', function() {
      //res.send('ok');
	  console.log("Ok");
    })
  });
  
  
  httpreq.write(data);
  //res.send(docx);
  //fs.writeFile("kiran.txt", docx, callback);
    });
	
 });
}

 if(file_ext == "application/pdf"){
	 
	//----------- PDF READING ------//

     let pdfParser = new PDFParser(this,1);
     pdfParser.loadPDF(cv);

     pdfParser.on("pdfParser_dataReady", pdfData => {
        fs.writeFile("readpdf.txt", pdfParser.getRawTextContent());
		  
		
		
		fs.readFile('readpdf.txt', 'utf8', function(err, contents) {
	  
		 
		
		//res.send(contents.split(" ").toString().replace(/\,/g,'=').replace(/\=/g,'&nbsp; &nbsp;'));
		var contents = contents.split(" ").toString().replace(/\,/g,'=').replace(/\=/g,'&nbsp; &nbsp;');
		
        		//------ Matching common word between string -----//
				
		fs.readFile('technology.txt', 'utf8', function(err, textcontents) {
        console.log(contents);
		
		var words1 = contents.split(/\s+/g),
            words2 = textcontents.split(/\s+/g),
    i,
    j;
	    var keywords = [];
		var uniqueNames = [];

for (i = 0; i < words2.length; i++) {
    for (j = 0; j < words1.length; j++) {
        if (words2[i].toLowerCase() == words1[j].toLowerCase()) {
		   keywords.push(words2[i]);
		   
           console.log('word '+words2[i]+' was found in both strings');
        }
    }
}     
        keywords = unique(keywords);
		var key_terms = keywords.toString();
		
		//------ End Here -----------------------------//
		console.log(contents);
		
		var data = querystring.stringify({
          user_id: user_id,
          email_user_email: user_email,
	      cv_upload : link_cv,
		  cv_text : contents,
		  skills : key_terms
	    });
		
			var options = {
              host: '121.242.13.22',
              port: 8015,
              path: '/profile_upload/',
              method: 'POST',
              headers: {
                 'Content-Type': 'application/x-www-form-urlencoded',
                 'Content-Length': Buffer.byteLength(data)
                  }
             };
		
		
		  var httpreq = http.request(options, function (response) {
          response.setEncoding('utf8');
          response.on('data', function (chunk) {
         console.log("body: " + chunk);
	      var jsonObject = JSON.parse(chunk);
	     if(jsonObject.Status == 1){
		    console.log(jsonObject.id);
		    req.session.id= jsonObject.id;
			req.session.email = jsonObject.email;
			 
			res.redirect('/Djangohome');
		}
	  else{
		  
		  res.redirect('/userRecord');
	  }
	  
    });
	
	 response.on('end', function() {
      //res.send('ok');
	  console.log("Ok");
    })
  });
  
  
  httpreq.write(data);
		
	}); 
		
});

    });

//------------ END HERE ----------//	
} 




 
        }
    });
	
	
});

module.exports.DjangoJob = router.get('/DjangoJob' , function(req, res){
	//res.render('job',{ title : 'Job Description' });
    var url = "http://121.242.13.22:8015/jobdescription/?format=json";
	var userData= [];
	var Array;

      request({
       url: url,
         json: true
         }, function (error, response, body) {

         if (!error && response.statusCode === 200) {
             //console.log(body) // Print the json response
			 
			 //---- Getting Json data ---//
			 
			     //Array = body;
                 //console.log(Array[0]["url"].toString());
				 console.log(body);
				 res.render('job',{ title : 'Job Description', job_data: body });
			 
			 //------ End Here ---------//
			 
			 //var userData = JSON.parse(body);
			 
        }
     });
});


module.exports.getSuitableProfile = router.post('/getSuitableProfile' , function(req, res,callback){
	
	
	var job_id = req.body.id_job_match;
	
	var job_keywords = req.body.key_job_match.slice(1,-1);
	
	
	
	var keywords = job_keywords.replace(/'/g, '');
	
	var keywords_array = keywords.split(',');
	
	
	
	var words_check=[];
	
	var user_id = [];
	
	
	
	//res.send(keywords_array);
	
	//------ READING THE JSON FORMAT DATA -----//
	
	var url = "http://121.242.13.22:8015/techprofile/?format=json";
	
	  request({
       url: url,
         json: true
         }, function (error, response, body) {

         if (!error && response.statusCode === 200) {
             //console.log(body) // Print the json response
			 
			 //---- Getting Json data ---//
			 
			     //Array = body;
                 //console.log(Array[0]["url"].toString());
				 
				 
				
				//res.send(body[0]['url']);
				var count = Object.keys(body).length;
				//console.log(count);
				
				 
				 
				 
				 for(var count_user=0; count_user<count; count_user++){
					 
					 var string_match = body[count_user]['cv_text'];
					 
					 
					 var string_array = string_match.split(/\s+&nbsp;\r\n/g);
					 
					 //console.log(string_array.length);
					 
					 //console.log(string_array);
					 //console.log(keywords);
					 
					 for(var i=0; i<keywords_array.length; i++){
						 
						 for(var j=0; j<string_array.length; j++){
							  if(string_array[j].toLowerCase().indexOf(keywords_array[i].toLowerCase()) > -1){
								//console.log("Hello");
								
								words_check.push(keywords_array[i]); 
							 }
						}
					}
					
					
					
					 
					 if(words_check.length>0){
						if(body[count_user]['user_id']!="null"){
						user_id.push({"email" :body[count_user]['email_user_email'],"user_cv_details": body[count_user]['cv_upload'] } );
						}
                     }
					 
					//console.log(unique(words_check));
					words_check = []; 
					 
				 }
				 console.log(user_id);
				 res.render('suitablematch',{ title : 'Suitable Match', employee_data: user_id});
				 //res.send(unique(user_id));
				 
				 //res.render('job',{ title : 'Job Description', job_data: body });
			 
			 //------ End Here ---------//
			 
			 //var userData = JSON.parse(body);
			 
        }
     });
//------ END HERE ------------------------//
});





















