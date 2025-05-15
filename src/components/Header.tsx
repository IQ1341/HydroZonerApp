import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import firestore from '@react-native-firebase/firestore';

type RootStackParamList = {
  MainTabs: undefined;
  Notifikasi: undefined;
};
type NavigationProps = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('notifications')
      .onSnapshot(snapshot => {
        setNotificationCount(snapshot.size); // total notifikasi
      });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.title}>HYDROZONER</Text>
          <Text style={styles.title}>PKM-KC 2024</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Notifikasi')}
      >
        <Icon name="bell" size={24} color="#0F172A" />
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 99 ? '99+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
    marginRight: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  menuButton: {
    padding: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Header;
