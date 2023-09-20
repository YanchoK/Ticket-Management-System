import express, { Router } from 'express';
import WebhookController from '../controllers/webhook_controller';


const router: Router = express.Router();
router.post('/onIssueEvent', WebhookController.onIssueEvent)

    // router.post('/onIssueUpdate', WebhookController.onIssueUpdate)
    // router.post('/onIssueCreate', WebhookController.onIssueCreate)
    // router.post('/onIssueDelete', WebhookController.onIssueDelete)

export default router;

