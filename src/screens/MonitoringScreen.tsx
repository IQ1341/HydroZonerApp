import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import MqttClient from '../services/MqttClient';

const { width, height } = Dimensions.get('window');

const MonitoringScreen: React.FC = () => {
  const [relayStatus, setRelayStatus] = useState({
    tank1: false,
    tank2: false,
    ozone: false,
    tank3: false,
  });
  const [statusProses, setStatusProses] = useState('Menunggu Proses');
  const [otomasiSterilisasi, setOtomasiSterilisasi] = useState(false);
  const [otomasiRefill, setOtomasiRefill] = useState(false);
  const [durasiSterilisasi, setDurasiSterilisasi] = useState(10);
  const [durasiPostUV, setDurasiPostUV] = useState(10);
  const [sensorData, setSensorData] = useState({
    pH: 0,
    kekeruhan: 0,
    suhu: 0,
  });
  const [progress, setProgress] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  let progressInterval: NodeJS.Timeout | null = null;

  const startProgress = () => {
    let elapsedTime = 0;
    const totalTimeInSeconds = (durasiSterilisasi + durasiPostUV) * 60;

    if (progressInterval) clearInterval(progressInterval);

    progressInterval = setInterval(() => {
      elapsedTime += 1;
      const newProgress = Math.min(Math.round((elapsedTime / totalTimeInSeconds) * 100), 100);
      setProgress(newProgress);

      if (elapsedTime >= totalTimeInSeconds) {
        clearInterval(progressInterval!);
        setProgress(100);
      }
    }, 1000);
  };

  const stopProgress = () => {
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    stopProgress();

    setRelayStatus({
      tank1: false,
      tank2: false,
      ozone: false,
      tank3: false,
    });
    setStatusProses('Menunggu Proses');
    setOtomasiSterilisasi(false);
    setOtomasiRefill(false);
    setDurasiSterilisasi(10);
    setDurasiPostUV(10);
    setSensorData({
      pH: 0,
      kekeruhan: 0,
      suhu: 0,
    });
    setProgress(0);

    MqttClient.connect()
      .then(() => {
        setIsConnected(true);
        subscribeTopics();
      })
      .catch(error => {
        setIsConnected(false);
        console.error('MQTT Connection Error: ', error);
      });

    setRefreshing(false);
  };

  const subscribeTopics = () => {
    MqttClient.client.subscribe('status/relay');
    MqttClient.client.subscribe('status/prosesSterilisasi');
    MqttClient.client.subscribe('status/otomasiSterilisasi');
    MqttClient.client.subscribe('status/otomasiRefill');
    MqttClient.client.subscribe('status/durasiSterilisasi');
    MqttClient.client.subscribe('status/durasiPostUV');
    MqttClient.client.subscribe('sensor/pH');
    MqttClient.client.subscribe('sensor/kekeruhan');
    MqttClient.client.subscribe('sensor/suhu');
  };

  useEffect(() => {
    MqttClient.connect()
      .then(() => {
        setIsConnected(true);
        subscribeTopics();
      })
      .catch(error => {
        setIsConnected(false);
        console.error('MQTT Connection Error: ', error);
      });

    MqttClient.setOnMessageReceived((topic: string, message: string) => {
      switch (topic) {
        case 'status/relay':
          const relayState = JSON.parse(message);
          setRelayStatus({
            tank1: relayState.RELAY1,
            tank2: relayState.RELAY2 || relayState.RELAY4,
            ozone: relayState.RELAY3 || relayState.RELAY4,
            tank3: relayState.RELAY5 || relayState.RELAY6,
          });
          break;
        case 'status/prosesSterilisasi':
          if (message === 'mulai') {
            setStatusProses('Proses Sterilisasi');
            setProgress(0);
            startProgress();
          } else if (message === 'selesai') {
            setStatusProses('Air Siap Pakai');
            setProgress(100);
            stopProgress();
          } else {
            setStatusProses('Menunggu Proses');
            stopProgress();
          }
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
        case 'sensor/pH':
          setSensorData(prev => ({ ...prev, pH: parseFloat(message) }));
          break;
        case 'sensor/kekeruhan':
          setSensorData(prev => ({ ...prev, kekeruhan: parseFloat(message) }));
          break;
        case 'sensor/suhu':
          setSensorData(prev => ({ ...prev, suhu: parseFloat(message) }));
          break;
        default:
          break;
      }
    });

    return () => {
      stopProgress();
      MqttClient.disconnect();
    };
  }, []);

  return (
    <ScrollView
      style={styles.mainContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* <View style={styles.mainContainer}> */}
        <View style={styles.container}>
          {/* Alamat IP */}
          {/* <View style={styles.containerStatus}> */}
          <View
            style={[
              styles.statusContainerr,
              {backgroundColor: isConnected ? '#4CAF50' : '#F44336'},
            ]}>
            <Text style={styles.statusText}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
          {/* </View> */}
          <View style={styles.ipContainer}>
            <Text style={styles.ipText}>Alamat IP Alat</Text>
            <Text style={styles.ipAddress}>192.168.1.6</Text>
          </View>
          <Text style={styles.percentage}>{progress}%</Text>

          {/* Tombol Relay */}
          <View style={styles.buttonContainer}>
  <View
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
  </View>

  <View
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
  </View>

  <View
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
  </View>

  <View
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
  </View>
</View>


          <View style={styles.statusContainer}>
            <Text style={styles.status}>{statusProses}</Text>
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
            <Text style={styles.sensorValue}>{sensorData.pH} pH</Text>
          </View>
          <View style={styles.sensorBox}>
            <Text style={styles.sensorTitle}>Keruh Air</Text>
            <Icon
              name="droplet"
              size={24}
              color="#181B56"
              style={styles.sensorIcon}
            />
            <Text style={styles.sensorValue}>{sensorData.kekeruhan} NTU</Text>
          </View>
          <View style={styles.sensorBox}>
            <Text style={styles.sensorTitle}>Suhu Air</Text>
            <Icon
              name="temperature-high"
              size={24}
              color="#181B56"
              style={styles.sensorIcon}
            />
            <Text style={styles.sensorValue}>{sensorData.suhu} °C</Text>
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
      {/* </View> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 18,
  },
  container: {
    backgroundColor: '#F9FAFC',
    borderRadius: 20,
    padding: 18,
    width: '98%',
    marginBottom: 20,
  },
  statusContainerr: {
    paddingVertical: 8,
    borderRadius: 20,
    width: '18%',
    alignItems: 'center',
    marginBottom: 10,
  },

  // Status text styling
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  // IP address styling
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
    marginBottom: 10, // Jarak dengan nilai sensor
  },
  sensorValue: {
    fontSize: 14,
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
