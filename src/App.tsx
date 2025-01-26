// src/App.tsx
import React from 'react';
import AppNavigator from './navigations/AppNavigator';
import Toast from 'react-native-toast-message';

const App: React.FC = () => {
  return (
    <>
      <AppNavigator />
      <Toast />
    </>
  );
};

export default App;
