import type { NativeStackScreenProps } from '@react-navigation/native-stack';
type RootStackParamList = {
  HomePage: undefined;
  Game: {artists: string[]} | undefined;
  Login: undefined;
};
export type Props = NativeStackScreenProps<RootStackParamList>;
