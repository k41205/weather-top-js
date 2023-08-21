import { stationStore } from './models/station-store.js';
import { measureStore } from './models/measure-store.js';

export async function loadData() {
  try {
    await stationStore.getAllStations();
    await measureStore.getAllMeasures();
    console.log('Data loaded successfully');
  } catch (error) {
    console.error('Failed to load data:', error);
    process.exit(1);
  }
}
