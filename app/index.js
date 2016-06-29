//INITIATES ALL THE VARIABLES!
let appId = 'f9ac58d42469c107ee28a3aba7afd53a',
	address = $('#address'),
	tempFid = $('#tempF'),
	tempCid = $('#tempC'),
	skyId = $('#sky'),
	iconId = $('#icon'),
	windId = $('#wind'),
  lat = '',
  lon = '',
	clouds = 0;
	iconTime= 'd',
	sunrise = [],
	sunset = [],
	hours = new Date().getHours(),
	mins = new Date().getMinutes();


// users IP to grab latitdue and longitude - appends the UI to show city and state
$.getJSON('http://ip-api.com/json', function (data) {
		lat = data.lat,
		lon = data.lon;
    console.log(lat + ' , '+ lon);
	address.html(data.city + ', ' + data.regionName);
	getWeather(lat, lon);
});

// }


// translates wind direction degree to compass value - appends UI to show direction
function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return arr[(val % 16)];
}


// uses location to get weather data from the OpenWeather API
function getWeather(lat, lon) {
	$.get(('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + appId),

		function (weather) {
			var tempK = (weather.main.temp).toFixed(0);
			$('#tempK').text(tempK + '\xB0' + 'K');

			// gets temp and converts from Kelvin to Farenheit - appends the UI
			var tempF = (((weather.main.temp - 273.15) * 9 / 5) + 32).toFixed(0);
			tempFid.text(tempF + '\xB0' + 'F');

			// gets the temp and coverts from Kelvin to Celcius - appends the UI
			var tempC = ((weather.main.temp) - 273.15).toFixed(0);
			tempCid.text(tempC + '\xB0' + 'C');

			// gets the wind speed and converts to knots - appends the UI with speed
			var wind = (weather.wind.speed * 1.94).toFixed(0);
			windId.text(degToCompass(weather.wind.deg) + ' ' + wind + ' knots');

			// gets the local sunrise and sunset times in miliseconds
			var sunR = (weather.sys.sunrise);
			var sunS = (weather.sys.sunset);

			// gets the level of clouds and calls cloudy() to appends the UI
			clouds = (weather.clouds.all);
			console.log(clouds + '%', iconOwf);
			cloudy(clouds);

			// gets the local weather code and appends the UI with corresponding day or night version icon
			var iconOwf =  weather.weather[0].id + '-' + iconTime;
			iconId.append('<i class="owf owf-'+iconOwf+ '"></i>');

			// gets the weather description and appends the UI
			skyId.text(weather.weather[0].description);

// gets sunrise time for location and converts to hours and minutes for use in tillSun()
			function sRTime() {
				var sunrise1 = new Date(sunR * 1000);
				var sH = sunrise1.getHours();
				var sM = sunrise1.getMinutes();
				sunrise.push(sH, sM);
			}

// gets sunset time location and converts to hours and minutes for use in tillSun()
			function sSTime() {
				var sunset1 = new Date(sunS * 1000);
				var sSH = sunset1.getHours();
				var sSM = sunset1.getMinutes();
				sunset.push(sSH, sSM);
			}


// determines background color - closer to dawn/dusk sky is pink, night is dark
			function tillSun() {
				sRTime();
				sSTime();
				var now = new Date();
				var nowM = now.getHours() * 60 + now.getMinutes();
				var sunriseM = sunrise[0] * 60 + sunrise[1];
				var sunsetM = sunset[0] * 60 + sunset[1];

				if (nowM > sunsetM - 60 && nowM <= sunsetM + 60) {
					iconTime = 'n';
					console.log("dusk");
					$('#clouds').css({
						"background-color": "rgba(246, 160, 147, 0.5)",
						"background-blend-mode": "multiply"
					});
				} else if (nowM > sunriseM - 60 && nowM <= sunriseM + 60) {
					iconTime = 'd';
					console.log("dawn");
					$('#clouds').css({
						"background-color": "rgba(237, 171, 227, 0.5)",
						"background-blend-mode": "multiply"
					});
				} else if (nowM > sunriseM + 60 && nowM <= sunsetM - 60) {
					iconTime = 'd';
					console.log("day");
				} else {
					iconTime = 'n';
					console.log("night");
					$('#clouds').css({
						"background-color": "rgba(73, 61, 111, 0.1)",
						"background": "-webkit-linear-gradient(top, #493D6F 0%, #333 100%)",
						"background": "-linear-gradient(top, #493D6F 0%, #333 100%)",
						"background": "-moz-linear-gradient(top, #493D6F 0%, #333 100%)",
						"background": "-o-linear-gradient(top, #493D6F 0%, #333 100%)",
						"background": "-ms-linear-gradient(top, #493D6F 0%, #333 100%)"
					});
				}
			}
			tillSun();
		}, 'jsonp');

}


// Clouds behavior based on percent cloudiness from OpenWeather API
function cloudy(clouds) {
	var $cloudNode = $('#clouds');
	var $cloudNode1 = $('.x1');
	var $cloudNode2 = $('.x2');
	var $cloudNode3 = $('.x3');
	var $cloudNode4 = $('.x4');
	var $cloudNode5 = $('.x5');

	if (clouds < 20) {
    console.log('you should not see clouds')
		$('.cloud').css({
			"display": "none"
		});
		$('#clouds').css({
			"padding": "300px 0"
		});

	} else if (21 < clouds > 80) {
    console.log('you should see some clouds')
		function twiceCloud() {
			$cloudNode2.append($cloudNode2);
			$cloudNode3.append($cloudNode3);
			$cloudNode4.append($cloudNode4);
			$cloudNode5.append($cloudNode5);
			$cloudNode1.append($cloudNode1);
		}
	} else if (81 < clouds > 100) {
    console.log('you should see a bunch of clouds')
		twiceCloud(2);
	} else {

	}
}

// working on solar path
// sunLoc(hours, mins);
//
// function sunLoc(hours, mins) {
//     var w = 500;
//     var h = 300;
// 		var sunPos = (((hours)*60 + mins) / (24.00*60.00)) * Math.PI * 2;
//
//     xCoord = (w/2) - (w*Math.sin(sunPos))/2;
//     yCoord = (h/2) + (h*Math.cos(sunPos))/2;
//     $(".sun").css({
//         "top": yCoord,
//         "left": xCoord,
//     });
//     setTimeout(function(){ sunLoc(hours, mins); }, 10000);
// }
		//
    // $('.sunmoon .sun-animation').css('width', '70%');
    // $('.sun-symbol-path').css('-webkit-transform', 'rotateZ(27deg)');




// }());

// Google Fonts //
WebFontConfig = {
	google: {
		families: ['Nixie+One::latin', 'Hind+Vadodara:500:latin'],
	},
};
(function () {
	var wf = document.createElement('script');
	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
	wf.type = 'text/javascript';
	wf.async = 'true';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(wf, s);
});
