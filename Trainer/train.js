import {createChart} from "./scatterplot.js"

const nn = ml5.neuralNetwork({task: 'regression', debug: true})
const fmt = new Intl.NumberFormat('nl-NL', {style: 'currency', currency: 'EUR'})

let trainData;
let testData;

const result = document.getElementById("result")
const predictBtn = document.getElementById("predict")
const saveBtn = document.getElementById("save")

predictBtn.addEventListener("click", () => makePrediction())
saveBtn.addEventListener("click", () => save())

function loadData() {
    Papa.parse("./data/star.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: results => checkData(results.data)
    })
}

loadData()

function checkData(data) {
    console.table(data)

    const cleanData = data.map(star => ({
        Temperature: star.Temperature,
        Luminosity: star.Luminosity,
        Radius: star.Radius,
        Magnitude: star.Magnitude,

    })).filter(star =>
        typeof star.Temperature === "number" &&
        typeof star.Luminosity === "number" &&
        typeof star.Radius === "number" &&
        typeof star.Magnitude === "number"
    )

    // data voorbereiden
    data.sort(() => (Math.random() - 0.5))
    let trainData = data.slice(0, Math.floor(data.length * 0.8))
    let testData = data.slice(Math.floor(data.length * 0.8) + 1)


    // data toevoegen aan neural network
    for (let star of trainData) {
        nn.addData({
            temperature: star.temperature,
            luminosity: star.luminosity,
            radius: star.radius
        }, {class: star.class})
    }

    nn.normalizeData()

    const chartdata = data.map(star => ({
        x: star.temperature,
        y: star.class,
    }))

    createChart(chartdata, "Temperature", "Class")

    nn.train({epochs: 10}, () => finishedTraining())
}

async function finishedTraining() {
    console.log("klaar")
}

async function makePrediction() {
    let temperatureInput = document.getElementById('temperature').value;
    let luminosityInput = document.getElementById('luminosity').value;
    let radiusInput = document.getElementById('radius').value;

    const results = await nn.predict({
        temperature: parseInt(temperatureInput),
        luminosity: parseInt(luminosityInput),
        radius: parseInt(radiusInput)
    })
    result.innerText = `geschatte prijs: ${results[0].class}`
}

function save() {
    nn.save()
}