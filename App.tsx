import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './frontend/src/components/types';
import HomePage from './frontend/src/components/HomePage';
import Game from './frontend/src/components/Game';
import Login from './frontend/src/components/LoginPage';
import ProfilePage from './frontend/src/components/ProfilePage';
import Multiplayer from './frontend/src/components/Multiplayer';
import { NativeWindStyleSheet } from 'nativewind';
import { UserProvider } from './frontend/src/components/ContextProvider';
import moment from 'moment';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const currentDate = moment(new Date()).format(
    'MMM Do YYYY'
  );
  return (
    <>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="HomePage"
              component={HomePage}
              options={{
                title: `Music Clash - ${currentDate}`,
              }}
            />
            <Stack.Screen name="Game" component={Game} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen
              name="ProfilePage"
              component={ProfilePage}
            />
            <Stack.Screen
              name="Multiplayer"
              component={Multiplayer}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </>
  );
}
