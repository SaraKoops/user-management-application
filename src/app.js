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

app.get('/searching', function (request, response){
	
	var zoekterm = request.query.search;
 	
 	console.log(zoekterm);
	
	response.send('results')
})


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


