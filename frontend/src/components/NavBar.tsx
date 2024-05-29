import React, { useState } from 'react';
import { View, Pressable, Image } from 'react-native';

import LoginButton from './LoginButton';
import SpotifyConnectButton from './SpotifyConnect';
import { useNavigation } from '@react-navigation/native';

export default function NavBar() {
  const navigation = useNavigation();
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(false);

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
      <SpotifyConnectButton />
      <LoginButton />
    </View>
  );
}
