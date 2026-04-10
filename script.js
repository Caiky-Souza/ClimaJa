async function fetchGeoLocation(local){
    let {results} = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${local}&count=10&language=en&format=json`)).json()
    let new_results = []

    results.forEach(element => {
        if (new_results.length < 5){
            new_results.push(element.name)
        };
        
    });
    return new_results
}

async function typedInInput(result){
    let div = document.querySelector(".result-text"); 
    div.innerHTML = `${result}`


}

async function chgLetter(event){
    event.preventDefault()
    local = event.target.value
    
    if (local == ""){
        typedInInput("")
    }
    else {
        result = await fetchGeoLocation(local)
        typedInInput(result)
    }
    
};

function main(){
    document.querySelector(".search-input").addEventListener("input",chgLetter)


};

main();