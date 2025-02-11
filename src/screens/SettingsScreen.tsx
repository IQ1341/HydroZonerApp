import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6'; // Using FontAwesome icons

const SettingsScreen: React.FC = () => {
  const [isAutomationEnabled, setIsAutomationEnabled] = useState<boolean>(false);
  const [threshold, setThreshold] = useState<number>(50); // Default threshold value

  const handleToggleSwitch = () => {
    setIsAutomationEnabled(!isAutomationEnabled);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* List Item 1 - Threshold */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <Icon name="wind" size={20} color="#181B56" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Threshold Sensor</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>

      {/* You can replicate the previous setting items here */}
      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <Icon name="gear" size={20} color="#181B56" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>Kalibrasi Sensor</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <View style={styles.iconContainer}>
          <Icon name="gears" size={20} color="#181B56" />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingLabel}>LogOut</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#181B56" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    padding: 12,
    marginBottom: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#F0F0F0', // Light background color for the icon box
    padding: 12,
    borderRadius: 12, // Rounded box
    alignItems: 'center',
    justifyContent: 'center',
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
