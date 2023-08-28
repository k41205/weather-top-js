import { stationStore } from '../models/station-store.js';
import { measureStore } from '../models/measure-store.js';
import { accountsController } from './accounts-controller.js';

export const stationController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const station = await stationStore.getStationById(request.params.id);
    const lastMeasure = await measureStore.getLastMeasureByStationId(
      station._id
    );

    const viewData = {
      title: `${station.name} Station`,
      station: station,
      lastMeasure: lastMeasure,
    };
    response.render('station-view', viewData);
  },

  async addMeasure(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const station = await stationStore.getStationById(request.params.id);
    const lastMeasure = await measureStore.getLastMeasureByStationId(
      station._id
    );

    let time = Number(request.body.time);
    const code = Number(request.body.code);
    const temp = Number(request.body.temp);
    const windSpeed = Number(request.body.windSpeed);
    const windDirection = Number(request.body.windDirection);
    const pressure = Number(request.body.pressure);

    let errorMessage = '';
    let generated = true;

    if(!time) {
      generated = false;
      time = new Date().toLocaleString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
    }

    if (temp < -20 || temp > 50) {
      errorMessage += 'Temperature must be a value between -20 and 50. ';
    }
    if (windSpeed < 0 || windSpeed > 117) {
      errorMessage += 'Wind Speed must be a value between 0 and 117. ';
    }
    if (windDirection < 0 || windDirection > 360) {
      errorMessage += 'Wind Direction must be a value between 0 and 360. ';
    }
    if (pressure < 500 || pressure > 1500) {
      errorMessage += 'Pressure must be a value between 500 and 1500.';
    }

    if (errorMessage) {
      console.log('an error has been produced');
      response.render('station-view', {
        title: `${station.name} Station`,
        station: station,
        lastMeasure: lastMeasure,
        errorMessage,
      });
      return;
    }

    const newMeasure = {
      time,
      code,
      temp,
      windSpeed,
      windDirection,
      pressure,
    };
    console.log(`adding a new measure`);
    await measureStore.addMeasure(station._id, newMeasure);
    if (generated) response.status(200).json({ message: 'Data added successfully' });
    if (!generated) response.redirect('/station/' + station._id);
  },

  async deleteMeasure(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const stationId = request.params.id;
    const measureId = request.params.measureid;
    console.log(`Deleting Measure ${measureId} from Station ${stationId}`);
    await measureStore.deleteMeasure(request.params.measureId);
    response.redirect('/station/' + stationId);
  },
};
