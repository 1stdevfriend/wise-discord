require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const {
  sendDiscordWebhook,
  createTransferStateChangeEmbed,
  createTransferFailureEmbed,
  createBalanceCreditEmbed,
  createActiveCasesEmbed,
  createErrorEmbed,
  createTransferIncomingPaymentWaitingEmbed
} = require('./utils/discord');

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    const { event_type, data } = req.body;

    let embed;
    switch (event_type) {
      case 'transfers#state-change':
        if (
          data.previous_state === null &&
          data.current_state === 'incoming_payment_waiting'
        ) {
          embed = createTransferIncomingPaymentWaitingEmbed(data);
        } else {
          embed = createTransferStateChangeEmbed(data);
        }
        break;
      case 'transfers#payout-failure':
        embed = createTransferFailureEmbed(data);
        break;
      case 'balances#credit':
        embed = createBalanceCreditEmbed(data);
        break;
      case 'transfers#active-cases':
        embed = createActiveCasesEmbed(data);
        break;
      default:
        // For unknown events, send the raw payload
        embed = {
          title: 'Unknown Event',
          color: 0xffff00,
          description: 'Received an unknown event type',
          fields: [
            { name: 'Event Type', value: event_type, inline: true },
            { name: 'Raw Data', value: '```json\n' + JSON.stringify(data, null, 2) + '\n```', inline: false }
          ],
          timestamp: new Date().toISOString()
        };
    }

    await sendDiscordWebhook(process.env.DISCORD_WEBHOOK_URL, embed);
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    
    // Send error to Discord error webhook
    try {
      const errorEmbed = createErrorEmbed(error, req.body);
      await sendDiscordWebhook(process.env.DISCORD_ERROR_WEBHOOK_URL, errorEmbed);
    } catch (discordError) {
      console.error('Failed to send error to Discord:', discordError);
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Express Boilerplate API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 