import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Header from '../components/Header'; // Import Custom Header

// Import screens
import MonitoringScreen from '../screens/MonitoringScreen';
import KontrolScreen from '../screens/ControlScreen';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationScreen'; // Import halaman notifikasi

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// **Bottom Tab Navigator**
const MainTabs = () => (
  <Tab.Navigator
    initialRouteName="Monitoring"
    screenOptions={{
      header: () => <Header />, // Menggunakan custom header di semua screen
      tabBarStyle: {
        height: 65,
        paddingBottom: 10,
        paddingTop: 8,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderTopColor: '#E5E7EB',
      },
      tabBarActiveTintColor: '#181B56',
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
);

// **Stack Navigator (untuk menangani navigasi ke Notifikasi)**
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Notifikasi" component={NotificationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
