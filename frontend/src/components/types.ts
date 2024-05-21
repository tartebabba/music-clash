import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type RootStackParamList = {
  HomePage: undefined;
  Game: {artists: {name: string, tracks: string[]}[]};
  Login: undefined;
};
type Props = NativeStackScreenProps<RootStackParamList>;
type GameScreenProps = NativeStackScreenProps<RootStackParamList, 'Game'>;


export { RootStackParamList, Props, GameScreenProps };
