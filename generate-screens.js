const fs = require('fs');
const path = require('path');

const screens = [
  'LandingScreen',
  'LoginScreen',
  'SignupScreen',
  'OnboardingScreen',
  'DashboardScreen',
  'GuideScreen',
  'LogScreen',
  'HistoryScreen',
  'SettingsScreen'
];

const dir = path.join(__dirname, 'kyw-mobile', 'src', 'screens');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

screens.forEach(s => {
  const file = path.join(dir, `${s}.tsx`);
  const content = `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../lib/constants';

export default function ${s}() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>${s}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.text,
    fontSize: 20,
  }
});
`;
  fs.writeFileSync(file, content);
});

console.log('Screens generated.');
