# Technical Design and Architecture

## System Overview

A simple WhatsApp-based news aggregator that:
1. Receives news from various sources
2. Stores them in Google Drive
3. Sends updates to users via WhatsApp
4. Uses AI to personalize content

## Basic Architecture
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  WhatsApp   │◄────┤  Node.js    │────►│   OpenAI    │
│    API      │     │  Server     │     │    API      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │  Google     │
                    │   Drive     │
                    └─────────────┘
```

## Technical Stack

### Core Components
- Node.js server
- TypeScript
- Express.js for API endpoints
- Google Drive API for storage
- WhatsApp Business API for messaging
- OpenAI API for content analysis

## Basic Data Structure

### News Item
```typescript
interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  url: string;
  topics: string[];
  createdAt: Date;
}
```

### User
```typescript
interface User {
  id: string;
  phoneNumber: string;
  topics: string[];
  createdAt: Date;
}
```

## File Structure
```
/WhatsAppNews/
├── news/
│   └── {date}/
│       └── {newsId}.json
└── users/
    └── {userId}.json
```

## API Endpoints

### Basic Endpoints
```
POST   /api/news          # Add new news
GET    /api/news          # Get news list
POST   /api/users         # Register user
GET    /api/users/:id     # Get user info
POST   /webhook/whatsapp  # WhatsApp webhook
```

## Development Setup

### Requirements
- Node.js v18+
- npm or yarn
- Google Drive API credentials
- WhatsApp Business API key
- OpenAI API key

### Environment Variables
```bash
.env
├── PORT=3000
├── GOOGLE_DRIVE_CREDENTIALS=...
├── WHATSAPP_API_KEY=...
└── OPENAI_API_KEY=...
```

### Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start server:
   ```bash
   npm run dev
   ```

## Basic Features

### News Collection
- Fetch news from sources
- Store in Google Drive
- Basic content filtering

### User Management
- User registration
- Topic subscription
- Basic preferences

### WhatsApp Integration
- Send news updates
- Handle user messages
- Basic templates

### AI Features
- Content summarization
- Topic matching
- Basic personalization

## Error Handling

### Basic Error Types
```typescript
enum ErrorType {
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DRIVE_ERROR = 'DRIVE_ERROR'
}
```

### Error Response
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  timestamp: Date;
}
```

## Testing

### Manual Testing
1. Feature Testing
   - User registration flow
   - Topic subscription
   - News delivery
   - WhatsApp interaction
   - Error handling

2. API Testing
   - Endpoint validation
   - Request/response format
   - Error responses
   - Rate limiting

3. Integration Testing
   - Google Drive operations
   - WhatsApp API integration
   - OpenAI API integration
   - File system operations

### Automated E2E Testing
1. Test Framework
   - Tool: Playwright
   - Language: TypeScript
   - CI/CD: GitHub Actions
   - Frequency: Pre-deployment

2. Test Scenarios
   ```typescript
   // User Flow Tests
   test('user can subscribe to news topic', async () => {
     // Register user
     // Subscribe to topic
     // Verify news delivery
     // Check WhatsApp message
   });

   // News Flow Tests
   test('news is delivered to subscribers', async () => {
     // Add news item
     // Process subscriptions
     // Verify delivery
     // Check message content
   });

   // WhatsApp Integration Tests
   test('whatsapp message delivery', async () => {
     // Send test message
     // Verify delivery
     // Check message format
   });
   ```

3. Test Environment
   - Local development
   - Staging environment
   - Production checks
   - Mock services

4. Test Data Management
   - Test user accounts
   - Sample news items
   - Mock WhatsApp numbers
   - Test credentials

### Test Documentation
1. Test Cases
   - User flows
   - API endpoints
   - Integration points
   - Error scenarios

2. Setup Instructions
   - Environment setup
   - Test data preparation
   - Running tests
   - Debugging tests

3. Test Reports
   - Test results
   - Coverage reports
   - Error logs
   - Performance metrics

## Testing Strategy

### Manual Testing
1. Feature Testing
   - User registration flow
   - Topic subscription
   - News delivery
   - WhatsApp interaction
   - Error handling

2. API Testing
   - Endpoint validation
   - Request/response format
   - Error responses
   - Rate limiting

3. Integration Testing
   - Google Drive operations
   - WhatsApp API integration
   - OpenAI API integration
   - File system operations

### Automated E2E Testing
1. Test Framework
   - Tool: Playwright
   - Language: TypeScript
   - CI/CD: GitHub Actions
   - Frequency: Pre-deployment

2. Test Scenarios
   ```typescript
   // User Flow Tests
   test('user can subscribe to news topic', async () => {
     // Register user
     // Subscribe to topic
     // Verify news delivery
     // Check WhatsApp message
   });

   // News Flow Tests
   test('news is delivered to subscribers', async () => {
     // Add news item
     // Process subscriptions
     // Verify delivery
     // Check message content
   });

   // WhatsApp Integration Tests
   test('whatsapp message delivery', async () => {
     // Send test message
     // Verify delivery
     // Check message format
   });
   ```

3. Test Environment
   - Local development
   - Staging environment
   - Production checks
   - Mock services

4. Test Data Management
   - Test user accounts
   - Sample news items
   - Mock WhatsApp numbers
   - Test credentials

### Test Documentation
1. Test Cases
   - User flows
   - API endpoints
   - Integration points
   - Error scenarios

2. Setup Instructions
   - Environment setup
   - Test data preparation
   - Running tests
   - Debugging tests

3. Test Reports
   - Test results
   - Coverage reports
   - Error logs
   - Performance metrics 