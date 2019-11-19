import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';
import ScheduleController from './app/controllers/ScheduleController';
import NotificationController from './app/controllers/NotificationController';
import AvailableController from './app/controllers/AvailableController';

import UserStoreValidator from './app/validators/UserStoreValidator';
import UserUpdateValidator from './app/validators/UserUpdateValidator';
import SessionStoreValidator from './app/validators/SessionStoreValidator';
import AppointmentStoreValidator from './app/validators/AppointmentStoreValidator';

import authMiddleware from './app/midlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

// User/Session:
routes.post('/users', UserStoreValidator, UserController.store);
routes.post('/sessions', SessionStoreValidator, SessionController.store);

// tudo após essa linha vai passar pelo authMiddleware.
routes.use(authMiddleware);

routes.put('/users', UserUpdateValidator, UserController.update);
/********************/

// Providers:
routes.get('/providers', ProviderController.index);
/********************/

// Availables:
routes.get('/providers/:providerId/available', AvailableController.index);
/********************/

// Appointments:
routes.get('/appointments', AppointmentController.index);
routes.post(
  '/appointments',
  AppointmentStoreValidator,
  AppointmentController.store
);
routes.delete('/appointments/:id', AppointmentController.delete);
/********************/

// Schedules:
routes.get('/schedule', ScheduleController.index);
/********************/

// Notifications:
routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);
/********************/

// Files:
routes.post('/files', upload.single('file'), FileController.store);
/********************/

export default routes;
