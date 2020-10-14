
var cities = [];   
var cityName = "";

function renderButtons() {
    
    // Clear buttonlist element 
    $("#buttons-view").empty();

    // Render a new button for each city
    for (var i=0; i<cities.length; i++) {
        var btn = $("<button>");
        btn.addClass("city btn btn-light");
        btn.attr("data-name", cities[i]);
        btn.text(cities[i]);
        $("#buttons-view").prepend(btn);
    }

    $(".city").on("click", function(event) {
        event.preventDefault();
        // grab the text from the city search input
        cityName = $(this).text();
        searchFunction(); 
            
    });

}

init();

function init() {
    // Get stored cities from localStorage
    // Parsing the JSON string to an object
    let storedCities = JSON.parse(localStorage.getItem("cities"));
    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
      }
    
    // Render cities to the DOM
    renderButtons();
    cityName = localStorage.getItem("lastcity");

    searchFunction();

}

function searchFunction() {

    // construct URL
    var APIKey ="b8af085dc2c5f86081eb908fd3532ff4";
    var queryURLcurrent = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
    var queryURLforecast = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIKey;
    
    function currentDayWeather (response) {
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

    };

    // API call for current day weather

    $.ajax({
        url: queryURLcurrent,
        method: "GET"
    }).then(function(response){

        currentDayWeather(response);
       
        // Display UV index
        var currentUVindex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" +APIKey;


        // API call for current UV index inside current day weather
        $.ajax({
            url: currentUVindex,
            method: "GET"
        }).then(function(uvresponse){

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
            let fiveDayCard = $("<div>");
            fiveDayCard.attr("class", "card fiveDayCard bg-primary");

            fiveDayForecast.append(fiveDayCard);
            
            //  Convert time from unixtime GMT to MM/DD/YYYY
            let date = response.list[i].dt;
            let newDate = new Date(date * 1000);
            let displayDate = newDate.toLocaleDateString();
            let h5El = $("<h5>");
            h5El.text(displayDate);
            // divEl.append(h5El);
            fiveDayCard.append(h5El);

             // Get weather icon
             let iconcode = response.list[i].weather[0].icon;
             let iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
             let weathericon = $("<img>");
             weathericon.attr('src', iconurl);
             let divEl = $("<div>");
             divEl.append(weathericon);
             fiveDayCard.append(divEl);
             
    
            // Get temperature
            let Ftemp = (response.list[i].main.temp - 273.15) * 1.80 + 32; 
            let fivedaytemperature = "Temp:" + Ftemp.toFixed(1) + "°F";
            let tempEl = $("<p>");
            tempEl.text(fivedaytemperature);
            fiveDayCard.append(tempEl);

            // Get humidty
            let fiveDayHumidity = "Humidity:" + response.list[i].main.humidity + "%";
            let humidityEl = $("<p>");
            humidityEl.text(fiveDayHumidity);
            fiveDayCard.append(humidityEl);           
        } 
    };

    // API call for 5 day forecast

    $.ajax({
        url: queryURLforecast,
        method: "GET"
    }).then(function(response){
       
        // call fiveDayForecast function
        $("#5dayforecast").empty();
        fiveDayForecast(response);     
    })
    
    function storedCities () {
        // Stringify and set "cities" key in localStorage to cities array
        localStorage.setItem("cities", JSON.stringify(cities));
    }
    
    var city = $("#city-input").val().trim();
     
    // Return from function early if submitted city-input is blank
    if (city === "" ) {
        return;        
    }
        
    for (let i = 0; i < cities.length; i++) {
        if (city === cities[i]) {
            alert ("You have already searched" + cities[i] )
            return;
        } 
    }

    // Add new city button to cities array, clear the input
    cities.push(city);
    $("#city-input").val("");   
    storedCities();
    renderButtons(); 
        

}



$("#searchBtn").on("click", function(event) {
    event.preventDefault();
    // grab the text from the city search input
    cityName = $("#city-input").val();
    searchFunction(); 
    if (cityName === "") {
        return;
    }
    localStorage.setItem("lastcity", cityName);
    console.log(cityName);
    console.log(cities);
            
});










// five day forecast
// B. for loop for the city buttons 
    // local storage get item parse
    // local storage
    // array for the city

// activity 6-9