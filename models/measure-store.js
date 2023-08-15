import { v4 } from "uuid";
import { initStore } from "../utils/store-utils.js";

const db = initStore("measures");

export const measureStore = {
  async getAllMeasures() {
    await db.read();
    return db.data.measures;
  },

  async addMeasure(stationId, measure) {
    await db.read();
    measure._id = v4();
    measure.stationid = stationId;
    db.data.measures.push(measure);
    await db.write();
    return measure;
  },

  async getMeasuresByStationId(id) {
    if (!db.data || !db.data.measures) return
    await db.read();
    return db.data.measures.filter((measure) => measure.stationid === id);
  },

  async getMeasureById(id) {
    await db.read();
    return db.data.measures.find((measure) => measure._id === id);
  },

  async deleteMeasure(id) {
    await db.read();
    const index = db.data.measures.findIndex((measure) => measure._id === id);
    db.data.measures.splice(index, 1);
    await db.write();
  },

  async deleteAllMeasures() {
    db.data.measures = [];
    await db.write();
  },

  async updateMeasure(measure, updatedMeasure) {
    measure.code = updatedMeasure.code;
    measure.temp = updatedMeasure.temp;
    measure.windSpeed = updatedMeasure.windSpeed;
    measure.windDirection = updatedMeasure.windDirection;
    measure.pressure = updatedMeasure.pressure;
    await db.write();
  },
  
   async getLastMeasureByStationId(id) {
    await db.read();
    const measures = db.data.measures.filter((measure) => measure.stationid === id);
    return measures.length > 0 ? measures[measures.length - 1] : null;
  }
};
