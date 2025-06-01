//-----MAIN FUNCTION------
function analyzeData() {
  const rawData = document.getElementById('rawData');
  const dataType = document.getElementById('dataType');
  const containsDataHeader = document.getElementById('containsDataHeader');
  const populationOrSample = document.getElementById('populationOrSample');
  const defectsSelected = document.getElementById('discreetSelection');
  const sampleSizeConstant = document.getElementById('sampleSizeConstantSelection');
  const dataTypeSelected = document.getElementById('dataType');
  const subGroupSelected = document.getElementById('sampleSubGroupSizeSelection');

  let arrayOfData = rawData.value.split("\n")
  
  cleanedData = cleanData(arrayOfData)

  //obtain sample size
  let sampleSize = getSampleOrPopulationSize(cleanedData);

  //Obtain subGroupSize
  //This is something i figured out while building this
  //Basically, the flow chart says N sample size. but in reality its the number of subgroups of data
  let subGroupSize = subGroupSelected.value;

  //get average of individuals dataset.
  let dataAverage = getDataAverage(cleanedData, sampleSize)

  //obtain standard deviation of data set
  let standardDeviation = getStandardDeviation(populationOrSample, cleanedData, sampleSize, dataAverage);

  //determine which test to use based on the users parameters.
  let testExecute = goToTest(subGroupSize, dataTypeSelected.value, defectsSelected.value, sampleSizeConstant.value, cleanedData);

  //Data Characteristics
  document.getElementById('dataTypeSelectedBehavior').innerHTML = "Data Type Selected: " + dataTypeSelected.value;
  document.getElementById('stdBehavior').innerHTML = "Standard Deviation of the " + populationOrSample.value + ": " + standardDeviation;
  document.getElementById('sampleSizeBehavior').innerHTML = "Sample Size for the " + populationOrSample.value + ": " + sampleSize;
  document.getElementById('averageBehavior').innerHTML = "Average for the " + populationOrSample.value + ": " + dataAverage;
  document.getElementById('subGroupSizeBehavior').innerHTML = "Sub Group Size: " + subGroupSize;
  document.getElementById('defectsForDiscreetBehavior').innerHTML = "Defect Type Selected: " + defectsSelected.value;
  document.getElementById('sampleSizeConstantBehavior').innerHTML = "Sample Size was selected as constant: " + sampleSizeConstant.value;
  document.getElementById('testSelectedBehavior').innerHTML = "Test Utilized: " + testExecute;

  //plot this dataset to a chart
  const chart = new Chart("controlChart", {
    type: "line",
    data: {
      labels: getIndexOfArray(cleanedData),
      datasets: [{
        label: "Your Data",
        pointRadius: 5,
        backgroundColor:"rgba(0,0,255,1)",
        borderColor:"rgb(0,0,255,1)",
        data: cleanedData,
        fill: false
      }, {
        label: "Average || Center Line",
        data: createStaticLines(dataAverage, sampleSize),
        pointRadius: 3,
        backgroundColor:"rgba(255, 255, 255, 20)",
        borderColor:"rgba(255, 255, 255, 20)",
        fill: false
      }]
    },
    options: {
      legend: {display: true},
      scales: {
        yAxes: [{ticks: {min: 0}}]
      }
    },
  });
}

//-----STATISTIC GATHERING------
//Gotta find a way to make this more dry, surely some kind of way to just subtract 1 if sample is selected...
function getStandardDeviation(type, arrayOfData, sampleSize, average) {
  let averageOfValues = 0;
  let sampleVSAverage = [];
  let sumOfAveragesSquared = 0;
  let divisionOfAverages = 0;
  let standardDeviation = 0;


  if (type.value === 'Population') {
    //calculate each samples value minus the average and square its value
    for (let i = 0; i < sampleSize; i++) {
      sampleVSAverage.push((arrayOfData[i] - average) ** 2 );
      sumOfAveragesSquared += sampleVSAverage[i];
    }
  
  //Divide the sum of the averages squared by the sample size
  divisionOfAverages = sumOfAveragesSquared / sampleSize

  //Undo the squared value with a square root to obtain the standard deviation
  standardDeviation = Math.sqrt(divisionOfAverages);
  return standardDeviation;
  } else {
    for (let i = 0; i < sampleSize; i++) {
      sampleVSAverage.push((arrayOfData[i] - average) ** 2 );
      sumOfAveragesSquared += sampleVSAverage[i];
    }
  
  //Divide the sum of the averages squared by the sample size minus 1
  divisionOfAverages = sumOfAveragesSquared / (sampleSize - 1)

  //Undo the squared value with a square root to obtain the standard deviation
  standardDeviation = Math.sqrt(divisionOfAverages);
  return standardDeviation;
  }
}

