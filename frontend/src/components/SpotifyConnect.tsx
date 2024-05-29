import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SpotifyConnectButton() {
  const navigation = useNavigation();
  const [isSpotifyConnected, setIsSpotifyConnected] =
    useState(false);

  return (
    <>
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
    </>
  );
}
