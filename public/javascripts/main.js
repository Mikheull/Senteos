// Search code
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



// Playlist Views
$( "#spotify-view-btn" ).click(function(e) {
	$( this ).addClass('btn-vw-active').removeClass('btn-vw-inactive');
	$( "#brut-view-btn" ).removeClass('btn-vw-active').addClass('btn-vw-inactive');
	$( "#brut-view-cntr" ).hide();
	$( "#spotify-view-cntr" ).show();

});
$( "#brut-view-btn" ).click(function(e) {
	$( this ).addClass('btn-vw-active').removeClass('btn-vw-inactive');
	$( "#spotify-view-btn" ).removeClass('btn-vw-active').addClass('btn-vw-inactive');
	$( "#spotify-view-cntr" ).hide();
	$( "#brut-view-cntr" ).show();
});



// Clic to copy
$( ".ctc-btn" ).click(function (e) {
	const content = $( this ).data('ctc')

	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(content).select();
	document.execCommand("copy");
	$temp.remove();

	$( ".ctc-origin" ).html('Copied !');
	setTimeout(() => {
		$( ".ctc-origin" ).html('Copy URL');
	}, 2000)
});



//Slick integration
$(document).ready(function(){
	$('.slick-carousel').slick({
		dots: true,
		infinite: false,
		speed: 300,
		slidesToShow: 5,
		slidesToScroll: 3,
		autoplay: true,
  		autoplaySpeed: 5000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true
				}
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
});
