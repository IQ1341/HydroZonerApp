import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MqttClient from '../services/MqttClient';

interface RelayStatus {
  tank1: boolean;
  tank2: boolean;
  ozone: boolean;
  tank3: boolean;
}

const MonitoringScreen: React.FC = () => {
  const [relayStatus, setRelayStatus] = useState<RelayStatus>({
    tank1: false,
    tank2: false,
    ozone: false,
    tank3: false,
  });

  const [otomasiSterilisasi, setOtomasiSterilisasi] = useState<boolean>(false);
  const [otomasiRefill, setOtomasiRefill] = useState<boolean>(false);

  const [durasiSterilisasi, setDurasiSterilisasi] = useState<number>(5);
  const [durasiPostUV, setDurasiPostUV] = useState<number>(5);

  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    MqttClient.connect();

    // Handle MQTT message reception
    MqttClient.setOnMessageReceived((topic: string, message: string) => {
      switch (topic) {
        case 'status/relay':
          const relayState = JSON.parse(message);
          // Update relay status based on received data
          setRelayStatus({
            tank1: relayState.RELAY1,
            tank2: relayState.RELAY2 || relayState.RELAY4,
            ozone: relayState.RELAY3 || relayState.RELAY4,
            tank3: relayState.RELAY5 || relayState.RELAY6,
          });
          break;

        case 'status/otomasiSterilisasi':
          setOtomasiSterilisasi(message === 'true');
          break;
        case 'status/otomasiRefill':
          setOtomasiRefill(message === 'true');
          break;

        case 'status/durasiSterilisasi':
          setDurasiSterilisasi(parseInt(message, 10));
          break;

        case 'status/durasiPostUV':
          setDurasiPostUV(parseInt(message, 10));
          break;

        default:
          break;
      }
    });

    // Subscribe to relevant MQTT topics
    MqttClient.client.subscribe('status/relay');
    MqttClient.client.subscribe('status/otomasiSterilisasi');
    MqttClient.client.subscribe('status/otomasiRefill');
    MqttClient.client.subscribe('status/durasiSterilisasi');
    MqttClient.client.subscribe('status/durasiPostUV');

    return () => {
      MqttClient.disconnect();
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        {/* Alamat IP */}
        <View style={styles.ipContainer}>
          <Text style={styles.ipText}>Alamat IP Alat</Text>
          <Text style={styles.ipAddress}>192.168.100.1:8080</Text>
        </View>
        <Text style={styles.percentage}>100%</Text>

        {/* Tombol Relay */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              relayStatus.tank1 ? styles.activeButton : {},
            ]}>
            <Icon
              name="glass-water-droplet"
              size={24}
              color={relayStatus.tank1 ? '#FFFFFF' : '#181B56'}
            />
            <Text
              style={[
                styles.buttonLabel,
                {color: relayStatus.tank1 ? '#FFFFFF' : '#181B56'},
              ]}>
              Tank 1
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              relayStatus.tank2 ? styles.activeButton : {},
            ]}>
            <Icon
              name="glass-water-droplet"
              size={24}
              color={relayStatus.tank2 ? '#FFFFFF' : '#181B56'}
            />
            <Text
              style={[
                styles.buttonLabel,
                {color: relayStatus.tank2 ? '#FFFFFF' : '#181B56'},
              ]}>
              Tank 2
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              relayStatus.ozone ? styles.activeButton : {},
            ]}>
            <Icon
              name="soap"
              size={24}
              color={relayStatus.ozone ? '#FFFFFF' : '#181B56'}
            />
            <Text
              style={[
                styles.buttonLabel,
                {color: relayStatus.ozone ? '#FFFFFF' : '#181B56'},
              ]}>
              Ozone
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              relayStatus.tank3 ? styles.activeButton : {},
            ]}>
            <Icon
              name="glass-water-droplet"
              size={24}
              color={relayStatus.tank3 ? '#FFFFFF' : '#181B56'}
            />
            <Text
              style={[
                styles.buttonLabel,
                {color: relayStatus.tank3 ? '#FFFFFF' : '#181B56'},
              ]}>
              Tank 3
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statusContainer}>
          <Text style={styles.status}>Air Siap Paka</Text>
        </View>
      </View>

      {/* Sensor */}
      <View style={styles.sensorContainer}>
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>pH Air</Text>
          <Icon
            name="water"
            size={24}
            color="#181B56"
            style={styles.sensorIcon}
          />
          <Text style={styles.sensorValue}>6.79</Text>
        </View>
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>Keruh Air</Text>
          <Icon
            name="droplet"
            size={24}
            color="#181B56"
            style={styles.sensorIcon}
          />
          <Text style={styles.sensorValue}>10 NTU</Text>
        </View>
        <View style={styles.sensorBox}>
          <Text style={styles.sensorTitle}>Suhu Air</Text>
          <Icon name="temperature-high" size={24} color="#181B56" />
          <Text style={styles.sensorValue}>23 °C</Text>
        </View>
      </View>

      {/* Otomasi */}
      <View style={styles.automationContainer}>
        <View style={styles.automationBox}>
          <Text style={styles.automationTitle}>Otomasi Sterilisasi</Text>
          <Text style={styles.automationValue}>
            {otomasiSterilisasi ? 'Aktif' : 'Nonaktif'}
          </Text>
        </View>
        <View style={styles.automationBox}>
          <Text style={styles.automationTitle}>Otomasi Refill</Text>
          <Text style={styles.automationValue}>
            {otomasiRefill ? 'Aktif' : 'Nonaktif'}
          </Text>
        </View>
      </View>

      {/* Durasi */}
      <View style={styles.durationContainer}>
        <View style={styles.durationBox}>
          <Text style={styles.durationTitle}>Sterilisasi UV</Text>
          <Text style={styles.durationValue}>{durasiSterilisasi} Menit</Text>
        </View>
        <View style={styles.durationBox}>
          <Text style={styles.durationTitle}>Post UV</Text>
          <Text style={styles.durationValue}>{durasiPostUV} Menit</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#F9FAFC',
    borderRadius: 12,
    padding: 20,
    width: '98%',
    marginBottom: 30,
  },
  ipContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  ipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  ipAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  percentage: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#181B56',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 0.5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#181B56',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  buttonLabel: {
    marginTop: 5, // Memberi jarak dengan ikon
    fontSize: 10,
    fontWeight: '500',
    color: '#181B56',
    textAlign: 'center',
  },

  status: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#181B56',
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  sensorContainer: {
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sensorBox: {
    backgroundColor: '#F9FAFC',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center', // Untuk meratakan isi ke tengah
    flex: 1,
    marginHorizontal: 5,
  },
  sensorTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5, // Jarak dengan icon
    textAlign: 'center',
  },
  sensorIcon: {
    marginBottom: 5, // Jarak dengan nilai sensor
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181B56',
    textAlign: 'center',
  },

  automationContainer: {
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  automationBox: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  automationTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  automationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181B56',
  },
  durationContainer: {
    borderRadius: 12,
    width: '98%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  durationBox: {
    backgroundColor: '#F9FAFC',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  durationTitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#555',
    // marginBottom: 10,
    textAlign: 'center',
  },
  durationValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#181B56',
  },
});


export default MonitoringScreen;
