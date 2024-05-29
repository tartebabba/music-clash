import React, { useState } from 'react';
import {
  View,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import LoginButton from './LoginButton';
import { Props } from './types';

export default function NavBar() {
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(false);
  const [isSpotifyConnected, setIsSpotifyConnected] =
    useState(false);

  return (
    <View className="flex-row items-center">
      <Image
        className="m-2"
        source={require('../../../assets/music(64px).png')}
      />
      <View className="flex-grow" />
      <TouchableOpacity className="p-2 m-2 rounded-md w-[20%] h-8 bg-green-400 items-center">
        {isSpotifyConnected ? (
          <Image
            className="h-full w-full "
            source={require('../../../assets/spotify-icon.png')}
            resizeMode="contain"
          />
        ) : (
          <Text className="text-center">Connect</Text>
        )}
      </TouchableOpacity>
      <LoginButton />
    </View>
  );
}
