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
  const exportSelected = document.getElementById('exportData');

  let arrayOfData = rawData.value.split('\n');

  cleanedData = cleanData(arrayOfData);

  //obtain sample size
  let sampleSize = getSampleOrPopulationSize(cleanedData);

  //Obtain subGroupSize
  //This is something i figured out while building this
  //Basically, the flow chart says N sample size. but in reality its the number of subgroups of data
  let subGroupSize = subGroupSelected.value;

  //get average of individuals dataset.
  let dataAverage = getDataAverage(cleanedData, sampleSize);

  //obtain standard deviation of data set
  let standardDeviation = getStandardDeviation(populationOrSample, cleanedData, sampleSize, dataAverage);

  //determine which test to use based on the users parameters.
  let testResults = goToTest(subGroupSize, dataTypeSelected.value, defectsSelected.value, sampleSizeConstant.value, cleanedData);

  //Export results to CSV if user specified.
  if (exportSelected.value === 'Yes') {
    const csv = convertChartDataToCSV(testResults);
    downloadCSV(csv, testResults.currentTest + '.csv');
  }

  //Data Characteristics
  document.getElementById('dataTypeSelectedBehavior').innerHTML = 'Data Type Selected: ' + dataTypeSelected.value;
  document.getElementById('stdBehavior').innerHTML = 'Standard Deviation of the ' + populationOrSample.value + ': ' + standardDeviation;
  document.getElementById('sampleSizeBehavior').innerHTML = 'Sample Size for the ' + populationOrSample.value + ': ' + sampleSize;
  document.getElementById('averageBehavior').innerHTML = 'Average for the ' + populationOrSample.value + ': ' + dataAverage;
  document.getElementById('subGroupSizeBehavior').innerHTML = 'Sub Group Size: ' + subGroupSize;
  document.getElementById('defectsForDiscreetBehavior').innerHTML = 'Defect Type Selected: ' + defectsSelected.value;
  document.getElementById('sampleSizeConstantBehavior').innerHTML = 'Sample Size was selected as constant: ' + sampleSizeConstant.value;
  document.getElementById('testSelectedBehavior').innerHTML = 'Test Utilized: ' + testResults.currentTest;

  return testResults;
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
      sampleVSAverage.push((arrayOfData[i] - average) ** 2);
      sumOfAveragesSquared += sampleVSAverage[i];
    }

    //Divide the sum of the averages squared by the sample size
    divisionOfAverages = sumOfAveragesSquared / sampleSize;

    //Undo the squared value with a square root to obtain the standard deviation
    standardDeviation = Math.sqrt(divisionOfAverages);
    return standardDeviation;
  } else {
    for (let i = 0; i < sampleSize; i++) {
      sampleVSAverage.push((arrayOfData[i] - average) ** 2);
      sumOfAveragesSquared += sampleVSAverage[i];
    }

    //Divide the sum of the averages squared by the sample size minus 1
    divisionOfAverages = sumOfAveragesSquared / (sampleSize - 1);

    //Undo the squared value with a square root to obtain the standard deviation
    standardDeviation = Math.sqrt(divisionOfAverages);
    return standardDeviation;
  }
}

function getSampleOrPopulationSize(cleanedDataOnly) {
  let sampleSize = cleanedDataOnly.length;
  return sampleSize;
}

function getDataAverage(data, sampleSize) {
  let sumOfValues = 0;
  for (let i = 0; i < sampleSize; i++) {
    sumOfValues += data[i];
  }
  averageOfValues = sumOfValues / sampleSize;
  return averageOfValues;
}

//-----CLEAN DATA-----
function createStaticLines(data, sampleSize) {
  straightLine = [];
  for (let i = 0; i < sampleSize; i++) {
    straightLine.push(data);
  }
  return straightLine;
}

function cleanData(data) {
  const cleanedDataArray = [];

  data.forEach(function (item, index) {
    if (isNumeric(item)) {
      cleanedDataArray.push(item);
    } else {
      console.log('Expunged Data because it was dirty... : ' + item);
    }
  });
  let cleanedDataArrayV2 = cleanedDataArray.map((i) => Number(i));
  return cleanedDataArrayV2;
}

