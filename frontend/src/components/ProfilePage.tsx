import { Text, View } from 'react-native';
import { Props } from './types';
import { useUser } from './ContextProvider';

export default function ProfilePage({ route }: Props) {
  const { user, setUser } = useUser();
  console.log(route.params);
  console.log(user, 'from profile page');

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Testing Page</Text>
    </View>
  );
}
