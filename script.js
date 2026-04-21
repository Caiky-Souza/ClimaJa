import {getFlagEmoji, getLocationInfo} from "./utils.js"

let locationsList = [];
const results = document.querySelector(".results")
let searchInput = document.querySelector(".search-input")
let resultText = document.querySelector(".result-text");

// Função para transformar um Código de país em um Emoji
function updateWeek(maxArray, minArray, imgs){
    // Pega o container dos dias da semana
    let week = document.querySelector(".week-main").children
    
    // Cria um array iterável a partir do conteiner
    let weekArray = [...week]

    // Inicializa o dia de hoje e um array para guardar os nomes dos dias da semana
    let today = new Date()
    let daysList = [""]

    // Para cada dia da semana
    for (let i = 0; i < 7; i++){
        // Pega o próximo dia
        today.setDate(today.getDate() + 1)
        // Pega o nome desse dia da semana
        let localeString = today.toLocaleString("pt-BR", {weekday:"long"})
        
        // Adiciona no array de nomes
        daysList.push(localeString)
    };

    // Define um contador que inicia após o dia de hoje
    let i = 1

    // Para todos os dias da semana exceto hoje
    weekArray.forEach((el)=>{
        // Pega o elemento nome do dia da semana
        let dayName = el.querySelector(".day-name")
        let dayIcon = el.querySelector("img")
        // Pega o elemento descrição do dia da semana
        let dayDesc = el.querySelector(".day-desc")

        // Atualiza o elemento nome baseado na lista de dias
        dayName.textContent = daysList[i]
        dayIcon.src = imgs[i]
        // Atualiza o elemento descrição
        dayDesc.innerHTML = `<p>MAX ${Math.round(maxArray[i])}°C<br></p><p>MIN ${Math.round(minArray[i])}°C</p>` 
        
        // Aumenta para o próximo dia
        i++
    })
}

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
    let symbol = document.querySelector(".local-symbol")
    symbol.src = info["img"][0]

    let temperatura = document.querySelector(".temperatura")
    temperatura.textContent = Math.round(info["temp"]) + "°C"
    
    let sensTermica = document.querySelector(".sensacao")
    sensTermica.textContent = Math.round(info["sens_t"]) + "°C"

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
    updateWeek(info["temp_max"], info["temp_min"], info["img"])
    //await getLocationInfo()
    //let data = 
    //let name =  
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
    let input = event.target.value

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