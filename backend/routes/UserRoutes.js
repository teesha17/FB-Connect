import express from 'express';
import { LoginUser, RegisterUser } from '../controllers/User.Controller/index.js'

const UserRouter = express.Router();

UserRouter.post('/login', LoginUser);
UserRouter.post('/register', RegisterUser);

export default UserRouter;