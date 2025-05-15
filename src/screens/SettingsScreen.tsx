import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const SettingsScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const [phMin, setPhMin] = useState('');
  const [phMax, setPhMax] = useState('');
  const [turbidityMin, setTurbidityMin] = useState('');
  const [turbidityMax, setTurbidityMax] = useState('');
  const [tempMin, setTempMin] = useState('');
  const [tempMax, setTempMax] = useState('');

  const saveThreshold = () => {
    const thresholdData = {
      ph: { min: phMin, max: phMax },
      turbidity: { min: turbidityMin, max: turbidityMax },
      temperature: { min: tempMin, max: tempMax },
    };
    console.log('Saved:', thresholdData);
    setModalVisible(false);
  };

  const handleCalibrationPress = () => {
    Alert.alert('Info', 'Fitur ini masih dalam pengembangan');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Threshold Sensor */}
      <TouchableOpacity style={styles.settingItem} onPress={() => setModalVisible(true)}>
        <View style={styles.iconContainer}>
          <Icon name="wind" size={20} color="#181B56" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Threshold Sensor</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>

      {/* Kalibrasi Sensor */}
      <TouchableOpacity style={styles.settingItem} onPress={handleCalibrationPress}>
        <View style={styles.iconContainer}>
          <Icon name="screwdriver-wrench" size={20} color="#181B56" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Kalibrasi Sensor</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>

      {/* Modal Threshold */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Set Threshold</Text>

              <Text style={styles.sectionTitle}>Sensor pH</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  value={phMin}
                  onChangeText={setPhMin}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  value={phMax}
                  onChangeText={setPhMax}
                  style={styles.input}
                />
              </View>

              <Text style={styles.sectionTitle}>Kekeruhan (NTU)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  value={turbidityMin}
                  onChangeText={setTurbidityMin}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  value={turbidityMax}
                  onChangeText={setTurbidityMax}
                  style={styles.input}
                />
              </View>

              <Text style={styles.sectionTitle}>Suhu Air (°C)</Text>
              <View style={styles.inputRow}>
                <TextInput
                  placeholder="Min"
                  keyboardType="numeric"
                  value={tempMin}
                  onChangeText={setTempMin}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Max"
                  keyboardType="numeric"
                  value={tempMax}
                  onChangeText={setTempMax}
                  style={styles.input}
                />
              </View>

              <View style={styles.buttonRow}>
                <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Batal</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={saveThreshold}>
                  <Text style={styles.buttonText}>Simpan</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181B56',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingItem: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#F0F0F0',
    padding: 12,
    borderRadius: 12,
  },
  settingTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181B56',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#181B56',
    marginTop: 10,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#f9f9f9',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    backgroundColor: '#aaa',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  saveButton: {
    backgroundColor: '#181B56',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default SettingsScreen;
