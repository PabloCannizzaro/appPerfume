// Stack + bottom tabs configuration for the app shell.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import AiScreen from '../screens/AiScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PerfumeDetailScreen from '../screens/PerfumeDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
    <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: 'Explorar' }} />
    <Tab.Screen name="AI" component={AiScreen} options={{ title: 'IA' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

const RootNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="PerfumeDetail" component={PerfumeDetailScreen} options={{ title: 'Detalle de perfume' }} />
    <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Ajustes' }} />
  </Stack.Navigator>
);

export default RootNavigator;
