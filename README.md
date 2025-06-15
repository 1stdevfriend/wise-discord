# Wise Discord Webhook Handler

A webhook handler for Wise events that forwards notifications to Discord with formatted embeds.

## Features

- Express.js server setup
- Wise webhook handling
- Discord webhook integration
- Formatted embeds for different event types:
  - Transfer state changes
  - Transfer payout failures
  - Balance credits
  - Unknown events
- Error handling with separate error webhook
- Security middleware (Helmet)
- CORS enabled
- Request logging (Morgan)
- Environment variables support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Discord webhook URLs

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env` and fill in your Discord webhook URLs:
```bash
cp .env.example .env
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
PORT=3000
NODE_ENV=development
DISCORD_WEBHOOK_URL=your_discord_webhook_url_here
DISCORD_ERROR_WEBHOOK_URL=your_discord_error_webhook_url_here
```

## Usage

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Webhook Endpoints

### POST /webhook
Receives Wise webhook events and forwards them to Discord.

Supported event types:
- `transfers#state-change`
- `transfers#payout-failure`
- `balances#credit`
- Unknown events (sends raw payload)

### GET /health
Health check endpoint.

## Project Structure

```
.
├── src/
│   ├── app.js
│   └── utils/
│       └── discord.js
├── .env
├── .env.example
├── package.json
└── README.md
```

## Error Handling

- All errors are logged to the console
- Errors are sent to a separate Discord webhook for monitoring
- Unknown event types are handled gracefully with raw payload display

## License

AGPL-3