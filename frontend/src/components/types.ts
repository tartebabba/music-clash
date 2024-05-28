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
  Multiplayer: {
    artists: {
      artist: string;
      song_1: string;
      song_2: string;
      song_3: string;
      song_4: string;
    }[];
  };
};
type Props = NativeStackScreenProps<RootStackParamList>;
type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;
type MultiplayerScreenProps = NativeStackScreenProps<RootStackParamList, 'Multiplayer'>;


export { RootStackParamList, Props, GameScreenProps, MultiplayerScreenProps };
