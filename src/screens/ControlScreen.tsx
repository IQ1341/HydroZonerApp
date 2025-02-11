import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import mqttClient from '../services/MqttClient';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ControlScreen = () => {
  const [otomasiSterilisasi, setOtomasiSterilisasi] = useState(false);
  const [otomasiRefill, setOtomasiRefill] = useState(false);
  const [durasiSterilisasi, setDurasiSterilisasi] = useState(10);
  const [durasiPostUV, setDurasiPostUV] = useState(10);
  const [isSterilisasiRunning, setIsSterilisasiRunning] = useState(false);
  const [isRefillRunning, setIsRefillRunning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    mqttClient.connect();
    return () => {
      mqttClient.disconnect();
    };
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setIsRefreshing(true);
    // Here you can add your MQTT or state refresh logic
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000); // Simulate network request and stop refreshing after 1 second
  };

  const resetToDefault = () => {
    setOtomasiSterilisasi(false);
    setOtomasiRefill(false);
    setDurasiSterilisasi(10); // Durasi default
    setDurasiPostUV(10); // Durasi default
    setIsSterilisasiRunning(false);
    setIsRefillRunning(false);

    // Kirim pengaturan default ke MQTT
    mqttClient.publish('kontrol/otomasiSterilisasi', 'false');
    mqttClient.publish('kontrol/otomasiRefill', 'false');
    mqttClient.publish('kontrol/durasiSterilisasi', '10');
    mqttClient.publish('kontrol/durasiPostUV', '10');
    mqttClient.publish('kontrol/startSterilisasi', 'false');
    mqttClient.publish('kontrol/startRefill', 'false');
  };

  const resetRefill =()=>{
    setIsRefillRunning(false);
    setOtomasiRefill(false);
    mqttClient.publish('kontrol/startRefill', 'false');
  }

  const toggleSterilisasi = () => {
    if (isSterilisasiRunning) {
      // Menghentikan sterilisasi
      mqttClient.publish('kontrol/startSterilisasi', 'false');
      setIsSterilisasiRunning(false); // pastikan state diupdate setelah publish
      resetToDefault(); // Reset pengaturan ke default
      showToast('success', 'Sterilisasi Dihentikan', 'Proses sterilisasi telah dihentikan.');
    } else {
      if (otomasiSterilisasi) {
        mqttClient.publish('kontrol/otomasiRefill', otomasiRefill ? 'true' : 'false');
        mqttClient.publish('kontrol/otomasiSterilisasi', 'true');
        mqttClient.publish('kontrol/durasiSterilisasi', String(durasiSterilisasi));
        mqttClient.publish('kontrol/durasiPostUV', String(durasiPostUV));
        mqttClient.publish('kontrol/startSterilisasi', 'true');
        setIsSterilisasiRunning(true); // pastikan state diupdate setelah publish
        showToast('success', 'Sterilisasi Dimulai', 'Proses sterilisasi otomatis dimulai.');
      } else {
        showToast('error', 'Peringatan', 'Harap aktifkan sterilisasi otomatis!');
      }
    }
  };

  const toggleRefill = () => {
    if (isRefillRunning) {
      mqttClient.publish('kontrol/startRefill', 'false');
      setIsRefillRunning(false);
      showToast('success', 'Refill Dihentikan', 'Proses refill telah dihentikan.');
  
      // Reset to default after refill is stopped
      resetRefill();
    } else {
      if (otomasiRefill) {
        mqttClient.publish('kontrol/startRefill', 'true');
        setIsRefillRunning(true);
        showToast('success', 'Refill Dimulai', 'Proses refill otomatis dimulai.');
      } else {
        showToast('error', 'Peringatan', 'Harap aktifkan refill otomatis!');
      }
    }
  };
  
  type ToastType = 'success' | 'error' | 'info';

  const showToast = (type: ToastType, title: string, message: string): void => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  };

  return (
    <ScrollView
      style={styles.mainContainer}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <TouchableOpacity style={styles.settingItem}>
        <Icon name="viruses" size={20} color="#181B56" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Otomasi Sterilisasi</Text>
          <Text style={styles.settingValue}>{otomasiSterilisasi ? 'Aktif' : 'Nonaktif'}</Text>
        </View>
        <Switch
          value={otomasiSterilisasi}
          onValueChange={setOtomasiSterilisasi}
          trackColor={{ false: '#767577', true: '#181B56' }}
          thumbColor={otomasiSterilisasi ? '#FFFFFF' : '#f4f3f4'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Icon name="faucet-drip" size={20} color="#181B56" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Otomasi Refill</Text>
          <Text style={styles.settingValue}>{otomasiRefill ? 'Aktif' : 'Nonaktif'}</Text>
        </View>
        <Switch
          value={otomasiRefill}
          onValueChange={setOtomasiRefill}
          trackColor={{ false: '#767577', true: '#181B56' }}
          thumbColor={otomasiRefill ? '#FFFFFF' : '#f4f3f4'}
        />
      </TouchableOpacity>

      {/* Durasi Sterilisasi */}
      <View style={styles.customPickerContainer}>
        <Picker
          selectedValue={durasiSterilisasi}
          style={styles.customPicker}
          onValueChange={value => setDurasiSterilisasi(value)}>
          <Picker.Item label="10 Menit" value={10} style={styles.pickerItem} />
          <Picker.Item label="15 Menit" value={15} style={styles.pickerItem} />
          <Picker.Item label="20 Menit" value={20} style={styles.pickerItem} />
          <Picker.Item label="30 Menit" value={30} style={styles.pickerItem} />
        </Picker>
      </View>
      <View style={styles.controlContainer}>
        <Icon name="stopwatch" size={20} color="#181B56" style={styles.iconLeft} />
        <Text style={styles.controlLabel}>Durasi Sterilisasi (Menit)</Text>
      </View>

      {/* Durasi Post UV */}
      <View style={styles.customPickerContainer}>
        <Picker
          selectedValue={durasiPostUV}
          style={styles.customPicker}
          onValueChange={value => setDurasiPostUV(value)}>
          <Picker.Item label="10 Menit" value={10} style={styles.pickerItem} />
          <Picker.Item label="15 Menit" value={15} style={styles.pickerItem} />
          <Picker.Item label="20 Menit" value={20} style={styles.pickerItem} />
          <Picker.Item label="30 Menit" value={30} style={styles.pickerItem} />
        </Picker>
      </View>
      <View style={styles.controlContainer}>
        <Icon name="stopwatch" size={20} color="#181B56" style={styles.iconLeft} />
        <Text style={styles.controlLabel}>Durasi Post UV (Menit)</Text>
      </View>

      <TouchableOpacity
        style={[styles.controlButton, isSterilisasiRunning ? styles.stopButton : styles.startButton]}
        onPress={toggleSterilisasi}>
        <Icon name={isSterilisasiRunning ? 'pause-circle' : 'play-circle'} size={24} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.controlButtonText}>
          {isSterilisasiRunning ? 'Stop Sterilisasi' : 'Mulai Sterilisasi'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, isRefillRunning ? styles.stopButton : styles.startButton]}
        onPress={toggleRefill}>
        <Icon name={isRefillRunning ? 'pause-circle' : 'play-circle'} size={24} color="#FFFFFF" style={styles.icon} />
        <Text style={styles.controlButtonText}>
          {isRefillRunning ? 'Stop Refill' : 'Mulai Refill'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 50,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  controlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  customPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#181B56',
    borderRadius: 20,
    padding: 6,
    marginBottom: 10,
  },
  customPicker: {
    flex: 1,
    color: '#181B56',
  },
  pickerItem: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  controlButton: {
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  startButton: {
    backgroundColor: '#181B56',
  },
  stopButton: {
    backgroundColor: '#c52d25',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
  iconLeft: {
    marginRight: 10,
  },
  settingItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
  },
  settingValue: {
    fontSize: 14,
    fontWeight: '300',
    color: '#181B56',
  },
});

export default ControlScreen;
