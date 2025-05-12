import { Client, Message, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

import { GoogleSheetsService } from './google-sheets.service';

export class WhatsAppService {
    private client: Client;
    private qrDir: string;
    private sessionDir: string;
    private sessionDataDir: string;
    private static readonly BOT_PREFIX = '(from Bot) ';
    private googleSheetsService: GoogleSheetsService;

    constructor() {
        // Create directories if they don't exist
        this.qrDir = path.join(__dirname, '../../qr');
        this.sessionDir = path.join(__dirname, '../../.wwebjs_auth');
        this.sessionDataDir = path.join(__dirname, '../../.wwebjs_cache');

        [this.qrDir, this.sessionDir, this.sessionDataDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });

        // Initialize WhatsApp client with session
        this.client = new Client({
            puppeteer: {
                args: ['--no-sandbox']
            },
            authStrategy: new LocalAuth({
                clientId: 'whatsapp-news-aggregator',
                dataPath: this.sessionDir
            })
        });

        // Initialize Google Sheets service
        this.googleSheetsService = new GoogleSheetsService();

        this.setupEventHandlers();
    }

    private setupEventHandlers(): void {
        this.client.on('qr', this.handleQRCode.bind(this));
        this.client.on('ready', this.handleReady.bind(this));
        this.client.on('authenticated', this.handleAuthenticated.bind(this));
        this.client.on('auth_failure', this.handleAuthFailure.bind(this));
        this.client.on('disconnected', this.handleDisconnected.bind(this));
        this.client.on('message', this.handleMessage.bind(this));
        this.client.on('message_create', this.handleMyOwnMessage.bind(this));
    }

    private async handleQRCode(qr: string): Promise<void> {
        console.log('QR Code received:');
        qrcode.generate(qr, { small: true });
        
        // Save QR code as image
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const qrPath = path.join(this.qrDir, `whatsapp-qr-${timestamp}.png`);
        
        try {
            await QRCode.toFile(qrPath, qr, {
                color: {
                    dark: '#000000',
                    light: '#ffffff'
                },
                width: 400,
                margin: 2
            });
            console.log(`QR Code saved to: ${qrPath}`);
        } catch (err) {
            console.error('Error saving QR code:', err);
        }
    }

    private async handleReady(): Promise<void> {
        console.log('WhatsApp client is ready!');
        console.log('Session saved successfully. You can now restart the server without scanning the QR code again.');
        
        // Send test message when client is ready
        await this.sendTestMessage("Hello from my news aggregator bot");
    }

    private handleAuthenticated(): void {
        console.log('WhatsApp client is authenticated!');
    }

    private handleAuthFailure(): void {
        console.log('WhatsApp client authentication failed!');
    }

    private handleDisconnected(): void {
        console.log('WhatsApp client disconnected!');
    }

    private logMessage(message: Message, isOwnMessage: boolean = false): void {
        const messageInfo = {
            from: message.from,
            to: message.to,
            body: message.body,
            timestamp: new Date().toLocaleString(),
            type: message.type,
            hasMedia: message.hasMedia,
            isForwarded: message.isForwarded,
            isStatus: message.isStatus,
            isFromMe: message.fromMe
        };

        console.log(`📱 New WhatsApp Message ${isOwnMessage ? 'Created' : 'Received'}:`);
        console.log('----------------------------------------');
        console.log(`From: ${messageInfo.from} ${messageInfo.isFromMe ? '(Self)' : ''}`);
        console.log(`To: ${messageInfo.to}`);
        console.log(`Message: ${messageInfo.body}`);
        console.log(`Time: ${messageInfo.timestamp}`);
        console.log(`Type: ${messageInfo.type}`);
        console.log(`Has Media: ${messageInfo.hasMedia}`);
        console.log(`Is Forwarded: ${messageInfo.isForwarded}`);
        console.log(`Is Status: ${messageInfo.isStatus}`);
        console.log('----------------------------------------');
    }

    private async handleMessage(message: Message): Promise<void> {
        this.logMessage(message);
        
        // Save message to Google Sheets
        try {
            await this.googleSheetsService.saveMessage(message);
        } catch (error) {
            console.error('Error saving message to Google Sheets:', error);
        }

        // Automatically react with thumbs up emoji
        await autoReact(message);
    }

    private async handleMyOwnMessage(message: Message): Promise<void> {
        this.logMessage(message, true);
        
        // Save message to Google Sheets
        try {
            await this.googleSheetsService.saveMessage(message);
        } catch (error) {
            console.error('Error saving message to Google Sheets:', error);
        }
    }

    public async sendMessage(to: string, message: string): Promise<void> {
        try {
            const prefixedMessage = `${WhatsAppService.BOT_PREFIX}${message}`;
            await this.client.sendMessage(to, prefixedMessage);
            console.log('Message sent successfully!');
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }

    public async sendTestMessage(customMessage?: string): Promise<void> {
        try {
            const testNumber = process.env.TEST_PHONE_NUMBER;
            if (!testNumber) {
                console.error('Please set TEST_PHONE_NUMBER in .env file');
                return;
            }

            const defaultMessage = 'Hello! This is a test message from your WhatsApp News Aggregator bot. 🚀';
            const message = customMessage || defaultMessage;
            await this.sendMessage(testNumber, message);
            console.log('Test message sent successfully!');
        } catch (error) {
            console.error('Error sending test message:', error);
        }
    }

    public async initialize(): Promise<void> {
        await this.client.initialize();
    }

    public getClient(): Client {
        return this.client;
    }
} 

async function autoReact(message: Message) {
    try {
        await message.react('👍');
        console.log('Reacted to message with 👍');
    } catch (error) {
        console.error('Error reacting to message:', error);
    }
}
