import { stationStore } from '../models/station-store.js';
import { measureStore } from '../models/measure-store.js';
import { accountsController } from './accounts-controller.js';

export const dashboardController = {
  async index(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const stations = await stationStore.getStationsByUserId(loggedInUser._id);
    for (const station of stations) {
      const measures = await measureStore.getMeasuresByStationId(station._id);
      if (measures && measures.length > 0) {
        const lastMeasure = measures[measures.length - 1];
        station.lastMeasure = lastMeasure;
      }
    }
    const viewData = {
      title: 'Station Dashboard',
      stations: stations,
    };
    console.log('dashboard view rendering');
    response.render('dashboard-view', viewData);
  },

  async addStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const newStation = {
      name: request.body.name,
      latitude: Number(request.body.latitude),
      longitude: Number(request.body.longitude),
      userid: loggedInUser._id,
    };
    console.log(`adding station ${newStation.name}`);
    await stationStore.addStation(newStation);
    response.redirect('/dashboard');
  },

  async deleteStation(request, response) {
    const loggedInUser = await accountsController.getLoggedInUser(request);
    if (!loggedInUser) {
      return response.redirect('/login');
    }
    const stationId = request.params.id;
    console.log(`Deleting Station ${stationId}`);
    await stationStore.deleteStationById(stationId);
    response.redirect('/dashboard');
  },
};
