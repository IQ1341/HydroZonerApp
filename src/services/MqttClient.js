import { Client, Message } from 'paho-mqtt';

// Ganti dengan broker EMQX WebSocket URL
const broker = 'wss://broker.emqx.io:8084/mqtt'; // pakai WSS + port SSL


class MqttClient {
  constructor() {
    this.client = new Client(broker, 'clientId-' + Math.random().toString(16).substr(2, 8));
    this.client.onMessageArrived = this.onMessageArrived.bind(this);
    this.client.onConnectionLost = this.onConnectionLost.bind(this);
    this.isConnected = false; // Track connection state
    this.onMessageReceived = null; // Initialize onMessageReceived
  }

  setOnMessageReceived(handler) {
    this.onMessageReceived = handler;
  }

  // Make the connect method return a Promise
  connect() {
    if (this.isConnected) {
      return Promise.resolve(); // Resolve immediately if already connected
    }

    return new Promise((resolve, reject) => {
      const options = {
        onSuccess: () => {
          this.onConnect();
          resolve(); // Resolve the Promise on successful connection
        },
        onFailure: (error) => {
          this.onFailure(error);
          reject(error); // Reject the Promise on failure
        },
        userName: '',
        password: '',
        useSSL: true, // WebSocket tidak perlu SSL di broker ini
      };
      this.client.connect(options);
    });
  }

  onConnect() {
    console.log('Connected to MQTT broker');
    this.isConnected = true;
  }

  onFailure(error) {
    console.error('Failed to connect:', error.errorMessage);
    this.isConnected = false; // Reset connection state on failure
  }

  onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.error('Connection lost:', responseObject.errorMessage);
    }
    this.isConnected = false;
  }

  onMessageArrived(message) {
    console.log('Message arrived:', message.payloadString);
    if (this.onMessageReceived) {
      this.onMessageReceived(message.destinationName, message.payloadString); // Notify the component
    }
  }

  publish(topic, message) {
    if (this.isConnected) {
      const mqttMessage = new Message(message);
      mqttMessage.destinationName = topic;
      this.client.send(mqttMessage);
    } else {
      console.error('Cannot publish, MQTT client is not connected');
    }
  }

  disconnect() {
    if (this.isConnected) {
      this.client.disconnect();
      console.log('Disconnected from MQTT broker');
      this.isConnected = false;
    } else {
      console.warn('Cannot disconnect, MQTT client is not connected');
    }
  }
}

export default new MqttClient();
