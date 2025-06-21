const axios = require('axios');

const WISE_LOGO_URL = 'https://media.discordapp.net/attachments/540447710239784971/1383695365538058322/image.png';

const sendDiscordWebhook = async (webhookUrl, embed) => {
  try {
    await axios.post(webhookUrl, {
      embeds: [embed]
    });
  } catch (error) {
    console.error('Error sending Discord webhook:', error.message);
    throw error;
  }
};

const getFooter = (occurredAt) => ({
  text: `Sent from Wise | ${new Date(occurredAt).toLocaleString()}`,
  icon_url: WISE_LOGO_URL
});

const createTransferStateChangeEmbed = (data) => {
  return {
    title: '💸 Transfer State Change',
    color: 0x00ff00,
    fields: [
      { name: '🆔 Transfer ID', value: data.resource.id.toString(), inline: true },
      { name: '👤 Profile ID', value: data.resource.profile_id.toString(), inline: true },
      { name: '🏦 Account ID', value: data.resource.account_id.toString(), inline: true },
      { name: '🔄 Current State', value: data.current_state, inline: true },
      { name: '⏪ Previous State', value: data.previous_state, inline: true },
      { name: '⏰ Occurred At', value: new Date(data.occurred_at).toLocaleString(), inline: true }
    ],
    footer: getFooter(data.occurred_at),
    timestamp: new Date().toISOString()
  };
};

const createTransferFailureEmbed = (data) => {
  return {
    title: '❌ Transfer Payout Failure',
    color: 0xff0000,
    fields: [
      { name: '🆔 Transfer ID', value: data.transfer_id.toString(), inline: true },
      { name: '👤 Profile ID', value: data.profile_id.toString(), inline: true },
      { name: '⚠️ Failure Reason', value: data.failure_reason_code, inline: true },
      { name: '📝 Description', value: data.failure_description, inline: true },
      { name: '⏰ Occurred At', value: new Date(data.occurred_at).toLocaleString(), inline: true }
    ],
    footer: getFooter(data.occurred_at),
    timestamp: new Date().toISOString()
  };
};

const createBalanceCreditEmbed = (data) => {
  return {
    title: '💰 Balance Credit',
    color: 0x00ff00,
    fields: [
      { name: '🏦 Account ID', value: data.resource.id.toString(), inline: true },
      { name: '👤 Profile ID', value: data.resource.profile_id.toString(), inline: true },
      { name: '💵 Amount', value: `${data.amount} ${data.currency}`, inline: true },
      { name: '💳 New Balance', value: `${data.post_transaction_balance_amount} ${data.currency}`, inline: true },
      { name: '⏰ Occurred At', value: new Date(data.occurred_at).toLocaleString(), inline: true }
    ],
    footer: getFooter(data.occurred_at),
    timestamp: new Date().toISOString()
  };
};

const createActiveCasesEmbed = (data) => {
  return {
    title: '📝 Active Cases for Transfer',
    color: 0xffa500,
    fields: [
      { name: '🆔 Transfer ID', value: data.resource.id.toString(), inline: true },
      { name: '👤 Profile ID', value: data.resource.profile_id.toString(), inline: true },
      { name: '🏦 Account ID', value: data.resource.account_id.toString(), inline: true },
      { name: '📋 Active Cases', value: data.active_cases && data.active_cases.length ? data.active_cases.map((c, i) => `• ${c}`).join('\n') : 'None', inline: false }
    ],
    footer: {
      text: 'Sent from Wise | Active Cases',
      icon_url: WISE_LOGO_URL
    },
    timestamp: new Date().toISOString()
  };
};

const createErrorEmbed = (error, payload = null) => {
  const fields = [
    { name: 'Error Message', value: error.message || 'Unknown error', inline: false },
    { name: 'Timestamp', value: new Date().toLocaleString(), inline: true }
  ];

  // Add payload if provided
  if (payload) {
    fields.push({
      name: 'Request Payload',
      value: '```json\n' + JSON.stringify(payload, null, 2) + '\n```',
      inline: false
    });
  }

  return {
    title: '🚨 Error Occurred',
    color: 0xff0000,
    fields: fields,
    footer: {
      text: 'Sent from Wise | Error',
      icon_url: WISE_LOGO_URL
    },
    timestamp: new Date().toISOString()
  };
};

module.exports = {
  sendDiscordWebhook,
  createTransferStateChangeEmbed,
  createTransferFailureEmbed,
  createBalanceCreditEmbed,
  createActiveCasesEmbed,
  createErrorEmbed
}; 