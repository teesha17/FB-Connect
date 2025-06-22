import express from 'express';
import { GetAllConversations, ReceiveMessage, ReplyMessage, VerifyWebHook } from '../controllers/WebHook.Controller/index.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';


const WebhookRouter = express.Router();

WebhookRouter.get('/verify_webhook', VerifyWebHook);
WebhookRouter.post('/verify_webhook', ReceiveMessage);
WebhookRouter.get('/receive_message', ReceiveMessage);
WebhookRouter.post('/reply_message',AuthMiddleware, ReplyMessage);
WebhookRouter.get('/all', GetAllConversations);

export default WebhookRouter;
