import { useState, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Image,
} from 'react-native';
import { Props } from './types';
import axios from 'axios';

import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { createGame } from '../../../server/db';

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
                  createGame(gameTracks);

                  navigation.navigate('Game', {
                    artists: gameTracks,
                  });
                }
              });
          }
        });
    }
  }, [response]);

  // const styles = StyleSheet.create({
  //   title: {
  //     fontSize: 40,
  //   },
  //   button: {
  //     backgroundColor: 'lightgrey',
  //     padding: 10,
  //     margin: 10,
  //   },
  //   container: {
  //     flex: 1,
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //   },
  // });

  function handleGamePress() {
    navigation.navigate('Game', { artists: [] });
  }

  function handleMultilayerPress() {
    navigation.navigate('Multiplayer', { artists: [] });
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
    <View 
    className='flex-1 items-center justify-center'
    >
      <Text className='font text-6xl text-justify align-top'>Music Clash</Text>
      <View className='items-center'>
      <Image className='m-5' source={require('../../../assets/music(1).png')}/>
      </View>

      <TouchableOpacity onPress={handleGamePress}
        className='border w-7/12 h-14 justify-center items-center rounded m-1'> 
        <Text className='text-xl'>Play game</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleMultilayerPress}
      className='border w-7/12  h-14 justify-center items-center rounded m-1'>
        <Text className='text-xl'>Multiplayer</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLoginPress}
      className='border w-7/12  h-14 justify-center items-center rounded m-1 bg-black'
      >
        <Text className='text-white text-xl'>Login</Text>
      </TouchableOpacity>

      {token === '' ? (
        <TouchableOpacity onPress={handleSpotifyPress}
        className='border w-7/12 h-14 justify-center items-center rounded bg-green-400 m-1'>
          <Image className='h-1 w-1 p-4' source={require('../../../assets/spotify-icon.png')}/>
        </TouchableOpacity>
      ) : null}
      
      <TouchableOpacity onPress={handleTestPress}
      className='border w-7/12  h-14 justify-center items-center rounded m-1'>
        <Text className='text-xl'>TestingPage</Text>
      </TouchableOpacity>
    </View>
  );
}
