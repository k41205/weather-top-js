import Handlebars from 'handlebars'; // If you're using ES modules

const WIND_SPEEDS = {
  0: [0, 1],
  1: [1, 5],
  2: [6, 11],
  3: [12, 19],
  4: [20, 28],
  5: [29, 38],
  6: [39, 49],
  7: [50, 61],
  8: [62, 74],
  9: [75, 88],
  10: [89, 102],
  11: [103, 117],
};

function windSpeedToBeaufort(speed) {
  for (let key in WIND_SPEEDS) {
    let range = WIND_SPEEDS[key];
    if (speed >= range[0] && speed <= range[1]) {
      return parseInt(key); // Convert the key string to an integer
    }
  }
  return null;
}

Handlebars.registerHelper('windSpeedToBeaufort', windSpeedToBeaufort);

const WIND_DIRECTIONS = {
  'North North East': 11.25,
  'North East': 33.75,
  'East North East': 56.25,
  East: 78.75,
  'East South East': 101.25,
  'South East': 123.75,
  'South South East': 146.25,
  South: 168.75,
  'South South West': 191.25,
  'South West': 213.75,
  'West South West': 236.25,
  West: 258.75,
  'West North West': 281.25,
  'North West': 303.75,
  'North North West': 326.25,
  North: 348.75,
};

function degreeToName(degree) {
  let previousKey = 'North';
  for (let key in WIND_DIRECTIONS) {
    let startRange = WIND_DIRECTIONS[key];
    if (degree < startRange) {
      return previousKey;
    }
    previousKey = key;
  }
  return 'North';
}

function arrMeasure(measures, givenMeasure) {
  return measures.map((measure) => measure[givenMeasure]);
}

function maxValue(measures, givenMeasure) {
  let values = measures.map((measure) => measure[givenMeasure]);
  let maxVal = values[0];
  for (let value of values) {
    maxVal = Math.max(maxVal, value);
  }
  return +maxVal;
}

function minValue(measures, givenMeasure) {
  let values = measures.map((measure) => measure[givenMeasure]);
  let minVal = values[0];
  for (let value of values) {
    minVal = Math.min(minVal, value);
  }
  return +minVal;
}

function checkTrend(measures, givenMeasure) {
  let values = measures.map((measure) => measure[givenMeasure]);
  if (values.length < 3) {
    return 'Insufficient measures';
  }
  // m1 last measure, m2 second last measure, m3 third last measure
  let m1 = values[measures.length - 1];
  let m2 = values[measures.length - 2];
  let m3 = values[measures.length - 3];

  if (m1 > m2 && m2 > m3) {
    return 'UP';
  } else if (m1 < m2 && m2 < m3) {
    return 'DOWN';
  } else {
    return 'NONE';
  }
}

function eq(a, b) {
  if (a === b) return true;
  else return false;
}

Handlebars.registerHelper('arrMeasure', arrMeasure);

Handlebars.registerHelper('eq', eq);

Handlebars.registerHelper('checkTrend', checkTrend);

Handlebars.registerHelper('maxValue', maxValue);

Handlebars.registerHelper('minValue', minValue);

Handlebars.registerHelper('windChill', function (temp, windSpeed) {
  return (
    13.12 +
    0.6215 * temp -
    11.37 * Math.pow(windSpeed, 0.16) +
    0.3965 * temp * Math.pow(windSpeed, 0.16)
  ).toFixed(2);
});

Handlebars.registerHelper('degreeToName', degreeToName);

Handlebars.registerHelper('toFahrenheit', function (temp) {
  return (temp * 9) / 5 + 32;
});
