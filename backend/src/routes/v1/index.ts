import express from 'express';
import taskRouters from './taskRouters';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/tasks',
    route: taskRouters,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
