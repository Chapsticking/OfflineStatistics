function analyzeData() {
  const rawData = document.getElementById('rawData');
  const dataType = document.getElementById('dataType')
  const containsDataHeader = document.getElementById('containsDataHeader')
  const populationOrSample = document.getElementById('populationOrSample')

  let arrayOfData = rawData.value.split("\n")

  if (containsDataHeader.value === 'Auto-Detect') {
    cleanedData = cleanData(arrayOfData)
  }else {
    //lol still gunna clean that data mr silly pants probably gunna remove that function...
    cleanedData = cleanData(arrayOfData)
  }
  
  //obtain sample size
  let sampleSize = getSampleOrPopulationSize(cleanedData);

  //obtain standard deviation of data set
  let standardDeviation = getStandardDeviation(populationOrSample, cleanedData, sampleSize);

  //let user know what the data says...
  document.getElementById('stdBehavior').innerHTML = "Standard Deviation for the " + populationOrSample.value + " " + standardDeviation;
  document.getElementById('sampleSizeBehavior').innerHTML = "Sample Size for the " + populationOrSample.value + " " + sampleSize;
  
  //plot this dataset to a chart
  const chart = new Chart("controlChart", {
    type: "line",
    data: {
      labels: getIndexOfArray(cleanedData),
      datasets: [{
        pointRadius: 5,
        backgroundColor:"rgba(0,0,255,1)",
        borderColor:"rgb(0,0,255,1)",
        data: cleanedData,
        fill: false
      }]
    },
    options: {
      legend: {display: false},
      scales: {
        yAxes: [{ticks: {min: 0}}]
      }
    },
  });
}

//Gotta find a way to make this more dry, surely some kind of way to just subtract 1 if sample is selected...
function getStandardDeviation(type, arrayOfData, sampleSize) {
  let sumOfValues = 0;
  let averageOfValues = 0;
  let sampleVSAverage = [];
  let sumOfAveragesSquared = 0;
  let divisionOfAverages = 0;
  let standardDeviation = 0;

  for (let i = 0; i < sampleSize; i++) {
    sumOfValues += arrayOfData[i];
  }
  
  averageOfValues = sumOfValues / sampleSize

  if (type.value === 'Population') {
    //calculate each samples value minus the average and square its value
    for (let i = 0; i < sampleSize; i++) {
      sampleVSAverage.push((arrayOfData[i] - averageOfValues) ** 2 );
      sumOfAveragesSquared += sampleVSAverage[i];
    }
  
  //Divide the sum of the averages squared by the sample size
  divisionOfAverages = sumOfAveragesSquared / sampleSize

  //Undo the squared value with a square root to obtain the standard deviation
  standardDeviation = Math.sqrt(divisionOfAverages);
  console.log("Standard Deviation of Population: " + standardDeviation)
  return standardDeviation;
  } else {
    console.log("Sample Detected");    //calculate each samples value minus the average and square its value
    for (let i = 0; i < sampleSize; i++) {
      sampleVSAverage.push((arrayOfData[i] - averageOfValues) ** 2 );
      sumOfAveragesSquared += sampleVSAverage[i];
    }
  
  //Divide the sum of the averages squared by the sample size
  divisionOfAverages = sumOfAveragesSquared / (sampleSize - 1)

  //Undo the squared value with a square root to obtain the standard deviation
  standardDeviation = Math.sqrt(divisionOfAverages);
  console.log("Standard Deviation of Sample: " + standardDeviation)
  return standardDeviation;
  }
}

function getSampleOrPopulationSize(cleanedDataOnly) {
  let sampleSize = cleanedDataOnly.length;
  return sampleSize
}

function cleanData(data) {
  const cleanedDataArray = [];

  data.forEach(function (item, index) {
    if (isNumeric(item)) {
      cleanedDataArray.push(item)
    } else {
      console.log("found strange item and excluding: " + item)
    }
  })
  console.log("Converting Strings to Numbers")
  let cleanedDataArrayV2 = cleanedDataArray.map(i=>Number(i))
  return cleanedDataArrayV2
}

function getIndexOfArray(cleanedData) {
  indexOfDataSet = []; 
  cleanedData.forEach(function (item, index) {
    indexOfDataSet.push(index + 1)
  }); return indexOfDataSet
}

//Yoinked this from stack overflow
function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

