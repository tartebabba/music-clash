import { Image, Text } from 'react-native';
export default function GameBanner() {
  return (
    <>
      <Image
        className="self-center my-2 h-16"
        source={require('../../../assets/music(128px).png')}
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold text-center my-2">
        Welcome to Music Clash
      </Text>
    </>
  );
}
