// var cResultText = $('#cResult');
// var tResultText = $('#tResult');
// var hResult = $('#hResult');
// var wResultText = $('#windResult')
var rowC = $("#rowCards")
var dayForecast = $('#rowday');
var cDisplay = $('#cardDisplay');
var UVIR=$('#UVIndexResult')
var buttonL=$('#ButtonsLista');
var forecastD={};
var forecastI ={};
var forecastT={};
var forecastH={};
//Grab Day/Month/Year
var now = dayjs().format('DD'+'/'+"MM"+"/"+"YYYY")

console.log(now)

var citiesArrayed = JSON.parse(localStorage.getItem("Cities")) || [];
var APIKey = "&units=metric&APPID=fe9098631abbbf5538dfbc3698e47dd8";
var url =  "https://api.openweathermap.org/data/2.5/weather?q=";

// $(document).ready(function() {
//     let user = citiesArrayed[citiesArrayed.length -1];
//     currentWeather(user);
//     forecast(user);
//     lastSearch();
// })

function currentWeather(user){
     var queryURL = url+user+APIKey;
     $.ajax(
        {
            url: queryURL,
            method: "GET"
        }
     )
     .then(function(response){
      var cityInfo,Country,Temperature,Humidity,Wind,lat,lon,UVIU;
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      UVIU = "https://api.openweathermap.org/data/2.5/uvi?" + "lat=" + lat + "&" + "lon=" + lon + "&APPID=fe9098631abbbf5538dfbc3698e47dd8"
      cityInfo = response.name;
      Country = response.sys.country;
      Temperature = response.main.temp;
      Humidity = response.main.humidity;
      Wind = response.wind.speed;
      $.ajax({
        url: UVIU,
        method: "GET"
    }).then(function(uvIndex){
        var UVI = uvIndex.value;
        var color;
        if (UVI <= 3) {
            color = "green";
        } else if (UVI >= 3 & UVI <= 6) {
            color = "yellow";
        } else if (UVI >= 6 & UVI <= 8) {
            color = "orange";
        } else {
            color = "red";
        }
        UVIR.empty();
        var UVRT = $("<p>").attr("class", "card-text").text("uv Index: ");
        UVRT.append($("<span>").attr("class", "uvindex").attr("style", ("background-color: " + color)).text(UVI))
        document.createTextNode("UVIndextText")
        UVIndexText.append(UVIR);
        cardDisplay.attr("style", "display: flex; width: 98%");

     }
     )
    }
    )
}
function forecast (UI) {
    dayForecast.empty();
    rowC.empty();
    var fore5 = $("<h2>").attr("class", "forecast").text("5-Day Forecast: "); 
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + UI + "&units=metric&APPID=fe9098631abbbf5538dfbc3698e47dd8";
    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function(response){
        console.log("hello")
        for (var i = 0; i < response.list.length; i += 8){
            forecastD[i] = response.list[i].dt_txt;
            forecastI[i] = response.list[i].weather[0].icon;
            forecastT[i] = response.list[i].main.temp; 
            forecastH[i] = response.list[i].main.humidity;  

            var newCol2 = $("<div>").attr("class", "col-2");
            rowC.append(newCol2);

            var newDivC = $("<div>").attr("class", "card text-white bg-primary mb-3");
            newDivC.attr("style", "max-width: 70%;")
            newCol2.append(newDivC);

            var newCB = $("<div>").attr("class", "card-body");
            newDivC.append(newCB);
            var example =  dayjs(forecastD[i]).format('DD'+'/'+"MM"+"/"+"YYYY")
            
            var newH5 = $("<h5>").attr("class", "card-title").text(example);
            newCB.append(newH5);

            var newImg = $("<img>").attr("class", "card-img-top").attr("src", "https://openweathermap.org/img/wn/" + forecastI[i] + ".png");
            newCB.append(newImg);
            console.log(newImg)
            var newPTemp = $("<p>").attr("class", "card-text").text("Temp: " + Math.floor(forecastT[i]) + "ºC");
            newCB.append(newPTemp);

            var newPHum = $("<p>").attr("class", "card-text").text("Humidity: " + forecastH[i] + " %");
            newCB.append(newPHum);
            console.log(newCB)

            dayForecast.append(fore5);
            // console.log(this)
            };
            })

        }

function storeData (UI) {
    var UI = $("#searchInput").val().trim().toLowerCase();
    var containsCity = false;

    if (citiesArrayed != null) {

		$(citiesArrayed).each(function(x) {
			if (citiesArrayed[x] === UI) {
				containsCity = true;
			}
		});
	}

	if (containsCity === false) {
        citiesArrayed.push(UI);
	}

	localStorage.setItem("Saved City", JSON.stringify(citiesArrayed));

}

function lastSearch () {
    buttonL.empty();
    for (var i = 0; i < citiesArrayed.length; i ++) {
        var newButton = $("<button>").attr("type", "button").attr("class","savedBtn btn btn-secondary btn-lg btn-block");
        newButton.attr("data-name", citiesArrayed[i])
        newButton.text(citiesArrayed[i]);
        buttonL.prepend(newButton);
    }
    $(".savedBtn").on("click", function(event){
        event.preventDefault();
        var UI = $(this).data("name");
        currentWeather(UI);
        forecast(UI);
    })

}

$(".btn").on("click", function (event){
    event.preventDefault();
    if ($("#searchInput").val() === "") {
    alert("Enter a city name");
    } else
    var UI = $("#searchInput").val().trim().toLowerCase();
    currentWeather(UI);
    forecast(UI);
    storeData();
    lastSearch();
    $("#searchInput").val("");

})
