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
}

function getStandardDeviation(type, arrayOfData, sampleSize) {
  console.log(arrayOfData)
  if (type.value === 'Population') {
    console.log("Population Detected");
  } else {
    console.log("Sample Detected");
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

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}
