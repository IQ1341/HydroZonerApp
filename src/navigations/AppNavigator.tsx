import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Header from '../components/Header'; // Import Custom Header
import MonitoringScreen from '../screens/MonitoringScreen';
import KontrolScreen from '../screens/ControlScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Monitoring"
        screenOptions={{
          header: () => <Header />, // Menggunakan custom header di semua screen
          tabBarStyle: {
            height: 65, // Tinggi navbar
            paddingBottom: 10, // Padding bawah navbar agar ikon tidak terlalu ke bawah
            paddingTop: 8, // Padding atas navbar untuk jarak ikon
            backgroundColor: '#FFFFFF', // Warna navbar
            // borderTopWidth: 1, // Garis atas navbar
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            borderTopColor: '#E5E7EB', // Warna garis atas navbar
          },
          tabBarActiveTintColor: '#181B56', // Warna ikon aktif
          // tabBarInactiveTintColor: '#94A3B8', // Warna ikon tidak aktif
        }}
      >
        <Tab.Screen
          name="Sterilisasi"
          component={KontrolScreen}
          options={{
            tabBarLabel: 'Sterilisasi',
            tabBarIcon: ({ color, size }) => (
              <Icon name="tachograph-digital" size={size} color={color} />
            ),
          }}
        />
          <Tab.Screen
            name="Monitoring"
            component={MonitoringScreen}
            options={{
              tabBarLabel: 'Monitoring',
              tabBarIcon: ({ color, size }) => (
                <Icon name="gauge" size={size} color={color} />
              ),
            }}
          />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Icon name="sliders" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
