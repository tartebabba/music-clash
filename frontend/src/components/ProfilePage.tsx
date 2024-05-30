import { Image, Text, View } from 'react-native';
import { Props } from './types';
import { useUser } from './ContextProvider';

export default function ProfilePage({ route }: Props) {
  const { user, setUser } = useUser();
  console.log(route.params);
  console.log(user, 'from profile page');

  return (
    <View className="items-center p-5 pt-16">
      <Image
        className="h-40 w-40 m-8 rounded-full"
        source={require('../../../assets/default_pfp.jpeg')}
      />
      <Text className="text-4xl ">{user?.name}</Text>
      <Text>{user?.username}</Text>
      <Text>{user?.email}</Text>
    </View>
  );
}
