import express from 'express';
import { Login, RegisterUser } from '../controllers/User.Controller/index.js'

const UserRouter = express.Router();

UserRouter.post('/login', Login);
UserRouter.post('/register', RegisterUser);

export default UserRouter;