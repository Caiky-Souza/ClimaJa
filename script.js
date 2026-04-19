
let locationsList = [];
const results = document.querySelector(".results")
let searchInput = document.querySelector(".search-input")
let resultText = document.querySelector(".result-text");

// Função para transformar um Código de país em um Emoji
function getFlagEmoji(countryCode) {
const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
return String.fromCodePoint(...codePoints);
};

// Função para atualizar os dados do site ao selecionar um local
async function updateData(event){
    event.stopImmediatePropagation()

    let locText = document.querySelector(".local-text")
    let locName = document.querySelector(".local-name")
    
    let button = event.currentTarget
    try{
        if (locName.classList.contains("hidden")){
        locName.classList.remove("hidden")
    }
    }
    catch{
    }
    

    locText.textContent = "Clima em "
    locName.textContent = button.querySelector(".location-name").textContent

    let latitude = button.children["1"].innerHTML
    console.log(button)
    let longitude = button.children["2"].innerHTML

    let info = await getLocationInfo(latitude,longitude)
    console.log(info)

    let temperatura = document.querySelector(".temperatura")
    temperatura.textContent = Math.round(info["temp"]) + "%C"
    
    let sensTermica = document.querySelector(".sensacao")
    sensTermica.textContent = Math.round(info["sens_t"]) + "%C"

    let umidade = document.querySelector(".umidade")
    umidade.textContent = Math.round(info["umid"]) + "%"

    let probChuva = document.querySelector(".chuva")
    probChuva.textContent = Math.round(info["pp"]) + "%"
    let vento = document.querySelector(".vento")
    vento.textContent = Math.round(info["vento"]) + " km/h"

    let nascerSol = document.querySelector(".sun-nasc")
    nascerSol.textContent = info["nsol"]

    let porSol = document.querySelector(".sun-set")
    porSol.textContent = info["psol"]
    //await getLocationInfo()
    //let data = 
    //let name =  
};

// Função para pegar as informações de um lugar baseado na latitude e longitude
async function getLocationInfo(latitude, longitude){
    let promise = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,apparent_temperature,precipitation_probability`)
    let response = await promise.json()
    console.log(response)
    return {
        "temp": response["hourly"]["temperature_2m"][0],
        "temp_max": response["daily"]["temperature_2m_max"][0],
        "temp_min": response["daily"]["temperature_2m_min"][0],
        "umid": response["hourly"]["relative_humidity_2m"][0],
        "sens_t": response["hourly"]["apparent_temperature"][0],
        "vento": response["hourly"]["wind_speed_10m"][0],
        "nsol": response["daily"]["sunrise"][0].slice(-5),
        "psol": response["daily"]["sunset"][0].slice(-5),
        "pp": response["hourly"]["precipitation_probability"][0]
    }
};


// Função para pegar a lista de locais atualizada
async function getLocationsList(local){
    let {results} = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${local}&count=5&language=en&format=json`)).json()
    
    let newResultsHtml = ""
    let newResultsList = []
    
    results.forEach(element => {
        newResultsHtml += (`<p class="result-item"><span class="location-name">${element.name}</span> - ${getFlagEmoji(element.country_code)} <span class="hidden latitude">${element.latitude}</span><span class="hidden longitude">${element.longitude}</span></p>`)
        newResultsList.push(element)
        
    });

    if (searchInput.value){
        locationsList = newResultsList
        return newResultsHtml
    };

    return ""
}

// Função para adicionar a lista de locais
async function addSearchList(){
    
    results.classList.forEach((el)=>{
        if (el == "hidden") {
        results.classList.remove("hidden")
        }

    })
    
    let result = await getLocationsList(searchInput.value)
    updateList(result)
    

};

// Remover a lista de locais
function rmvSearchList(){
    resultText.textContent = ''
    results.classList.add("hidden")
};


// Função para atualizar a lista de locais
function updateList(result){
    // Atualiza o container
    resultText.innerHTML = `${result}`;
    let items = document.querySelectorAll(".result-item")
    items.forEach((el)=>{
        el.addEventListener("click",updateData)

    })
    
};

// Atualiza a lista de locais
async function updateLocationsList(event){
    event.preventDefault()
    input = event.target.value

    // Se não há nada escrito
    if (input == ""){

        // Remove a lista de resultados
        rmvSearchList();

    }
    // Se tiver algo escrito
    else {
        //  Adiciona a lista de resultados
        addSearchList();
        
        // Pega uma lista de locais baseados no input
        result = await getLocationsList(input);
        
        // Atualiza o resultado com os locais adquiridos
        updateList(result);
    }
    
};

// Função principal
function main(){

    // Quando alguém digita algo
    document.querySelector(".search-input").addEventListener("input",updateLocationsList)
    
    // Quando alguém foca no input
    document.querySelector(".search-container").addEventListener("focusin",addSearchList)
    // Quando alguém desfoca do input
    

    
};

main();