function getIndexOfArray(cleanedData) {
  indexOfDataSet = [];
  cleanedData.forEach(function (item, index) {
    indexOfDataSet.push(index + 1);
  });
  return indexOfDataSet;
}

//Yoinked this from stack overflow
function isNumeric(str) {
  if (typeof str != 'string') return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

//-----WEBPAGE SHENANIGINS-----
//This function hides and unhides the options for discreet data
function showOptionsOnDiscreetSelection(discreetSelected) {
  if (discreetSelected.value === 'Discreet') {
    document.getElementById('discreetSelection').style.display = 'block';
    document.getElementById('discreetSelectionID').style.display = 'block';
    document.getElementById('sampleSizeConstantID').style.display = 'block';
    document.getElementById('sampleSizeConstantSelection').style.display = 'block';
    document.getElementById('defectsForDiscreetBehavior').style.display = 'block';
    document.getElementById('sampleSizeConstantBehavior').style.display = 'block';

    //if discreet is selected we need to hide the subgroup menu
    document.getElementById('subGroup').style.display = 'none';
    document.getElementById('subGroupSizeBehavior').style.display = 'none';
  } else {
    document.getElementById('discreetSelection').style.display = 'none';
    document.getElementById('discreetSelectionID').style.display = 'none';
    document.getElementById('sampleSizeConstantID').style.display = 'none';
    document.getElementById('sampleSizeConstantSelection').style.display = 'none';
    document.getElementById('defectsForDiscreetBehavior').style.display = 'none';
    document.getElementById('sampleSizeConstantBehavior').style.display = 'none';

    //If discreet handle
    document.getElementById('subGroup').style.display = 'block';
    document.getElementById('subGroupSizeBehavior').style.display = 'block';
  }
}

//-----Determine Which Test To Use (god damn this looks like shit)-----
function goToTest(subGroupSize, dataType, defectType, constantSampleType, cleanedData) {
  let overallDataCharacteristics = {
    index: [],
    centerLine: [],
    sigmaOnePos: [],
    sigmaTwoPos: [],
    sigmaThreePos: [],
    sigmaOneNeg: [],
    sigmaTwoNeg: [],
    sigmaThreeNeg: [],
  };

  let testType = '';
  if (dataType === 'Continuous') {
    if (subGroupSize === '1') {
      testType = 'X-MR/I-MR Chart';
      return xmr_imr_plot(cleanedData);
      //X-MR/I-MR Test
    } else if (subGroupSize === '2 to 9') {
      testType = 'Xbar-R Chart';
      return testType;
      //Xbar-R Test
    } else if (subGroupSize === '10 or More') {
      testType = 'Xbar-S Chart';
      return testType;
      //Xbar-S Test
    }
  } else if (dataType === 'Discreet') {
    if (defectType === 'Multiple Defects Per Unit') {
      if (constantSampleType === 'Yes') {
        testType = 'C-Chart';
        return testType;
      } else if (constantSampleType === 'No') {
        testType = 'U-Chart';
        return testType;
      }
    } else if (defectType === 'One Defect Per Unit') {
      if (constantSampleType === 'Yes') {
        testType = 'NP-Chart';
        return testType;
      } else if (constantSampleType === 'No') {
        testType = 'P-Chart';
        return testType;
      }
    }
  }
}

//-----Plotting Graphs and Stats-----
//XMR and IMR Chart Data
function xmr_imr_plot(data) {
  let iBarData = createStaticLines(getDataAverage(data, data.length), data.length);
  let movingRange = movingRangeConsolidation(data);
  let movingRangeBar = movingRangeBarConsolidation(movingRange);
  let iSigma = iSigmaConsolidation(movingRangeBar);
  let movingRangeUCL = movingRangeUCLConsolidation(movingRangeBar);

  let xMRiMRChartData = {
    currentTest: 'XMR / IMR Chart Data',
    results: {
      indexForChart: getIndexOfArray(data),
      dataForChart: data,
      iBar: iBarData,
      movingRange: movingRange,
      movingRangeBar: movingRangeBar,
      movingRangeUCL: movingRangeUCL,
      iSigma: iSigma,
      iBarPos1Sigma: iBarSigmas('Add', 1, iBarData, iSigma),
      iBarPos2Sigma: iBarSigmas('Add', 2, iBarData, iSigma),
      iBarPos3Sigma: iBarSigmas('Add', 3, iBarData, iSigma),
      iBarNeg1Sigma: iBarSigmas('Subtract', 1, iBarData, iSigma),
      iBarNeg2Sigma: iBarSigmas('Subtract', 2, iBarData, iSigma),
      iBarNeg3Sigma: iBarSigmas('Subtract', 3, iBarData, iSigma),
    },
  };

  function movingRangeConsolidation(data) {
    let mR = [];
    let min = 0;
    let max = 0;
    let delta = 0;

    for (let i = 0; i < data.length; i++) {
      if (i === 0) {
        mR.push(0);
      } else {
        min = Math.min(data[i], data[i - 1]);
        max = Math.max(data[i], data[i - 1]);
        delta = max - min;
        mR.push(delta);
      }
    }
    return mR;
  }

  function movingRangeBarConsolidation(movingRangeData) {
    let mRB = createStaticLines(getDataAverage(movingRangeData, movingRangeData.length), movingRangeData.length);
    return mRB;
  }

  //Approximated Standard deviation using 1.128
  function iSigmaConsolidation(movingRangeBarData) {
    let iSigma = [];
    for (let i = 0; i < movingRangeBarData.length; i++) {
      iSigma.push(movingRangeBarData[i] / 1.128);
    }
    return iSigma;
  }

  function iBarSigmas(addOrSubtract, multipliedSigma, movingRangeBar, iSigma) {
    iBarSigma = [];
    if (addOrSubtract === 'Add') {
      for (i = 0; i < movingRangeBar.length; i++) {
        iBarSigma.push(movingRangeBar[i] + multipliedSigma * iSigma[i]);
      }
    } else {
      for (i = 0; i < movingRangeBar.length; i++) {
        let negSigmaValue = movingRangeBar[i] - multipliedSigma * iSigma[i];
        if (negSigmaValue < 0) {
          iBarSigma.push(0);
        } else {
          iBarSigma.push(negSigmaValue);
        }
      }
    }
    return iBarSigma;
  }

  function movingRangeUCLConsolidation(movingRangeBar) {
    let uCL = [];
    for (i = 0; i < movingRangeBar.length; i++) {
      uCL.push(movingRangeBar[i] * 3.267);
    }
    return uCL;
  }

  let rulesBroken = checkHowChartBehaves(xMRiMRChartData);
  console.log('Rules Broken: ' + rulesBroken);

  //plot this dataset to a chart
  const xMRChart = new Chart('controlChart', {
    type: 'line',
    data: {
      labels: xMRiMRChartData.results.indexForChart,
      datasets: [
        {
          label: 'Data',
          pointRadius: 5,
          backgroundColor: 'rgba(0,0,255,1)',
          borderColor: 'rgb(0,0,255,1)',
          data: xMRiMRChartData.results.dataForChart,
          fill: false,
        },
        {
          label: 'iBar',
          data: xMRiMRChartData.results.iBar,
          pointRadius: 0,
          borderColor: 'rgba(255, 255, 255, 1)',
          borderDash: [15],
          fill: false,
        },
        {
          label: '1st + Sigma',
          data: xMRiMRChartData.results.iBarPos1Sigma,
          pointRadius: 0,
          borderColor: 'rgba(217,210,213,.5)',
          borderDash: [10],
          fill: false,
        },
        {
          label: '2nd + Sigma',
          data: xMRiMRChartData.results.iBarPos2Sigma,
          pointRadius: 0,
          borderColor: 'rgba(217,210,213,.8)',
          borderDash: [10],
          fill: false,
        },
        {
          label: '3rd + Sigma',
          data: xMRiMRChartData.results.iBarPos3Sigma,
          pointRadius: 0,
          borderColor: 'rgba(255,0,0,1)',
          fill: false,
        },
        {
          label: '1st - Sigma',
          data: xMRiMRChartData.results.iBarNeg1Sigma,
          pointRadius: 0,
          borderColor: 'rgba(217,210,213,.5)',
          borderDash: [10],
          fill: false,
        },
        {
          label: '2nd - Sigma',
          data: xMRiMRChartData.results.iBarNeg2Sigma,
          pointRadius: 0,
          borderColor: 'rgba(217,210,213,.8)',
          borderDash: [10],
          fill: false,
        },
        {
          label: '3rd - Sigma',
          data: xMRiMRChartData.results.iBarNeg3Sigma,
          pointRadius: 0,
          borderColor: 'rgba(255,0,0,1)',
          fill: false,
        },
        {
          label: 'Rule 1 – One point beyond the 3 σ control limit',
          data: rulesBroken.rules.ruleOne.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(255,0,0,1)',
          fill: false,
        },
        {
          label: 'Rule 2 - Eight or more points on one side of the centerline without crossing.',
          data: rulesBroken.rules.ruleTwo.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(255, 255, 102, 1)',
          fill: false,
        },
        {
          label: 'Rule 3 - Four out of five points in zone B or beyond',
          data: rulesBroken.rules.ruleThree.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(255, 153, 153,1)',
          fill: false,
        },
        {
          label: 'Rule 4 - Six points or more in a row steadily increasing or decreasing',
          data: rulesBroken.rules.ruleFour.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(0, 255, 100,1)',
          fill: false,
        },
        {
          label: 'Rule 5 – Two out of three points in zone A',
          data: rulesBroken.rules.ruleFive.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(0, 0, 100,1)',
          fill: false,
        },
        {
          label: 'Rule 6 – 14 points in a row alternating up and down',
          data: rulesBroken.rules.ruleSix.valueOfBreak,
          pointRadius: 10,
          backgroundColor: 'rgba(0, 0, 100,1)',
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'X-MR Chart' },
    },
  });

  //plot this dataset to a chart
  const iMRChart = new Chart('IMRChart', {
    type: 'line',
    data: {
      labels: xMRiMRChartData.results.indexForChart,
      datasets: [
        {
          label: 'Moving Range',
          pointRadius: 5,
          backgroundColor: 'rgba(0,0,255,1)',
          borderColor: 'rgb(0,0,255,1)',
          data: xMRiMRChartData.results.movingRange,
          fill: false,
        },
        {
          label: 'Moving Range Bar',
          data: xMRiMRChartData.results.movingRangeBar,
          pointRadius: 0,
          borderColor: 'rgba(255, 255, 255, 1)',
          borderDash: [15],
          fill: false,
        },
        {
          label: 'Moving Range UCL',
          data: xMRiMRChartData.results.movingRangeUCL,
          pointRadius: 0,
          borderColor: 'rgba(255,0,0,1)',
          fill: false,
        },
      ],
    },
    options: {
      legend: { display: true, position: 'bottom' },
      title: { display: true, text: 'I-MR Chart' },
    },
  });

  console.log(checkHowChartBehaves(xMRiMRChartData));

  return xMRiMRChartData;
}

//-----Process Checking-----
function checkHowChartBehaves(chartedData) {
  let data = chartedData.results;

  //main trend identification object
  let trendIdentificationBank = {
    rules: {
      ruleOne: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleTwo: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleThree: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleFour: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleFive: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleSix: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
      ruleSeven: {
        ruleBroken: [],
        isBroken: [],
        indexOfRuleBreak: [],
        valueOfBreak: [],
      },
    },
  };
  //First Rule Check (Rule 1 – One point beyond the 3 σ control limit)
  for (i = 0; i < data.dataForChart.length; i++) {
    if (data.dataForChart[i] > data.iBarPos3Sigma[i] || data.dataForChart[i] < data.iBarNeg3Sigma[i]) {
      trendIdentificationBank.rules.ruleOne.ruleBroken.push('Rule 1 Broken - One point beyond the 3 σ control limit');
      trendIdentificationBank.rules.ruleOne.isBroken.push(1);
      trendIdentificationBank.rules.ruleOne.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleOne.valueOfBreak.push(data.dataForChart[i]);
    } else {
      trendIdentificationBank.rules.ruleOne.ruleBroken.push('Rule 1 Pass');
      trendIdentificationBank.rules.ruleOne.isBroken.push(null);
      trendIdentificationBank.rules.ruleOne.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleOne.valueOfBreak.push(data.dataForChart[null]);
    }
  }

  //Second Rule – Eight or more points on one side of the centerline without crossing
  //Need to find a way to highlight all datapoints that exceeded the 8, not sure how to approach this yet...
  //For now, its just gunna highlight the first point of data that 8+ will exceed.
  //If someone else in the 2R community could take a stab at this that would be sick. (So far I've spent 2 hours and I'm getting annoyed lol)
  for (let i = 0; i < data.dataForChart.length; i++) {
    let rangeOfEightValues = data.dataForChart.slice(i, i + 8);
    let rangeOverTheCenterLine = rangeOfEightValues.every((el) => el > data.iBar[i]);
    let rangeUnderTheCenterLine = rangeOfEightValues.every((el) => el < data.iBar[i]);
    if (rangeOverTheCenterLine && rangeOfEightValues.length === 8) {
      trendIdentificationBank.rules.ruleTwo.ruleBroken.push('Rule 2 Broken - Eight or more points above the centerline without crossing');
      trendIdentificationBank.rules.ruleTwo.isBroken.push(1);
      trendIdentificationBank.rules.ruleTwo.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleTwo.valueOfBreak.push(data.dataForChart[i]);
    } else if (rangeUnderTheCenterLine && rangeOfEightValues.length === 8) {
      trendIdentificationBank.rules.ruleTwo.ruleBroken.push('Rule 2 Broken - Eight or more points below the centerline without crossing');
      trendIdentificationBank.rules.ruleTwo.isBroken.push(1);
      trendIdentificationBank.rules.ruleTwo.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleTwo.valueOfBreak.push(data.dataForChart[i]);
    } else {
      trendIdentificationBank.rules.ruleTwo.ruleBroken.push('Rule 2 Pass');
      trendIdentificationBank.rules.ruleTwo.isBroken.push(null);
      trendIdentificationBank.rules.ruleTwo.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleTwo.valueOfBreak.push(null);
    }
  }

  //Third Rule - Four out of five points in zone B or beyond
  //Zone B is defined as > the first Sigma and < the second sigma.
  for (let i = 0; i < data.dataForChart.length; i++) {
    let posSigma = data.iBarPos1Sigma[i];
    let negSigma = data.iBarNeg1Sigma[i];
    let rangeOfFive = data.dataForChart.slice(i, i + 5);
    let fourWithinPos = rangeOfFive.filter((element) => {
      return element >= posSigma;
    });
    let fourWithinNeg = rangeOfFive.filter((element) => {
      return element <= negSigma;
    });

    if (fourWithinPos.length === 4) {
      trendIdentificationBank.rules.ruleThree.ruleBroken.push('Rule 3 Broken - Four out of five points in zone B or beyond ');
      trendIdentificationBank.rules.ruleThree.isBroken.push(1);
      trendIdentificationBank.rules.ruleThree.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleThree.valueOfBreak.push(data.dataForChart[i]);
    } else if (fourWithinNeg.length === 4) {
      trendIdentificationBank.rules.ruleThree.ruleBroken.push('Rule 3 Broken - Four out of five points in zone B or beyond ');
      trendIdentificationBank.rules.ruleThree.isBroken.push(1);
      trendIdentificationBank.rules.ruleThree.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleThree.valueOfBreak.push(data.dataForChart[i]);
    } else {
      trendIdentificationBank.rules.ruleThree.ruleBroken.push('Rule 3 Pass');
      trendIdentificationBank.rules.ruleThree.isBroken.push(null);
      trendIdentificationBank.rules.ruleThree.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleThree.valueOfBreak.push(null);
    }
  }

  //Fourth Rule - Rule 4 – Six points or more in a row steadily increasing or decreasing
  let rollingCountOfDataMovingUp = 0;
  let rollingCountOfDataMovingDown = 0;
  let ruleFourBrokenUp = false;
  let ruleFourBrokenDown = false;
  for (let i = 0; i < data.dataForChart.length; i++) {
    if (data.dataForChart[i] < data.dataForChart[i + 1]) {
      rollingCountOfDataMovingUp++;
      if (rollingCountOfDataMovingUp === 6) {
        ruleFourBrokenUp = true;
      }
    } else {
      rollingCountOfDataMovingUp = 0;
      ruleFourBrokenUp = false;
    }
    if (data.dataForChart[i] > data.dataForChart[i + 1]) {
      rollingCountOfDataMovingDown++;
      if (rollingCountOfDataMovingDown === 6) {
        ruleFourBrokenDown = true;
      }
    } else {
      rollingCountOfDataMovingDown = 0;
      ruleFourBrokenDown = false;
    }
    if (ruleFourBrokenUp || ruleFourBrokenDown) {
      trendIdentificationBank.rules.ruleFour.ruleBroken.push('Rule 4 Broken - Six points or more in a row steadily increasing or decreasing');
      trendIdentificationBank.rules.ruleFour.isBroken.push(1);
      trendIdentificationBank.rules.ruleFour.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleFour.valueOfBreak.push(data.dataForChart[i]);
    } else {
      trendIdentificationBank.rules.ruleFour.ruleBroken.push('Rule 4 Pass');
      trendIdentificationBank.rules.ruleFour.isBroken.push(null);
      trendIdentificationBank.rules.ruleFour.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleFour.valueOfBreak.push(null);
    }
  }

  //Fifth Rule - Rule 5 – Two out of three points in zone A (not exceeding the third sigma)
  for (let i = 0; i < data.dataForChart.length; i++) {
    let posSigma = data.iBarPos2Sigma[i];
    let posSigmaCeiling = data.iBarPos3Sigma[i];
    let negSigma = data.iBarNeg2Sigma[i];
    let negSigmaCeiling = data.iBarNeg3Sigma[i];
    let rangeOfThree = data.dataForChart.slice(i, i + 3);

    //God help me
    let twoWithinPos = rangeOfThree.filter((element) => {
      return element >= posSigma && element <= posSigmaCeiling;
    });
    let twoWithinNeg = rangeOfThree.filter((element) => {
      return element <= negSigma && element <= negSigmaCeiling;
    });

    if (twoWithinPos.length === 2) {
      trendIdentificationBank.rules.ruleFive.ruleBroken.push('Rule 5 Broken - Two out of three points in zone A');
      trendIdentificationBank.rules.ruleFive.isBroken.push(1);
      trendIdentificationBank.rules.ruleFive.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleFive.valueOfBreak.push(data.dataForChart[i]);
    } else if (twoWithinNeg.length === 2) {
      trendIdentificationBank.rules.ruleFive.ruleBroken.push('Rule 5 Broken - Two out of three points in zone A');
      trendIdentificationBank.rules.ruleFive.isBroken.push(1);
      trendIdentificationBank.rules.ruleFive.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleFive.valueOfBreak.push(data.dataForChart[i]);
    } else {
      trendIdentificationBank.rules.ruleFive.ruleBroken.push('Rule 5 Pass');
      trendIdentificationBank.rules.ruleFive.isBroken.push(null);
      trendIdentificationBank.rules.ruleFive.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleFive.valueOfBreak.push(null);
    }
  }

  for (let i = 0; i < data.dataForChart.length; i++) {
    let sliceOf14 = data.dataForChart.slice(i, i + 14);
    console.log(sliceOf14);
    if (sliceOf14.length === 14) {
      console.log(checkRule6(sliceOf14));
      if (checkRule6(sliceOf14)) {
        trendIdentificationBank.rules.ruleSix.ruleBroken.push('Rule 6 – 14 points in a row alternating up and down');
        trendIdentificationBank.rules.ruleSix.isBroken.push(1);
        trendIdentificationBank.rules.ruleSix.indexOfRuleBreak.push(i);
        trendIdentificationBank.rules.ruleSix.valueOfBreak.push(data.dataForChart[i]);
      } else {
        trendIdentificationBank.rules.ruleSix.ruleBroken.push('Rule 6 Pass');
        trendIdentificationBank.rules.ruleSix.isBroken.push(null);
        trendIdentificationBank.rules.ruleSix.indexOfRuleBreak.push(i);
        trendIdentificationBank.rules.ruleSix.valueOfBreak.push(null);
      }
    } else {
      console.log('made it here');
      trendIdentificationBank.rules.ruleSix.ruleBroken.push('Rule 6 Pass');
      trendIdentificationBank.rules.ruleSix.isBroken.push(null);
      trendIdentificationBank.rules.ruleSix.indexOfRuleBreak.push(i);
      trendIdentificationBank.rules.ruleSix.valueOfBreak.push(null);
    }
  }

  function checkRule6(dataArray) {
    if (dataArray.length < 14) return false; // Need at least 15 points to get 14 direction changes

    let directions = [];

    for (let i = 1; i < dataArray.length; i++) {
      let direction = dataArray[i] > dataArray[i - 1] ? 'up' : dataArray[i] < dataArray[i - 1] ? 'down' : 'flat';

      if (direction === 'flat') return false; // Rule breaks on equal points

      directions.push(direction);
    }

    // Now check if we have 14 alternating directions
    for (let i = 1; i < 14; i++) {
      if (directions[i] === directions[i - 1]) {
        return false;
      }
    }

    return true;
  }

  return trendIdentificationBank;
}

//-----Convert Object to CSV-----
function convertChartDataToCSV(dataObj) {
  const results = dataObj.results;
  const headers = Object.keys(results);
  const length = results[headers[0]].length;

  let csv = headers.join(',') + '\n';

  for (let i = 0; i < length; i++) {
    const row = headers.map((key) => results[key][i]);
    csv += row.join(',') + '\n';
  }
  return csv;
}

//-----Dwonload CSV-----
function downloadCSV(csvString, filename = 'chart_data.csv') {
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

//-----Nates Silly Countdown to Retirement-----

function calculateDays(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let timeDifference = end - start;
  let daysDifference = timeDifference / (1000 * 3600 * 24);
  return daysDifference;
}

const countDownClock = (number = 100, format = 'seconds') => {
  const d = document;
  const daysElement = d.querySelector('.days');
  const hoursElement = d.querySelector('.hours');
  const minutesElement = d.querySelector('.minutes');
  const secondsElement = d.querySelector('.seconds');
  let countdown;
  convertFormat(format);

  function convertFormat(format) {
    switch (format) {
      case 'seconds':
        return timer(number);
      case 'minutes':
        return timer(number * 60);
      case 'hours':
        return timer(number * 60 * 60);
      case 'days':
        return timer(number * 60 * 60 * 24);
    }
  }

  function timer(seconds) {
    const now = Date.now();
    const then = now + seconds * 1000;

    countdown = setInterval(() => {
      const secondsLeft = Math.round((then - Date.now()) / 1000);

      if (secondsLeft <= 0) {
        clearInterval(countdown);
        return;
      }

      displayTimeLeft(secondsLeft);
    }, 1000);
  }

  function displayTimeLeft(seconds) {
    daysElement.textContent = Math.floor(seconds / 86400);
    hoursElement.textContent = Math.floor((seconds % 86400) / 3600);
    minutesElement.textContent = Math.floor(((seconds % 86400) % 3600) / 60);
    secondsElement.textContent = seconds % 60 < 10 ? `0${seconds % 60}` : seconds % 60;
  }
};

/*
  start countdown
  enter number and format
  days, hours, minutes or seconds
*/
countDownClock(calculateDays(Date.now(), '2031-11-02'), 'days');
