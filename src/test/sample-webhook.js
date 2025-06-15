const axios = require('axios');
require('dotenv').config();

// Sample webhook payloads
const samples = {
  transferStateChange: {
    data: {
      resource: {
        type: "transfer",
        id: 1001,
        profile_id: 2001,
        account_id: 3001
      },
      current_state: "funds_converted",
      previous_state: "processing",
      occurred_at: "2025-06-15T12:00:00Z"
    },
    subscription_id: "01234567-89ab-cdef-0123-456789abcdef",
    event_type: "transfers#state-change",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:00:01Z"
  },

  transferFailure: {
    data: {
      transfer_id: 1002,
      profile_id: 2002,
      failure_reason_code: "WRONG_ACCOUNT_NUMBER",
      failure_description: "Invalid bank account number",
      occurred_at: "2025-06-15T12:10:00Z"
    },
    subscription_id: "abcde123-4567-89ab-cdef-0123456789ab",
    event_type: "transfers#payout-failure",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:10:01Z"
  },

  balanceCredit: {
    data: {
      resource: {
        type: "balance-account",
        id: 501,
        profile_id: 601
      },
      transaction_type: "credit",
      amount: 1000.00,
      currency: "USD",
      post_transaction_balance_amount: 1500.00,
      occurred_at: "2025-06-15T12:05:00Z"
    },
    subscription_id: "fedcba98-7654-3210-fedc-ba9876543210",
    event_type: "balances#credit",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:05:01Z"
  },

  unknownEvent: {
    data: {
      some_field: "some value",
      occurred_at: "2025-06-15T12:20:00Z"
    },
    event_type: "unknown#event",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:20:01Z"
  },

  errorWebhook: {
    // This will trigger an error by omitting required fields
    data: {},
    event_type: "transfers#state-change",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:25:01Z"
  },

  activeCases: {
    resource: {
      id: 0,
      profile_id: 0,
      account_id: 0,
      type: "transfer"
    },
    active_cases: [
      "issue_one",
      "issue_two",
      "issue_three"
    ],
    event_type: "transfers#active-cases",
    schema_version: "2.0.0",
    sent_at: "2025-06-15T12:30:01Z"
  }
};

// Function to send a webhook
async function sendWebhook(payload) {
  try {
    const response = await axios.post('http://localhost:3000/webhook', payload);
    console.log(`✅ Webhook sent successfully for ${payload.event_type}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error sending webhook:`, error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

// Send all sample webhooks
async function sendAllSamples() {
  console.log('Sending sample webhooks...\n');
  
  for (const [name, payload] of Object.entries(samples)) {
    console.log(`\nSending ${name} webhook...`);
    await sendWebhook(payload);
    // Wait 2 seconds between webhooks
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run if this file is executed directly
if (require.main === module) {
  sendAllSamples().catch(console.error);
} 