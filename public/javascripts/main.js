let socket = io.connect();


const input = $( "#query" );
// Characters counter
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
socket.on('connect', () => {

	$(document).on('click', '#btn-send-query', function(e) {
		e.preventDefault();
		socket.emit('send_query', input.val(), socket.id);
	});

	socket.on('response_query', function(error_status, error_message, sentence, response) {
		$( "#response" ).removeClass('hidden');
		$( "#original_sentence, #response_playlist" ).empty();

		$( "#original_sentence" ).html( sentence );
		if(error_status){
			$( "#response_playlist" ).html( `<p class="text-red-700 text-xs">${error_message}<p>` );
		}else{
			for(i = 0; i < response.length; i++){
				$( "#response_playlist" ).append( `<iframe src="https://open.spotify.com/embed/track/${response[i].first_response.id}" width="300" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>` );
			}
		}
	});
});


