// $(document).ready(function () {
// getLocation();
let appId = 'f9ac58d42469c107ee28a3aba7afd53a',
	address = $('#address'),
	tempFid = $('#tempF'),
	tempCid = $('#tempC'),
	skyId = $('#sky'),
	iconId = $('#icon'),
	windId = $('#wind'),
  lat = '',
  lon = '',
	iconTime= 'd',
	sunrise = [],
	sunset = [],
	hours = new Date().getHours(),
	mins = new Date().getMinutes();



// function getLocation() {
// $.getJSON('http://ipinfo.io/8.8.8.8', function(data){
//   console.log(data)
// 	var latsplit = data.loc.split(',', 2);
// 	var lat = latsplit[0];
// 	var lon = latsplit[1];
// })

$.getJSON('http://ip-api.com/json', function (data) {
	// var city = data.city,
	// 	region = data.regionName,
		lat = data.lat,
		lon = data.lon;
    console.log(lat + ' , '+ lon);
	address.html(data.city + ', ' + data.regionName);
	getWeather(lat, lon);
});

// }


function degToCompass(num) {
	var val = Math.floor((num / 22.5) + 0.5);
	var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
	return arr[(val % 16)];
}

function getWeather(lat, lon) {
	$.get(('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=' + appId),

		function (weather) {
			var tempK = (weather.main.temp).toFixed(0);
			var tempF = (((weather.main.temp - 273.15) * 9 / 5) + 32).toFixed(0);
			var tempC = ((weather.main.temp) - 273.15).toFixed(0);
			var iconOwf =  weather.weather[0].id + '-' + iconTime;
			var wind = (weather.wind.speed * 1.94).toFixed(0);
			// var degree = degToCompass(weather.wind.deg);
			var clouds = (weather.clouds.all);
			var sunR = (weather.sys.sunrise);
			var sunS = (weather.sys.sunset);
      console.log(clouds + '%', iconOwf);
			cloudy(clouds);

			iconId.append('<i class="owf owf-'+iconOwf+ '"></i>');
			windId.text(degToCompass(weather.wind.deg) + ' ' + wind + ' knots');
			tempFid.text(tempF + '\xB0' + 'F');
			skyId.text(weather.weather[0].description);
			tempCid.text(tempC + '\xB0' + 'C');
			$('#tempK').text(tempK + '\xB0' + 'K');

			function sRTime() {
				var sunrise1 = new Date(sunR * 1000);
				var sH = sunrise1.getHours();
				var sM = sunrise1.getMinutes();
				sunrise.push(sH, sM);
			}

			function sSTime() {
				var sunset1 = new Date(sunS * 1000);
				var sSH = sunset1.getHours();
				var sSM = sunset1.getMinutes();
				sunset.push(sSH, sSM);
			}

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
					/* $('body').css({ "background": "rgba(73, 61, 111, 0.1)" });*/
				}
			}
			tillSun();
		}, 'jsonp');

}

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




    $('.sunmoon .sun-animation').css('width', '70%');
    $('.sun-symbol-path').css('-webkit-transform', 'rotateZ(27deg)');
        



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
