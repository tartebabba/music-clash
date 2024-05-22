import { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import { Props } from './types';
import axios from 'axios';

import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint:
    'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function HomePage({ navigation }: Props) {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'e9cd46ff618640158846ea3d309d9c7d',
      scopes: [
        'user-read-email',
        'user-read-private',
        'user-top-read',
      ],
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
      axios
        .get('https://api.spotify.com/v1/me/top/artists', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          const gameTracks: {
            artist: string;
            song_1: string;
            song_2: string;
            song_3: string;
            song_4: string;
          }[] = [];

          for (let i = 0; i < 4; i++) {
            axios
              .get(
                `https://api.spotify.com/v1/artists/${data.items[i].id}/top-tracks`,
                {
                  headers: {
                    Authorization: `Bearer ${access_token}`,
                  },
                }
              )
              .then(({ data }) => {
                const artistTracks = [];

                for (let j = 0; j < 4; j++) {
                  artistTracks.push(data.tracks[j].name);
                }

                const artistName =
                  data.tracks[0].artists[0].name;

                const artistObj = {
                  artist: artistName,
                  song_1: artistTracks[0],
                  song_2: artistTracks[1],
                  song_3: artistTracks[2],
                  song_4: artistTracks[3],
                };

                gameTracks.push(artistObj);

                if (gameTracks.length === 4) {
                  navigation.navigate('Game', {
                    artists: gameTracks,
                  });
                }
              });
          }
        });
    }
  }, [response]);

  const styles = StyleSheet.create({
    title: {
      fontSize: 40,
    },
    button: {
      backgroundColor: 'lightgrey',
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
    navigation.navigate('Game', { artists: [] });
  }

  function handleLoginPress() {
    navigation.navigate('Login');
  }

  function handleSpotifyPress() {
    promptAsync();
  }

  function handleTestPress() {
    navigation.navigate('TestingPage');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Music Clash</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handleGamePress}
      >
        <Text style={{ color: '#000' }}>Play game</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handleLoginPress}
      >
        <Text style={{ color: '#000' }}>Login</Text>
      </TouchableOpacity>
      {token === '' ? (
        <TouchableOpacity
          style={styles.button}
          onPress={handleSpotifyPress}
        >
          <Text style={{ color: '#000' }}>
            Play with Spotify
          </Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity onPress={handleTestPress}>
        <Text>TestingPage</Text>
      </TouchableOpacity>
    </View>
  );
}
