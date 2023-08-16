import express from 'express';
import { accountsController } from './controllers/accounts-controller.js';
import { dashboardController } from './controllers/dashboard-controller.js';
import { stationController } from './controllers/station-controller.js';
import { aboutController } from './controllers/about-controller.js';

export const router = express.Router();

router.get('/', dashboardController.index);

router.get('/login', accountsController.login);
router.get('/signup', accountsController.signup);
router.get('/logout', accountsController.logout);
router.post('/register', accountsController.register);
router.post('/authenticate', accountsController.authenticate);

router.get('/dashboard', dashboardController.index);
router.post('/dashboard/addstation', dashboardController.addStation);
router.get('/station/:id', stationController.index);
router.post('/station/:id/addmeasure', stationController.addMeasure);
router.get(
  '/station/:id/deletemeasure/:measureId',
  stationController.deleteMeasure
);

router.get('/about', aboutController.index);
router.get('/logout', accountsController.logout);
