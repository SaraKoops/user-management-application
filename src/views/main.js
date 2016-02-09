
$(function(){

	$('#search').on('keyup', function(e){ // the search bar is has id# -- on 'keyup' an element is sent when the user releases a key on the keyboard.
     
     var typing = {search: $(this).val()}; // puts what is typed into searchbar as an object and  stores it in variable val. This data is then sent to the server.
       
       $.getJSON('/resources/users.json', typing, function(data) { // load JSON-encoded data from the server using a GET HTTP request

       		$('#results').html(data); // send result to client
   			 
   		});

	});

});