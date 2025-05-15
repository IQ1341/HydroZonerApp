import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

// Tipe data
type NotificationType = {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: string;
};

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => {
          const notif = doc.data();
          return {
            id: doc.id,
            type: notif.type,
            title: notif.title,
            message: notif.message,
            time: dayjs(notif.timestamp?.toDate()).fromNow(),
            icon: notif.icon,
          };
        });
        setNotifications(data);
      });

    return () => unsubscribe();
  }, []);

  // Fungsi hapus notifikasi
  const handleDelete = async (id: string) => {
    try {
      await firestore().collection('notifications').doc(id).delete();
    } catch (error) {
      console.error('Gagal menghapus notifikasi:', error);
    }
  };

  // Komponen swipeable render kanan
  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<string | number>,
    dragX: Animated.AnimatedInterpolation<string | number>,
    id: string,
  ) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(id)}
      >
        <Text style={styles.deleteText}>Hapus</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Tombol kembali */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={24} color="#0F172A" />
      </TouchableOpacity>

      {/* Judul */}
      <Text style={styles.title}>Notifikasi</Text>

      {/* Daftar notifikasi */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(progress, dragX) =>
              renderRightActions(progress, dragX, item.id)
            }
          >
            <View style={styles.notificationCard}>
              <Icon name={item.icon} size={24} color="#0F172A" style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
            </View>
          </Swipeable>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingHorizontal: 20,
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
  deleteButton: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default NotificationsScreen;
