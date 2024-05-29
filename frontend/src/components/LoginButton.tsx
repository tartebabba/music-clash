import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useUser } from './ContextProvider';
import { useNavigation } from '@react-navigation/native';

export default function LoginButton() {
  const navigation = useNavigation();
  const { user } = useUser();

  function handleLoginOrProfile() {
    if (user?.username && user?.email) {
      navigation.navigate('ProfilePage');
    } else {
      navigation.navigate('Login');
    }

    return console.log('hello');
  }
  return (
    <TouchableOpacity
      className={`p-2 m-2 rounded-md w-[20%] h-8 ${user?.email ? 'bg-slate-400' : 'bg-slate-200'}`}
      onPress={handleLoginOrProfile}
    >
      <Text className={`text-center`}>
        {user ? 'Profile' : 'Login'}
      </Text>
    </TouchableOpacity>
  );
}
