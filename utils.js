function getWeather(codes){
    let images = []
    codes.forEach((code)=>{
        let image = ""
        
        if (0 <= code && code <= 2){
            image = "images/sunny.svg"
        }
        else if (3 <= code && code <= 48){
            image = "images/cloudy.svg"
        }
        else if (51 <= code && code <= 57){
            image =  "images/drizzle.svg"
        }
        else if ((61 <= code && code <= 67) || (80 <= code && code <= 82)){
            image = "images/rainy.svg"
        }
        else if ((71 <= code && code <= 77) || (85 <= code && code <= 86)){
            image = "images/snow.svg"
        }
        else if (95 <= code){
            image = "images/storm.svg"
        }

        images.push(image)
    })
    return images
}

// Função para pegar as informações de um lugar baseado na latitude e longitude
export async function getLocationInfo(latitude, longitude){
    let promise = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability&forecast_days=8`)
    let response = await promise.json()
    console.log(response)
    return {
        "temp": response["hourly"]["temperature_2m"][0],
        "temp_max": response["daily"]["temperature_2m_max"],
        "temp_min": response["daily"]["temperature_2m_min"],
        "umid": response["hourly"]["relative_humidity_2m"][0],
        "sens_t": response["hourly"]["apparent_temperature"][0],
        "vento": response["hourly"]["wind_speed_10m"][0],
        "nsol": response["daily"]["sunrise"][0].slice(-5),
        "psol": response["daily"]["sunset"][0].slice(-5),
        "pp": response["hourly"]["precipitation_probability"][0],
        "img": getWeather(response["daily"]["weather_code"])
    }
};

export function getFlagEmoji(countryCode) {
    const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
};

