// creat route which renders list of users

var express = require ('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express ();

app.set('views', 'src/views');
app.set('view engine', 'jade');

app.use(express.static('public')); // elk statische file dat je gebruikt leest ie uit de folder public.
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, response){
	fs.readFile('./resources/users.json', function (err, data) {
		if (err) {
			console.log(err)
		}

		var parsedData = JSON.parse(data);
		console.log(parsedData);
		response.render("index", {
			users: parsedData
		});
	});
});

//create 2nd route wich renders search bar

app.get('/search', function (request, response) {

	response.render("search")
});

app.get('/searching', function (request, response){ // ajax route for the autodisplay in searchbar
	
	var zoekterm = request.query.search;
 	
 	// console.log(zoekterm);

 	fs.readFile('./resources/users.json', function (err, data) {
		
		var userlijst = JSON.parse(data); // dit is een array

		console.log(userlijst);
		console.log(zoekterm);

		var corresponding = [];
		// loop door de resultaten om overeenkomende eerste letter te vinden

		var regzoekterm = '^'+zoekterm; // dakje --> matches beginning of input. zoekterm + '$', dan matched aan het einde van de input.
		//omdat ik wil dat het match vanaf eerste letter maak ik nieuwe variable met ^. Die doe ik vervolgens in RegExp.
			
		var re = new RegExp(regzoekterm, 'gi'); // regular expression: patterns used to match character combinations in strings
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
		// nieuw regular expression object
			
		for (i = 0; i < userlijst.length; i++) {

			// console.log("loop is running");
		
			//if (userlijst[i].firstname[0] == zoekterm || userlijst[i].lastname[0] == zoekterm) {

			if (zoekterm == '') {
				corresponding.push('<span style="color: #000000">' + userlijst[i].firstname + ' ' + userlijst[i].lastname + '</span><br>');
				// als zoekterm spatie is dan push het naar array
			
			} else {
				
				
				if(userlijst[i].firstname.match(re) || userlijst[i].lastname.match(re)) { // match https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
						//pak de firstname of! lastname uit de array en daarvan de eerste letter

						if(userlijst[i].firstname.match(re) && userlijst[i].lastname.match(re))
							corresponding.push('<span style="color: #ff0000">'+userlijst[i].firstname + ' ' + userlijst[i].lastname + '</span><br>');
						
						else {
								if(userlijst[i].lastname.match(re))
								corresponding.push(userlijst[i].firstname + '<span style="color: #ff0000"> '+ userlijst[i].lastname + '</span><br>');

								if(userlijst[i].firstname.match(re))	
								corresponding.push('<span style="color: #ff0000">' + userlijst[i].firstname + '</span> ' + userlijst[i].lastname + '<br>');					
						}
				}
			}	

		};

		console.log(corresponding);	

		var results = ""

			if (corresponding.length > 0){

				results = corresponding
			}		

		response.send(results)

	});
});


//create 3rd route which takes post request from search form
//display matching users on new page --> based on either first or last name (string!);
//http://code.runnable.com/U0sU598vXio2uD-1/example-reading-form-input-with-express-4-0-and-body-parser-for-node-js

app.post('/searchresult', function(request, response) {
	
	var userName = request.body.userName;

	fs.readFile('./resources/users.json', function (err, data) {
		
		var parsedData = JSON.parse(data);
		//parsedData is een array met 4 objecten

		var matchUserName = [];

		for (i = 0; i < parsedData.length; i++) {

			if (parsedData[i].firstname == userName || parsedData[i].lastname == userName) {
					//pak het desbetreffende object en show me this

					matchUserName.push(parsedData[i]);
				}

		}	

		var html = ""

			if (matchUserName.length > 0){

				html = matchUserName[0].firstname + " " + matchUserName[0].lastname + "<br>" + matchUserName[0].email;		

			} else {

				html = "Oops, sorry! No matching users found."
			}

		response.send(html);

	});

});

// create a 4th route that renders a page with three forms on it (first name, last name, and email) 
// add new users to the users.json file
// to do: read - pars - push - stringify - done
// redirect to list users /

app.get('/add', function(request, response) {
	response.render("add");
});

app.get('/')

app.post('/newuser', function(request, response) {

	var firstName = request.body.firstName;
	var lastName = request.body.lastName;
	var eMail = request.body.eMail;

	var newUser = {}
	newUser.firstname = firstName
	newUser.lastname = lastName
	newUser.email = eMail

	fs.readFile('./resources/users.json', function (err, data) {
		
		var parsedData = JSON.parse(data);

		parsedData.push(newUser);

		writeFileFunction (parsedData); // calback function

	});
	
	function writeFileFunction (newUserInfo) {

		var newUserInfo = JSON.stringify(newUserInfo);

		fs.writeFile("./resources/users.json", newUserInfo, function (err) {
			if (err) {
				throw err;
			}
		});
	};	

	
response.redirect('/');

});


var server = app.listen(3000, function (){
	console.log('Example app listening on port: ' + server.address().port);
});