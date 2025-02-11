import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Definisikan tipe navigasi
type RootStackParamList = {
  MainTabs: undefined;
  Notifikasi: undefined;
};
type NavigationProps = StackNavigationProp<RootStackParamList, 'MainTabs'>;

const Header: React.FC = () => {
  const navigation = useNavigation<NavigationProps>(); // Gunakan tipe navigasi

  return (
    <View style={styles.container}>
      {/* Logo & Judul Aplikasi */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/Logo.png')} style={styles.logo} />
        <View>
          <Text style={styles.title}>HYDROZONER</Text>
          <Text style={styles.title}>PKM-KC 2024</Text>
        </View>
      </View>

      {/* Ikon Lonceng untuk Navigasi ke Notifikasi */}
      <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Notifikasi')}>
        <Icon name="bell" size={24} color="#0F172A" />
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
  },
});

export default Header;
