import React from 'react';
import { Text, View } from 'react-native';

export default function GameFeedback({ guessResult }) {
  return (
    <View className=" bg-slate-900 w-[20%] rounded-md justify-center items-center p-2">
      {guessResult !== null && (
        <Text className="text-center text-white font-bold">
          {guessResult ? 'Correct' : 'Try again'}
        </Text>
      )}
    </View>
  );
}
