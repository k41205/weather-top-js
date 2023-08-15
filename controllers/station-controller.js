import { stationStore } from "../models/station-store.js";
import { measureStore } from "../models/measure-store.js";

export const stationController = {
  async index(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const lastMeasure = await measureStore.getLastMeasureByStationId(station._id);

    const viewData = {
      name: "Station",
      station: station,
      lastMeasure: lastMeasure,
    };
    response.render("station-view", viewData);
  },

  async addMeasure(request, response) {
    const station = await stationStore.getStationById(request.params.id);
    const newMeasure = {
      code: Number(request.body.code),
      temp: Number(request.body.temp),
      windSpeed: Number(request.body.windSpeed),
      windDirection: Number(request.body.windDirection),
      pressure: Number(request.body.pressure),
    };
    console.log(`adding a new measure`);
    await measureStore.addMeasure(station._id, newMeasure);
    response.redirect("/station/" + station._id);
  },
};
