import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';

const Header: React.FC = () => {
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

      {/* Ikon Menu */}
      <TouchableOpacity style={styles.menuButton}>
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
    backgroundColor: '#FFFFFF', // Warna background header
   
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 45, // Sesuaikan ukuran logo
    height: 45,
    resizeMode: 'contain',
    marginRight: 10, // Jarak antara logo dan teks
  },
  title: {
    fontSize: 12, // Ukuran font untuk "HydroZoner"
    fontWeight: 'bold',
    color: '#0F172A', // Warna teks
  },
  menuButton: {
    padding: 10, // Area sentuh lebih besar agar mudah diklik
  },
});

export default Header;
