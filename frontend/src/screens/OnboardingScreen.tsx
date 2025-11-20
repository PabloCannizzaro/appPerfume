// Optional onboarding entry point for first-time users (not wired yet).
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OnboardingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bienvenido a appPerfume</Text>
      <Text style={styles.copy}>Pantalla de onboarding preparada para futuros flujos.</Text>
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

export default OnboardingScreen;
