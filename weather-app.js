		
//images used from http://fa2png.io/icons/?font=&tag=yahoo&o=tag 
//works fine on chrome and firefox 
		//Project code recived from google api
		var code ="AIzaSyCF6pVE0k4C3w8YmRWnI2Y2OqEBdZP8COo";
		var map, geocoder,infowindow,lat,lng,pos,degrees,speed,distance;
		var country,locality,postal_code,administrative_area_level_1,postal_code;

		var createXmlHttpRequestObject = function(){
			var xhr;
			//for interbrowser older and above
			if(window.ActiveXObject){
				try{
				xhr = new ActiveXObject("Microsoft.xmlHttp");
				}catch(e){
					xhr = false;
				}
			}else{
				try{
					xhr = new XMLHttpRequest();
				}catch(e){
					xhr = false;	
				}
			}
			if(!xhr){
				alert("something went wrong sorry");
			}else{
				return xhr;
			}
		}

		//funciton sends the url to yahoo api and retrives the json file which contains information as a json file
		//json data dont need to be parsed as the files is already a json
          var getJSON = function(url, callback,unit) {
		    var xhr = new createXmlHttpRequestObject();
		    xhr.open('GET', url, true);
		    xhr.responseType = 'json';
		    xhr.onload = function() {
		      var status = xhr.status;
		      if (status === 200) {							      	
        		var data = xhr.response;
		        callback(null,data,unit);
		      } else {
		        callback(status, xhr.response,unit);
		      }
		    };
		    xhr.send();
		}

	//fucntion to get the geo location of the user
     var initMap= function(unit) {
         map = new google.maps.Map(document.getElementById('map'), {
          zoom: 8,
          center: {lat: 40.731, lng: -73.997}
        });
         geocoder = new google.maps.Geocoder;
         infowindow = new google.maps.InfoWindow;
         pos ={};
        if (navigator.geolocation) {
        	//inner function which get's the latitute and lonitute, which will be used 
        	//to get their accurate location of the user.
          navigator.geolocation.getCurrentPosition(function(position) {
             pos = {
              lat: position.coords.latitude,
             lng: position.coords.longitude
            };
            geocodeLatLng(geocoder, map, infowindow, pos);
            //sending the url to the ajax function which will return a json file
            if(unit==="C"){
               	//sending a url to get a metric based Json file
        		getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22("+pos.lat+", "+pos.lng+")%22)and%20u%3D%22c%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", getWeather,unit);  
        	}else{
        		//sending a url to get a imerial based Json file 
        		getJSON("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22("+pos.lat+", "+pos.lng+")%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", getWeather,unit); 
        	}

          },function() {
            alert('Error: The Geolocation service failed.');
          });
        } else {
             alert('This browser doesnot support GeoLocation');

        }

              

      }
     //using the geolocation the function will mark user location on google map
     var geocodeLatLng = function(geocoder, map, infowindow, pos) {
         latlng = pos;
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
         	var marker = new google.maps.Marker({
                position: latlng,
                map: map
              });
              infowindow.setContent(results[0].formatted_address);
              infowindow.open(map, marker);
            	              map.setZoom(11);
            } else {
              alert('No results found');
            }
          } else {
           		alert('Geocoder failed due to: ' + status);
          }
        });

      }

     //function convert the json file and diaplay weather report
	var getWeather = function(status, response,unit){
			if(status == null){
				var x = document.getElementById("current-weather");
				var a = document.getElementsByClassName("weather");
				if(unit === "C"){
					degrees = ' &#x2103;';
					speed =" KPH";
					distance=" KM";
				}else{
					degrees = ' &#x2109;';
					speed =" MPH";
					distance =" Miles";

				}
				var weather = response;
				x.innerHTML ="<div id='title'>"+
								"<p>"+weather.query.results.channel.item.pubDate+"</p>"+
							"</div>"+	
								
							"<div id='title'>"+
								"<h1>"+weather.query.results.channel.location.city+" ,"+ weather.query.results.channel.location.country+"</h1>"+
							"</div>"+
							
							"<div id='current-temp'>"+
								"<div id='title'>"+
									"<h2>"+"Forcast: "+weather.query.results.channel.item.condition.text +"</h2>"+
								"</div>"+
								"<div id='title'>"+
									"<h2>"+"Current temp: "+weather.query.results.channel.item.condition.temp+degrees +"</h2>"+
								"</div>"+
								"<div id='title'>"+
									"<p>"+"Humidity: "+weather.query.results.channel.atmosphere.humidity + " %" +"</p>"+
									"<p>"+"wind speed: "+weather.query.results.channel.wind.speed+ speed +"</p>"+
									"<p>"+"visibility: "+weather.query.results.channel.atmosphere.visibility +distance+"</p>"+
									"<p> Sunrise: "+weather.query.results.channel.astronomy.sunrise+ " Sunset: "+weather.query.results.channel.astronomy.sunset+"</p>"+	
								"</div>"+
								"<div id='image'>"+
									"<img src=bigger/"+weather.query.results.channel.item.condition.code+".png>"+
								"</div>"+
							"</div>";
				var num = weather.query.results.channel.item.forecast;

				for (var component=0;component<7;component++){
 						a[component].innerHTML =
	 												"<p>"+ num[component].day+":"+"</p>"+
													"<p>"+ num[component].date+"</p>"+
													"<p>"+"High temp: " +num[component].high+degrees  +"</p>"+
													"<p>"+"Low temp: " +num[component].low+degrees +"</p>"+
													"<p>"+"Forecast: "+num[component].text+"</p>"+
													"<img src=smaller/"+num[component].code+".png>";
				}
			}else{
           			 alert('weather report failed to load due to : ' + status);

			}
	}
