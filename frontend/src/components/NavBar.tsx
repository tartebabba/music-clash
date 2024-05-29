import React, { useState } from 'react';
import { View, Pressable, Image } from 'react-native';

import LoginButton from './LoginButton';
import SpotifyConnectButton from './SpotifyConnect';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
  const navigation = useNavigation();

  function handleLogoPress() {
    navigation.navigate('HomePage');
  }

  return (
    <View className="flex-row items-center">
      <Pressable onPress={handleLogoPress}>
        <Image
          className="m-2"
          source={require('../../../assets/music(64px).png')}
        />
      </Pressable>
      <View className="flex-grow" />
      <View className="p-2 m-2 rounded-md w-[25%] h-8 bg-green-400 items-center border">
        <SpotifyConnectButton />
      </View>

      <LoginButton />
    </View>
  );
}
