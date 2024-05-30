import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

type SpotifyConnectButtonProps = {
  fontSize?: string | null;
};

export default function SpotifyConnectButton({
  fontSize,
}: SpotifyConnectButtonProps) {
  const navigation = useNavigation();
  const [isSpotifyConnected, setIsSpotifyConnected] =
    useState(false);

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
          console.log(data);

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

  function handleSpotifyPress() {
    const isConnected = token !== '';
    console.log(isConnected);

    if (isConnected) {
      disconnectSpotify();
    } else {
      promptAsync();
    }
  }

  function disconnectSpotify() {
    setToken('');
    navigation.navigate('Game', {
      artists: [],
    });
  }

  return (
    <>
      <TouchableOpacity
        onPress={handleSpotifyPress}
        className="w-full h-full justify-center items-center"
      >
        {token === '' ? (
          <Image
            className="h-full w-full "
            source={require('../../../assets/spotify-icon.png')}
            resizeMode="contain"
          />
        ) : (
          <Text className={`text-center ${fontSize}`}>
            Disconnect
          </Text>
        )}
      </TouchableOpacity>
    </>
  );
}
