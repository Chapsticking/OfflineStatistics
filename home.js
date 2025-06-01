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
  const exportSelected = document.getElementById('exportData')

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
  let testResults = goToTest(subGroupSize, dataTypeSelected.value, defectsSelected.value, sampleSizeConstant.value, cleanedData);

  //Export results to CSV if user specified.
  if (exportSelected.value === "Yes") {
    const csv = convertChartDataToCSV(testResults);
    downloadCSV(csv, testResults.currentTest + ".csv");
}

  //Data Characteristics
  document.getElementById('dataTypeSelectedBehavior').innerHTML = "Data Type Selected: " + dataTypeSelected.value;
  document.getElementById('stdBehavior').innerHTML = "Standard Deviation of the " + populationOrSample.value + ": " + standardDeviation;
  document.getElementById('sampleSizeBehavior').innerHTML = "Sample Size for the " + populationOrSample.value + ": " + sampleSize;
  document.getElementById('averageBehavior').innerHTML = "Average for the " + populationOrSample.value + ": " + dataAverage;
  document.getElementById('subGroupSizeBehavior').innerHTML = "Sub Group Size: " + subGroupSize;
  document.getElementById('defectsForDiscreetBehavior').innerHTML = "Defect Type Selected: " + defectsSelected.value;
  document.getElementById('sampleSizeConstantBehavior').innerHTML = "Sample Size was selected as constant: " + sampleSizeConstant.value;
  document.getElementById('testSelectedBehavior').innerHTML = "Test Utilized: " + testResults.currentTest;

  //plot this dataset to a chart
  const chart = new Chart("controlChart", {
    type: "line",
    data: {
      labels: testResults.results.indexForChart,
      datasets: [{
        label: "Data",
        pointRadius: 5,
        backgroundColor:"rgba(0,0,255,1)",
        borderColor:"rgb(0,0,255,1)",
        data: testResults.results.dataForChart,
        fill: false
      }, {
        label: "iBar",
        data: testResults.results.iBar,
        pointRadius: 1,
        borderColor:"rgba(255, 255, 255, 1)",
        borderDash: [15],
        fill: false
      }, {
        label: "1st + Sigma",
        data: testResults.results.iBarPos1Sigma,
        pointRadius: 1,
        borderColor:"rgba(217,210,213,.5)",
        borderDash: [10],
        fill: false,
      }, {
        label: "2nd + Sigma",
        data: testResults.results.iBarPos2Sigma,
        pointRadius: 1,
        borderColor: "rgba(217,210,213,.8)",
        borderDash: [10],
      }, {
        label: "3rd + Sigma",
        data: testResults.results.iBarPos3Sigma,
        pointRadius: 1,
        borderColor: "rgba(255,0,0,1)",
      },{
        label: "1st - Sigma",
        data: testResults.results.iBarNeg1Sigma,
        pointRadius: 1,
        borderColor: "rgba(217,210,213,.5)",
        borderDash: [10],
      },{
        label: "2nd - Sigma",
        data: testResults.results.iBarNeg2Sigma,
        pointRadius: 1,
        borderColor: "rgba(217,210,213,.8)",
        borderDash: [10],
      },{
        label: "3rd - Sigma",
        data: testResults.results.iBarNeg3Sigma,
        pointRadius: 1,
        borderColor: "rgba(255,0,0,1)",
      }]
    },
    options: {
      legend: {display: true},
    },
  });

  //plot this dataset to a chart
  const newchart = new Chart("IMRChart", {
    type: "line",
    data: {
      labels: testResults.results.indexForChart,
      datasets: [{
        label: "Moving Range",
        pointRadius: 5,
        backgroundColor:"rgba(0,0,255,1)",
        borderColor:"rgb(0,0,255,1)",
        data: testResults.results.movingRange,
        fill: false,
      }, {
        label: "Moving Range Bar",
        data: testResults.results.movingRangeBar,
        pointRadius: 1,
        borderColor:"rgba(255, 255, 255, 1)",
        borderDash: [15],
        fill: false,
      }, {
        label: "Moving Range UCL",
        data: testResults.results.movingRangeUCL,
        pointRadius: 1,
        borderColor:"rgba(255,0,0,1)",
        fill: false,
      }],
    },
    options: {
      legend: {display: true},
    }
  });

