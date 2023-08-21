import { v4 } from 'uuid';
import { initStore } from '../utils/store-utils.js';
import { measureStore } from './measure-store.js';

const db = initStore('stations');

export const stationStore = {
  async getAllStations() {
    await db.read();
    return db.data.stations;
  },

  async addStation(station) {
    await db.read();
    station._id = v4();
    db.data.stations.push(station);
    await db.write();
    return station;
  },

  async getStationById(id) {
    await db.read();
    const list = db.data.stations.find((station) => station._id === id);
    if (list) {
      list.measures = await measureStore.getMeasuresByStationId(list._id);
    }
    return list;
  },

  async getStationsByUserId(userid) {
    await db.read();
    const stations = db.data.stations.filter(
      (station) => station.userid === userid
    );

    for (const station of stations) {
      const measures = await measureStore.getMeasuresByStationId(station._id);
      station.measures = measures;
    }

    return stations;
  },

  async deleteStationById(id) {
    await db.read();
    const index = db.data.stations.findIndex((station) => station._id === id);
    db.data.stations.splice(index, 1);
    await db.write();
  },

  async deleteAllStations() {
    db.data.stations = [];
    await db.write();
  },
};
