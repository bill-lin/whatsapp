import 'dotenv/config';
import express, { Request, Response } from 'express';
import { WhatsAppService } from './services/whatsapp.service';

const app = express();
const port = process.env.PORT || 3000;

// Initialize WhatsApp service
const whatsappService = new WhatsAppService();

// Basic Express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check endpoint
app.get('/health', (_req: Request, res: Response): void => {
    res.json({ status: 'ok' });
});

// Initialize WhatsApp client
whatsappService.initialize();

// Start the server
app.listen(port, (): void => {
    console.log(`Server is running on port ${port}`);
}); 