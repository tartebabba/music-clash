import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type RootStackParamList = {
  HomePage: undefined;
  Game: {
    artists: {
      artist: string;
      song_1: string;
      song_2: string;
      song_3: string;
      song_4: string;
    }[];
  };
  Login: undefined;
  TestingPage: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList>;
type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;


export { RootStackParamList, Props, GameScreenProps };
