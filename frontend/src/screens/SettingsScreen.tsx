// Placeholder for settings/preferences screen.
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Pantalla Ajustes/Preferencias</Text>
      <Text style={styles.copy}>Aqui podras configurar preferencias de la app.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
    gap: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
  },
  copy: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default SettingsScreen;
