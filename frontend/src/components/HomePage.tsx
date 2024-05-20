import { useState, useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Props } from './types';
import axios from 'axios';

import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function HomePage({ navigation }: Props) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'e9cd46ff618640158846ea3d309d9c7d',
      scopes: ['user-read-email', 'user-read-private', 'user-top-read'],
      usePKCE: false,
      redirectUri: makeRedirectUri(),
      responseType: 'token',
    },
    discovery
  );

  const [token, setToken] = useState('');

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);
      navigation.navigate('Game');
      axios
        .get('https://api.spotify.com/v1/me/top/', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          console.log(data);
        });
    }
  }, [response]);

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
    },
    button: {
      backgroundColor: '#000',
      color: '#fff',
      padding: 10,
      margin: 10,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  function handleGamePress() {
    navigation.navigate('Game');
  }

  function handleLoginPress() {
    navigation.navigate('Login');
  }

  function handleSpotifyPress() {
    promptAsync();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Clash</Text>
      <TouchableOpacity style={styles.button} onPress={handleGamePress}>
        <Text style={{ color: '#fff' }}>Play game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
        <Text style={{ color: '#fff' }}>Login</Text>
      </TouchableOpacity>
      {token === '' ? (
        <TouchableOpacity style={styles.button} onPress={handleSpotifyPress}>
          <Text style={{ color: '#fff' }}>Play with Spotify</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
