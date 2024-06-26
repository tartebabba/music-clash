import {
  TouchableOpacity,
  Text,
  View,
  Image,
} from 'react-native';
import { Props } from './types';

import * as WebBrowser from 'expo-web-browser';
import SpotifyConnectButton from './SpotifyConnect';

import { useUser } from './ContextProvider';
import { useState } from 'react';
WebBrowser.maybeCompleteAuthSession();

export default function HomePage({ navigation }: Props) {
  const { user } = useUser();

  function handleGamePress() {
    navigation.navigate('Game', { artists: [] });
  }

  function handleMultilayerPress() {
    if(user){
      navigation.navigate('Multiplayer', { artists: [] });
    }
    else{
      navigation.navigate('Login');
    }
  }

  function handleLoginPress() {
    if(user){
      navigation.navigate('ProfilePage');
    }
    else {
      navigation.navigate('Login');
    } 
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="font text-6xl text-justify align-top">
        Music Clash
      </Text>
      <View className="items-center">
        <Image
          className="m-5"
          source={require('../../../assets/music(1).png')}
        />
      </View>

      <TouchableOpacity
        onPress={handleGamePress}
        className="border w-7/12 h-14 justify-center items-center rounded m-1"
      >
        <Text className="text-xl">Play game</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleMultilayerPress}
        className="border w-7/12  h-14 justify-center items-center rounded m-1"
      >
        <Text className="text-xl">Multiplayer</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLoginPress}
        className="border w-7/12  h-14 justify-center items-center rounded m-1 bg-black"
      >
        <Text className="text-white text-xl">{user ? `Profile` : `Login`}</Text>
        
      </TouchableOpacity>
      <View className="p-2 m-2 rounded-md w-7/12 h-14 border bg-green-400 items-center">
        <SpotifyConnectButton fontSize={'text-xl'} />
      </View>
    </View>
  );
}
