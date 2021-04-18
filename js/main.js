const api = {
    key: "880b6ca02bd47f93824534aa1edb76a4",
    base: "https://api.openweathermap.org/data/2.5/",
    lang: "pt_br",
    units: "metric"
}

const city = document.querySelector('.name-city')
const date = document.querySelector('.date')
const container_img = document.querySelector('.container-img')
const container_temp = document.querySelector('.container-temp')
const temp_number = document.querySelector(".container-temp div")
const temp_unit = document.querySelector(".container-temp span")
const weather_t = document.querySelector('.weather')
const search_input = document.querySelector('.form-control')
const search_button = document.querySelector('.btn')
const low_high = document.querySelector('.low-high')

search_button.addEventListener('click', function() {
    searchResults(search_input.value)
})

search_input.addEventListener('keypress', enter)
function enter(event) {
    key = event.keyCode
    if (key === 13) {
        searchResults(search_input.value)
    }
}

function searchResults(city) {
    fetch(`${api.base}weather?q=${city}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(Response => {
            if(!Response.ok){
                throw new Error(`http error: status ${Response.status}`)
            }
            return Response.json()
        })
        .catch(error => {
            alert(error.message)
        })
        .then(Response => {
            displayResults(Response)
        })
}

function displayResults(weather) {
    console.log(weather)

    city.innerText = `${weather.name}, ${weather.sys.country}`
    
    let now = new Date()
    date.innerText = dateBuilder(now)

    let iconName = weather.weather[0].icon
        if(iconName == "01n" | iconName == "02n" | iconName == "03n" | iconName == "04d" | iconName == "04n") {
            container_img.innerHTML = `<img src="./icons/${iconName}.png">`
        }
        else {
            container_img.innerHTML = `<img src="./icons/${iconName}.gif" style="width: 96px; height: 96px;">`
        }

    let temperature = `${Math.round(weather.main.temp)}`
    temp_number.innerHTML = temperature
    temp_unit.innerHTML = '°C'

    weather_t.innerHTML = weather.weather[0].description

    low_high.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`
}

function dateBuilder(d) {
    let days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
    let months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

    let day = days[d.getDay()]
    let date = d.getDate()
    let month = months[d.getMonth()]
    let year = d.getFullYear()

    return `${day}, ${date} ${month} ${year}`
}

container_temp.addEventListener('click', changeTemp)

function changeTemp() {
    temp_numer_now = temp_number.innerHTML

    if(temp_unit.innerHTML === "°C") {
        let f = (temp_numer_now*1.8) + 32
        temp_unit.innerHTML = "F"
        temp_number.innerHTML = Math.round(f)
    }

    else {
        let c = (temp_numer_now-32) / 1.8
        temp_unit.innerHTML = "°C"
        temp_number.innerHTML = Math.round(c)
    }
}

window.addEventListener('load', () => {
    //if ("geolocation" in navigator)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    }
    else {
        alert('navegador não suporta geolozalicação');
    }
    function setPosition(position) {
        console.log(position)
        let lat = position.coords.latitude;
        let long = position.coords.longitude;
        coordResults(lat, long);
    }
    function showError(error) {
        alert(`erro: ${error.message}`);
    }
})

function coordResults(lat, long) {
    fetch(`${api.base}weather?lat=${lat}&lon=${long}&lang=${api.lang}&units=${api.units}&APPID=${api.key}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`http error: status ${response.status}`)
            }
            return response.json();
        })
        .catch(error => {
            alert(error.message)
        })
        .then(response => {
            displayResults(response)
        });
}