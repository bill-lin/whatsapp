import { google } from 'googleapis';
import { Message } from 'whatsapp-web.js';

export class GoogleSheetsService {
    private sheets;
    private spreadsheetId: string;
    private sheetName: string;

    constructor() {
        // Initialize Google Sheets API
        const auth = new google.auth.GoogleAuth({
            credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS || '{}'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        this.sheets = google.sheets({ version: 'v4', auth });
        this.spreadsheetId = process.env.GOOGLE_SHEET_ID || '';
        this.sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';

        if (!this.spreadsheetId) {
            throw new Error('Please set GOOGLE_SHEET_ID in .env file');
        }
    }

    public async saveMessage(message: Message): Promise<void> {
        try {
            const messageInfo = {
                timestamp: new Date().toLocaleString(),
                from: message.from,
                to: message.to,
                body: message.body,
                type: message.type,
                hasMedia: message.hasMedia ? 'Yes' : 'No',
                isForwarded: message.isForwarded ? 'Yes' : 'No',
                isStatus: message.isStatus ? 'Yes' : 'No',
                isFromMe: message.fromMe ? 'Yes' : 'No'
            };

            // Format message as a row
            const row = [
                messageInfo.timestamp,
                messageInfo.from,
                messageInfo.to,
                messageInfo.body,
                messageInfo.type,
                messageInfo.hasMedia,
                messageInfo.isForwarded,
                messageInfo.isStatus,
                messageInfo.isFromMe
            ];

            // Append row to the sheet
            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: `${this.sheetName}!A:I`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [row]
                }
            });

            console.log('Message saved to Google Sheets successfully');
        } catch (error) {
            console.error('Error saving message to Google Sheets:', error);
            throw error;
        }
    }

    public async saveInterest(from: string, interest: string): Promise<void> {
        try {
            const timestamp = new Date().toLocaleString();
            const row = [timestamp, from, interest];

            await this.sheets.spreadsheets.values.append({
                spreadsheetId: this.spreadsheetId,
                range: `interests!A:C`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [row]
                }
            });

            console.log('Interest saved to Google Sheets (interests sheet) successfully');
        } catch (error) {
            console.error('Error saving interest to Google Sheets:', error);
            throw error;
        }
    }

    public async loadInterests(): Promise<Array<{interest: string }>> {
        try {
            const response = await this.sheets.spreadsheets.values.get({
                spreadsheetId: this.spreadsheetId,
                range: 'interests!C:C'
            });

            const rows = response.data.values || [];
            // Filter out empty rows and map to interest objects
            return rows
                .filter(row => row && row[0] && row[0].trim() !== ''&& row[0].trim() !== 'interest')
                .map(row => ({
                    interest: row[0].trim()
                }));
        } catch (error) {
            console.error('Error loading interests from Google Sheets:', error);
            throw error;
        }
    }
} 