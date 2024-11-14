// src/services/WebSocket.js
import ActionCable from '@rails/actioncable';

const createCable = (authToken) => {
  return ActionCable.createConsumer(`ws://<NGROK_URL>/cable?token=${authToken}`);
};

export const subscribeToFeed = (cable, onReceived) => {
  return cable.subscriptions.create(
    { channel: 'FeedChannel' },
    {
      received: onReceived,
      connected: () => console.log('Connected to FeedChannel'),
      disconnected: () => console.log('Disconnected from FeedChannel'),
    }
  );
};

export default createCable;

