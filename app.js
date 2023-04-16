const nn = ml5.neuralNetwork({task: 'regression', debug: true})
nn.load('./model/model.json')

//html button stuff
const result = document.getElementById("result")
const predictBtn = document.getElementById("predict")

predictBtn.addEventListener("click", () => makePrediction())

//prediction function
async function makePrediction() {
    let temperatureInput = document.getElementById('temperature').value;
    let luminosityInput = document.getElementById('luminosity').value;
    let radiusInput = document.getElementById('radius').value;

    const results = await nn.predict({
        temperature: parseInt(temperatureInput),
        luminosity: parseInt(luminosityInput),
        radius: parseInt(radiusInput)
    })

    let b = 0
    if(results[0].class <= 1) {
        b += 0
    } else if(results[0].class <= 2) {
        b += 1
    }  else if(results[0].class <= 3) {
        b += 2
    } else if(results[0].class <= 4) {
        b += 3
    } else if(results[0].class <= 5) {
        b += 4
    } else {
        b += 5
    }
    result.innerText = `predicted class: ${b}`
}