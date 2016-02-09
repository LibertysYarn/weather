$(document).ready(function() {
  getLocation();
  var appId = 'f9ac58d42469c107ee28a3aba7afd53a';
  var $address = $('#address');
  var $tempF = $('#tempF');
  var $tempC = $('#tempC');
  var $sky = $('#sky');
  var $icon = $('#icon');
  var $wind = $('#wind');
  var sunrise = [];
  var sunset = [];

  function getLocation() {
    $.get('http://ipinfo.io', function(ipInfo) {
      var latsplit = ipInfo.loc.split(',', 2);
      var lat = latsplit[0];
      var lon = latsplit[1];
      getWeather(lat, lon);
    }, 'jsonp');

    $.get(('http://ip-api.com/json/?'), function(data) {
      var city = data.city;
      var region = data.regionName;
      $address.html(data.city + ', ' + data.region);
    }, 'jsonp');
  }

  function degToCompass(num) {
    var val = Math.floor((num / 22.5) + 0.5);
    var arr = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return arr[(val % 16)];
  }

  function getWeather(lat, lon) {
    $.get(('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + appId),

      function(weather) {
        var tempK = (weather.main.temp).toFixed(0);
        var tempF = (((weather.main.temp - 273.15) * 9 / 5) + 32).toFixed(0);
        var tempC = ((weather.main.temp) - 273.15).toFixed(0);
        var icon = 'http://openweathermap.org/img/w/' + weather.weather[0].icon + '.png';
        var wind = (weather.wind.speed * 1.94).toFixed(0);
        var degree = degToCompass(weather.wind.deg);
        var clouds = (weather.clouds.all);
        var sunR = (weather.sys.sunrise);
        var sunS = (weather.sys.sunset);

        cloudy(clouds);

        $wind.text(degree + ' ' + wind + ' knots');
        $tempF.text(tempF + '\xB0' + 'F');
        $sky.text(weather.weather[0].description);
        $tempC.text(tempC + '\xB0' + 'C');
        $('#tempK').text(tempK + '\xB0' + 'K');
        $icon
          .append("<img src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png'>");

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
            console.log("dusk");
            $('#clouds').css({
              "background-color": "rgba(246, 160, 147, 0.5)",
              "background-blend-mode": "multiply"
            });
          } else if (nowM > sunriseM - 60 && nowM <= sunriseM + 60) {
            console.log("dawn");
            $('#clouds').css({
              "background-color": "rgba(237, 171, 227, 0.5)",
              "background-blend-mode": "multiply"
            });
          } else if (nowM > sunriseM + 60 && nowM <= sunsetM - 60) {
            console.log("day");
          } else {
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
      $('.cloud').css({
        "display": "none"
      });
      $('#clouds').css({
        "padding": "300px 0px"
      });

    } else if (clouds > 80) {
      function twiceCloud() {
        $cloudNode2.append($cloudNode2);
        $cloudNode3.append($cloudNode3);
        $cloudNode4.append($cloudNode4);
        $cloudNode5.append($cloudNode5);
        $cloudNode1.append($cloudNode1);
      };
    } else if (81 < clouds > 100) {
      twiceCloud(2);
    } else {

    }
  }

}(jQuery));

// Google Fonts //
WebFontConfig = {
  google: {
    families: ['Nixie+One::latin', 'Hind+Vadodara:500:latin'],
  },
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
});