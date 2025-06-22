import FacebookRouter from './FacebookRoutes.js';
import UserRouter from './UserRoutes.js';
import WebhookRouter from './WebHookRoutes.js';

function routes(app) {
    app.use('/api/v1/user', UserRouter);
    app.use('/api/v1/facebook', FacebookRouter);
    app.use('/api/v1/webhook', WebhookRouter);
}

export default routes;