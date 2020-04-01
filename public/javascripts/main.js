const input = $( "#query" );
input.keyup(function(e) {
	const count = input.val().length;
	$( "#char_counter" ).html( `${count}/180` );
});

input.keypress(function(e) {
	const count = input.val().length;
	if(count >= 180){
		e.preventDefault();
	}
});
