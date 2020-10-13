



// A. WEHN user searches cities, they will get 
    // 1. the current day weather:
        // 1. +ajax url
        // 2. city name, date, image, temperature, humidity, wind speed, 
    // 2. UV index 

var cities = [];    
function renderButtons() {
    $("#buttons-view").empty();
    for (var i=0; i<cities.length; i++) {
        var btn = $("<button>");
        btn.addClass("city btn btn-light");
        btn.attr("data-name", cities[i]);
        btn.text(cities[i]);
        $("#buttons-view").prepend(btn);
    }
}


$("#searchBtn").on("click", function(event) {
    event.preventDefault();

    // grab the text from the city search input
    var cityName = $("#city-input").val();

    // construct URL
    var APIKey ="b8af085dc2c5f86081eb908fd3532ff4";
    var queryURLcurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
    


    // API call for current day weather

    $.ajax({
        url: queryURLcurrent,
        method: "GET"
    }).then(function(response){

        console.log(response);
       
        //  Time of data receiving in unixtime GMT
        let date = response.dt 
        let newDate = new Date(date * 1000);
        let displayDate = newDate.toLocaleDateString();
       
        // Display weather icon
        $("#cityname").text(response.name + "(" + displayDate + ")");
        let iconcode = response.weather[0].icon;
        let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#wicon').attr('src', iconurl);

        // Display temperature, humidity, windspeed
        let Ftemp = (response.main.temp - 273.15) * 1.80 + 32; 
        $("#temperature").text(Ftemp.toFixed(1) + "°F");
        $("#humidity").text(response.main.humidity + "%");
        $("#windspeed").text(response.wind.speed + "MPH");


        // Display UV index
        var currentUVindex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" +APIKey;


        // API call for current UV index inside current day weather
        $.ajax({
            url: currentUVindex,
            method: "GET"
        }).then(function(uvresponse){

            console.log(uvresponse);

            $("#uvindex").text(uvresponse.value);
            if (uvresponse.value < 3 ) {
                $("#uvindex").attr("class", "favorable");
            } else if ( uvresponse.value > 5) {
                $("#uvindex").attr("class", "severe");
            } else {
                $("#uvindex").attr("class", "moderate");
            };

        });

    });
    
    function fiveDayForecast (response) {  

        for (var i=0; i < response.list.length ; i+=8) {
    
            let fiveDayForecast = $("#5dayforecast");
    
            // Create card inside the loop
            let card = $("<div>");
            card.attr("class", "card bg-primary");

            fiveDayForecast.append(card);
    
            // Create cardbody to append to card
            // let cardBody = $("<div>");
            // cardBody.attr("class", "card-body");
            // card.append(cardBody);
            
            // cardBody.empty();

            
            
            //  Convert time from unixtime GMT to MM/DD/YYYY
            let date = response.list[i].dt;
            let newDate = new Date(date * 1000);
            let displayDate = newDate.toLocaleDateString();
            let h5El = $("<h5>");
            h5El.text(displayDate);
            // divEl.append(h5El);
            card.append(h5El);
            

             // Get weather icon
             let iconcode = response.list[i].weather[0].icon;
             let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
             console.log(iconurl);
             let weathericon = $("<img>");
             weathericon.attr('src', iconurl);
             let divEl = $("<div>");
             divEl.append(weathericon);
             card.append(divEl);
             
    
            // Get temperature
            let Ftemp = (response.list[i].main.temp - 273.15) * 1.80 + 32; 
            let fivedaytemperature = "Temp:" + Ftemp.toFixed(1) + "°F";
            let tempEl = $("<p>");
            tempEl.text(fivedaytemperature);
            card.append(tempEl);
            

            // Get humidty
            let fiveDayHumidity = "Humidity:" + response.list[i].main.humidity + "%";
            let humidityEl = $("<p>");
            humidityEl.text(fiveDayHumidity);
            card.append(humidityEl);


           
    
        } 
    };


    // API call for 5 day forecast

    $.ajax({
        url: queryURLforecast,
        method: "GET"
    }).then(function(response){
       
        console.log(response);

        // call fiveDayForecast function
        fiveDayForecast(response);
            
            
    })

    // Push searched city buttons to the list
        
    var city = $("#city-input").val().trim();
        
    if (city !== "" || city.input) { 
               cities.push(city);
    }

       
    renderButtons();
        
        
});







// five day forecast
// B. for loop for the city buttons 
    // local storage get item parse
    // local storage
    // array for the city

// activity 6-9