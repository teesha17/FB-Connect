import express from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';
import { Connect, Disconnect, ExchangeFacebookCode, GetFacebookPages } from '../controllers/FaceBook.Controller/index.js';

const FacebookRouter = express.Router();

FacebookRouter.post('/oauth',AuthMiddleware, Connect);
FacebookRouter.post('/disconnect',AuthMiddleware, Disconnect);
FacebookRouter.post('/exchange-token', ExchangeFacebookCode);
FacebookRouter.post('/pages', GetFacebookPages);

export default FacebookRouter;
