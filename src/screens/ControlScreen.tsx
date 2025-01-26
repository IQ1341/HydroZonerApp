import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import mqttClient from '../services/MqttClient'; // Import layanan MQTT
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome6';

const ControlScreen = () => {
  const [otomasiSterilisasi, setOtomasiSterilisasi] = useState('Tidak');
  const [otomasiRefill, setOtomasiRefill] = useState('Tidak');
  const [durasiSterilisasi, setDurasiSterilisasi] = useState(10); // Durasi sterilisasi tong 2
  const [durasiPostUV, setDurasiPostUV] = useState(10); // Durasi UV di tong 3
  const [isSterilisasiRunning, setIsSterilisasiRunning] = useState(false); // Status sterilisasi
  const [isRefillRunning, setIsRefillRunning] = useState(false); // Status refill

  React.useEffect(() => {
    mqttClient.connect(); // Hubungkan ke broker MQTT
    return () => {
      mqttClient.disconnect(); // Putuskan koneksi saat komponen di-unmount
    };
  }, []);

  type ToastType = 'success' | 'error' | 'info';

  const showToast = (type: ToastType, title: string, message: string): void => {
    Toast.show({
      type,
      text1: title,
      text2: message,
    });
  };

  const toggleSterilisasi = () => {
    if (isSterilisasiRunning) {
      // Hentikan sterilisasi
      mqttClient.publish('kontrol/stopSterilisasi', 'true'); // Kirim perintah stop
      setIsSterilisasiRunning(false); // Perbarui status
      showToast(
        'success',
        'Sterilisasi Dihentikan',
        'Proses sterilisasi telah dihentikan.',
      );
    } else {
      if (otomasiSterilisasi === 'Ya') {
        // Mulai sterilisasi
        mqttClient.publish(
          'kontrol/otomasiRefill',
          otomasiRefill === 'Ya' ? 'true' : 'false',
        );
        mqttClient.publish('kontrol/otomasiSterilisasi', 'true');
        mqttClient.publish(
          'kontrol/durasiSterilisasi',
          String(durasiSterilisasi),
        );
        mqttClient.publish('kontrol/durasiPostUV', String(durasiPostUV));
        mqttClient.publish('kontrol/startSterilisasi', 'true');
        setIsSterilisasiRunning(true); // Perbarui status
        showToast(
          'success',
          'Sterilisasi Dimulai',
          'Proses sterilisasi otomatis dimulai.',
        );
      } else {
        showToast(
          'error',
          'Peringatan',
          'Harap aktifkan sterilisasi otomatis!',
        );
      }
    }
  };

  const toggleRefill = () => {
    if (isRefillRunning) {
      // Hentikan refill
      mqttClient.publish('kontrol/stopRefill', 'true'); // Kirim perintah stop
      setIsRefillRunning(false); // Perbarui status
      showToast(
        'success',
        'Refill Dihentikan',
        'Proses refill telah dihentikan.',
      );
    } else {
      if (otomasiRefill === 'Ya') {
        // Mulai refill
        mqttClient.publish('kontrol/startRefill', 'true'); // Kirim perintah start
        setIsRefillRunning(true); // Perbarui status
        showToast(
          'success',
          'Refill Dimulai',
          'Proses refill otomatis dimulai.',
        );
      } else {
        showToast('error', 'Peringatan', 'Harap aktifkan refill otomatis!');
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Text style={styles.title}>Sterilisasi & Refill</Text> */}

      {/* Otomasi Sterilisasi */}
      <View style={styles.controlContainer}>
        <Text style={styles.controlLabel}>Otomasi Sterilisasi</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              otomasiSterilisasi === 'Ya' && styles.activeButton,
            ]}
            onPress={() => setOtomasiSterilisasi('Ya')}>
            <Text
              style={[
                styles.buttonText,
                otomasiSterilisasi === 'Ya' && styles.activeButtonText,
              ]}>
              Ya
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              otomasiSterilisasi === 'Tidak' && styles.activeButton,
            ]}
            onPress={() => setOtomasiSterilisasi('Tidak')}>
            <Text
              style={[
                styles.buttonText,
                otomasiSterilisasi === 'Tidak' && styles.activeButtonText,
              ]}>
              Tidak
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Otomasi Refill */}
      <View style={styles.controlContainer}>
        <Text style={styles.controlLabel}>Otomasi Refill</Text>
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[
              styles.button,
              otomasiRefill === 'Ya' && styles.activeButton,
            ]}
            onPress={() => setOtomasiRefill('Ya')}>
            <Text
              style={[
                styles.buttonText,
                otomasiRefill === 'Ya' && styles.activeButtonText,
              ]}>
              Ya
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              otomasiRefill === 'Tidak' && styles.activeButton,
            ]}
            onPress={() => setOtomasiRefill('Tidak')}>
            <Text
              style={[
                styles.buttonText,
                otomasiRefill === 'Tidak' && styles.activeButtonText,
              ]}>
              Tidak
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Durasi Sterilisasi */}
      <Text style={styles.controlLabel}>Durasi Sterilisasi (Menit)</Text>
      <View style={styles.customPickerContainer}>
        <Picker
          selectedValue={durasiSterilisasi}
          style={styles.customPicker}
          onValueChange={value => setDurasiSterilisasi(value)}>
          <Picker.Item label="10 Menit" value={10} style={styles.pickerItem} />
          <Picker.Item label="20 Menit" value={20} style={styles.pickerItem} />
          <Picker.Item label="30 Menit" value={30} style={styles.pickerItem} />
        </Picker>
      </View>
      {/* Durasi Post UV */}
      <Text style={styles.controlLabel}>Durasi Post UV (Menit)</Text>
      <View style={styles.customPickerContainer}>
        <Picker
          selectedValue={durasiPostUV}
          style={styles.customPicker}
          onValueChange={value => setDurasiPostUV(value)}>
          <Picker.Item label="10 Menit" value={10} style={styles.pickerItem} />
          <Picker.Item label="20 Menit" value={20} style={styles.pickerItem} />
          <Picker.Item label="30 Menit" value={30} style={styles.pickerItem} />
        </Picker>
      </View>

      {/* Tombol Mulai/Stop Sterilisasi */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          isSterilisasiRunning ? styles.stopButton : styles.startButton,
        ]}
        onPress={toggleSterilisasi}>
        <Icon
          name={isSterilisasiRunning ? 'pause-circle' : 'play-circle'}
          size={24}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.controlButtonText}>
          {isSterilisasiRunning ? 'Stop Sterilisasi' : 'Mulai Sterilisasi'}
        </Text>
      </TouchableOpacity>

      {/* Tombol Mulai/Stop Refill */}
      <TouchableOpacity
        style={[
          styles.controlButton,
          isRefillRunning ? styles.stopButton : styles.startButton,
        ]}
        onPress={toggleRefill}>
        <Icon
          name={isRefillRunning ? 'pause-circle' : 'play-circle'}
          size={24}
          color="#FFFFFF"
          style={styles.icon}
        />
        <Text style={styles.controlButtonText}>
          {isRefillRunning ? 'Stop Refill' : 'Mulai Refill'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#181B56',
    textAlign: 'center',
  },
  controlContainer: {
    marginBottom: 20,
    marginTop:20,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#555',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#181B56',
    borderRadius: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#181B56',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181B56',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  customPickerContainer: {
    borderWidth: 1,
    borderColor: '#181B56',
    borderRadius: 20,
    padding: 6,
    marginBottom: 10,
  },
  customPicker: {
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
});

export default ControlScreen;
