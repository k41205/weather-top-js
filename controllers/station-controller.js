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
    const newMeasure = {
      time: new Date().toLocaleString('en-UK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }),
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding a new measure`);
    await measureStore.addMeasure(station._id, newMeasure);
    response.redirect('/station/' + station._id);
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