return testResults

} //END FUNCTION


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
      return xmr_imr_plot(cleanedData)
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
//XMR and IMR Chart Data
function xmr_imr_plot(data) {

  let iBarData = createStaticLines(getDataAverage(data, data.length), data.length)
  let movingRange = movingRangeConsolidation(data);
  let movingRangeBar = movingRangeBarConsolidation(movingRange);
  let iSigma = iSigmaConsolidation(movingRangeBar);
  let movingRangeUCL = movingRangeUCLConsolidation(movingRangeBar);

  let xMRiMRChartData = {
    currentTest: "XMR / IMR Chart Data",
      results: {
        indexForChart: getIndexOfArray(data),
        dataForChart: data,
        iBar: iBarData,
        movingRange: movingRange, 
        movingRangeBar: movingRangeBar,
        movingRangeUCL: movingRangeUCL, 
        iSigma: iSigma,
        iBarPos1Sigma: iBarSigmas("Add", 1, iBarData, iSigma),
        iBarPos2Sigma: iBarSigmas("Add", 2, iBarData, iSigma),
        iBarPos3Sigma: iBarSigmas("Add", 3, iBarData, iSigma),
        iBarNeg1Sigma: iBarSigmas("Subtract", 1, iBarData, iSigma),
        iBarNeg2Sigma: iBarSigmas("Subtract", 2, iBarData, iSigma),
        iBarNeg3Sigma: iBarSigmas("Subtract", 3, iBarData, iSigma),
      }
  }

  function movingRangeConsolidation(data) {
  let mR = [];
  let min = 0;
  let max = 0;
  let delta = 0;

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      mR.push(0)
    } else {
    min = Math.min(data[i], data[i - 1])
    max = Math.max(data[i], data[i - 1])
    delta = max - min
    mR.push(delta)
    }
  }; return mR 
  };
  
  function movingRangeBarConsolidation(movingRangeData) {
    let mRB = createStaticLines(getDataAverage(movingRangeData, movingRangeData.length), movingRangeData.length);
    return mRB
  };

  //Approximated Standard deviation using 1.128
  function iSigmaConsolidation(movingRangeBarData) {
    let iSigma = [];
    for (let i = 0; i < movingRangeBarData.length; i++) {
      iSigma.push(movingRangeBarData[i] / 1.128)
    }; return iSigma
  };

  function iBarSigmas(addOrSubtract, multipliedSigma, movingRangeBar, iSigma) {
    iBarSigma = []
    if (addOrSubtract === "Add") {
      for (i = 0; i < movingRangeBar.length; i++) {
        iBarSigma.push(movingRangeBar[i] + (multipliedSigma * iSigma[i]))
      }
    } else {
      for (i = 0; i < movingRangeBar.length; i++) {
        let negSigmaValue = movingRangeBar[i] - (multipliedSigma * iSigma[i])
        if (negSigmaValue < 0) {
          iBarSigma.push(0)
        } else {
          iBarSigma.push(negSigmaValue);
        }
      }
    }; return iBarSigma
  }

  function movingRangeUCLConsolidation(movingRangeBar) {
    let uCL = []
    for (i = 0; i < movingRangeBar.length; i++) {
      uCL.push(movingRangeBar[i] * 3.267);
    }; return uCL
  }

return xMRiMRChartData
};

//-----Convert Object to CSV-----
function convertChartDataToCSV(dataObj) {
  const results = dataObj.results;

  // Get all keys to form CSV headers
  const headers = Object.keys(results);

  // Find the length of any one array (they should all be the same)
  const length = results[headers[0]].length;

  // Start with the header row
  let csv = headers.join(",") + "\n";

  // Construct each data row
  for (let i = 0; i < length; i++) {
    const row = headers.map(key => results[key][i]);
    csv += row.join(",") + "\n";
  }

  return csv;
}


function downloadCSV(csvString, filename = "chart_data.csv") {
  const blob = new Blob([csvString], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  
  URL.revokeObjectURL(url);
}

