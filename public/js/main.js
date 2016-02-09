$(document).ready(function(){

	$('#search').on('keyup', function(){ // the search bar is has id# -- on 'keyup' an element is sent when the user releases a key on the keyboard.

     var zoekterm = {search: $('#search').val()}; // puts what is typed into searchbar as an object with key search and value 'val' --> stored in variable zoekterm; 
     //This data is then sent to the server.
        
		$.ajax ({ // ajax request sending to the server -- shortcut in jquery is  $.get('/searching',typing, function(data) {}).
		    url: '/searching',
		    data: zoekterm,
		   	error: function () {

		   		consonle.log('werkt niet looser');
		   	}, 
		   	success: function(data){ // callback function. De parameter krijgt de functie uit app.js file door callback functie.

		   		console.log('testtesttest')
				$('#results').html('tooter');
	    	},

	    	type: 'GET'
			
		});

	});

});