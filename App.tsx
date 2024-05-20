import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomePage from './frontend/src/components/HomePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Game from './frontend/src/components/Game';
import Login from './frontend/src/components/LoginPage';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomePage}
          options={{title: 'Welcome'}}
        />
        <Stack.Screen
        name='Game'
        component={Game}
        />
        <Stack.Screen
        name='Login'
        component={Login}
        />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

