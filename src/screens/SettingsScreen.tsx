import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'; // Menggunakan ikon dari FontAwesome

const SettingsScreen: React.FC = () => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(50); // Default threshold value

  const handleToggleSwitch = () => {
    setIsAutomationEnabled(!isAutomationEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Pengaturan</Text>

      {/* List Item 1 - Threshold */}
      <TouchableOpacity style={styles.settingItem}>
        <Icon name="tint" size={20} color="#181B56" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Threshold Sensor</Text>
          <Text style={styles.settingValue}>{threshold}</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>

      {/* List Item 2 - Automation */}
      <TouchableOpacity style={styles.settingItem}>
        <Icon name="cogs" size={20} color="#181B56" />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Otomasi Sterilisasi</Text>
          <Text style={styles.settingValue}>{isAutomationEnabled ? 'Aktif' : 'Nonaktif'}</Text>
        </View>
        <Switch
          value={isAutomationEnabled}
          onValueChange={handleToggleSwitch}
          trackColor={{ false: '#767577', true: '#181B56' }}
          thumbColor={isAutomationEnabled ? '#FFFFFF' : '#f4f3f4'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFC',
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
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  saveButton: {
    backgroundColor: '#181B56',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
