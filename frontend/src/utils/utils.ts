import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import {
  makeRedirectUri,
  useAuthRequest,
} from 'expo-auth-session';
import { useUser } from './ContextProvider';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint:
    'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function ProvideProfilePicture(){
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
  let profilePicture = ''

  useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      setToken(access_token);

    axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
    }).then(({ data }) => {
        profilePicture = data.images[1];
    })
    }
  }, [response]);

  return profilePicture;
}