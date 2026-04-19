let locationsList = [];
const results = document.querySelector(".results")
let searchInput = document.querySelector(".search-input")
let resultText = document.querySelector(".result-text");

function getFlagEmoji(countryCode) {
const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
return String.fromCodePoint(...codePoints);
};

function updateData(button){
    let locName = document.querySelector(".local-name")
    
    locName.innerHTML = button.target.outerText

    let latitude = button.srcElement.childNodes["2"].innerHTML
    let longitude = button.srcElement.childNodes["3"].innerHTML

    let info = getLocationInfo(latitude,longitude)
    //await getLocationInfo()
    //let data = 
    //let name =  
};
async function getLocationInfo(latitude, longitude){
    let promise = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=True&minutely_15=temperature_2m`)
    let response = await promise.json()
    console.log(response)
  
};



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