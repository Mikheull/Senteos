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