function getSampleOrPopulationSize(cleanedDataOnly) {
  let sampleSize = cleanedDataOnly.length;
  return sampleSize
}

function getDataAverage(data, sampleSize) {
  let sumOfValues = 0
  for (let i = 0; i < sampleSize; i++) {
    sumOfValues += data[i];
  } 
  averageOfValues = sumOfValues / sampleSize;
  return averageOfValues
}

//-----CLEAN DATA-----
function createStaticLines(data, sampleSize) {
  straightLine = [];
  for (let i = 0; i < sampleSize; i++) {
    straightLine.push(data)
  }
  return straightLine
}

function cleanData(data) {
  const cleanedDataArray = [];

  data.forEach(function (item, index) {
    if (isNumeric(item)) {
      cleanedDataArray.push(item)
    } else {
      console.log("Expunged Data because it was dirty... : " + item)
    }
  })
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


//-----WEBPAGE SHENANIGINS-----
//This function hides and unhides the options for discreet data
function showOptionsOnDiscreetSelection(discreetSelected) {
  if (discreetSelected.value === "Discreet") {
    document.getElementById("discreetSelection").style.display = "block";
    document.getElementById("discreetSelectionID").style.display = "block";
    document.getElementById("sampleSizeConstantID").style.display = "block";
    document.getElementById("sampleSizeConstantSelection").style.display = "block";
    document.getElementById("defectsForDiscreetBehavior").style.display = "block";
    document.getElementById("sampleSizeConstantBehavior").style.display = "block";
    
    //if discreet is selected we need to hide the subgroup menu
    document.getElementById("subGroup").style.display = "none";
    document.getElementById("subGroupSizeBehavior").style.display = "none";
  } else {
    document.getElementById("discreetSelection").style.display = "none";
    document.getElementById("discreetSelectionID").style.display = "none";
    document.getElementById("sampleSizeConstantID").style.display = "none";
    document.getElementById("sampleSizeConstantSelection").style.display = "none";
    document.getElementById("defectsForDiscreetBehavior").style.display = "none";
    document.getElementById("sampleSizeConstantBehavior").style.display = "none";

    //If discreet handle
    document.getElementById("subGroup").style.display = "block";
    document.getElementById("subGroupSizeBehavior").style.display = "block";
  }
}

//-----Determine Which Test To Use (god damn this looks like shit)-----
function goToTest(subGroupSize, dataType, defectType, constantSampleType, cleanedData) {
let testType = ""
  if(dataType === "Continuous") {
    if (subGroupSize === "1") {
      testType = "X-MR/I-MR Chart";
      xmr_imr_plot(cleanedData)
        //X-MR/I-MR Test
    } else if (subGroupSize === "2 to 9") {
        testType = "Xbar-R Chart";
        return testType
        //Xbar-R Test
    } else if (subGroupSize === "10 or More") {
        testType = "Xbar-S Chart";
        return testType
        //Xbar-S Test
    }
  } else if (dataType === "Discreet") {
      if (defectType === "Multiple Defects Per Unit") {
        if (constantSampleType === "Yes") {
          testType = "C-Chart";
          return testType
        } else if (constantSampleType === "No") {
          testType = "U-Chart";
          return testType
        }
      } else if (defectType === "One Defect Per Unit") {
          if (constantSampleType === "Yes") {
            testType = "NP-Chart";
            return testType 
          } else if (constantSampleType === "No") {
              testType = "P-Chart";
              return testType
          }
      }
  }
}

//-----Plotting Graphs and Stats-----
function xmr_imr_plot(data) {
  //XMR Chart
  let xMRiMRChartData = {
    indexForChart: getIndexOfArray(data),
    dataForChart: data,
    iBar: createStaticLines(getDataAverage(data, data.length), data.length),
    mR: [],
    mRBar: [],
    mRUCL: [],
    iSigma: [],
    iBarPos1Sigma: [],
    iBarPos2Sigma: [],
    iBarPos3Sigma: [],
    iBarNeg1Sigma: [],
    iBarNeg2Sigma: [],
    iBarNeg3Sigma: [],
  }
  console.log(xMRChartData)
}
