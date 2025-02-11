import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';

// Data Dummy Notifikasi
const notifications = [
  {
    id: '1',
    type: 'promo',
    title: 'Kontrol Alat',
    message: 'Mulai steriliasi 10 menit',
    time: '1 menit lalu',
    icon: 'virus',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Sensor',
    message: 'Kekeruhan : 61',
    time: '1 menit lalu',
    icon: 'bell',
  },
  {
    id: '3',
    type: 'info',
    title: 'Sensor',
    message: 'pH : 7.35',
    time: '1 menit lalu',
    icon: 'bell',
  },
  {
    id: '4',
    type: 'info',
    title: 'Sensor',
    message: 'Suhu : 26.5',
    time: '1 menit lalu',
    icon: 'bell',
  },
];

const NotificationsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Tombol Kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#0F172A" />
      </TouchableOpacity>
      
      {/* Judul Halaman */}
      <Text style={styles.title}>Notifikasi</Text>

      {/* List Notifikasi */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Icon name={item.icon} size={24} color="#0F172A" style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.notificationTime}>{item.time}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0F172A',
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#475569',
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 5,
  },
});

export default NotificationsScreen;
