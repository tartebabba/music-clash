import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Props } from './types';
import { useUser } from './ContextProvider';
import { useNavigation } from '@react-navigation/native';

import ProvideProfilePicture from '../utils/utils';
import NavBar from './NavBar';

export default function ProfilePage({ route }: Props) {
  const navigation = useNavigation()
  const { user, setUser } = useUser();
  console.log(route.params);
  console.log(user, 'from profile page');
  
  function handleLoginPress() {
    setUser(null)
    navigation.navigate('HomePage');

  }

  return (
    <>
      <View><NavBar/></View>
      <View
        className='items-center p-5 pt-16'
      >
        <Image className='h-40 w-40 m-8 rounded-full' source={require('../../../assets/default_pfp.jpeg')} />
        <Text className='text-4xl '>{user?.name}</Text>
        <Text>{user?.username}</Text>
        <Text>{user?.email}</Text>
        <TouchableOpacity
          onPress={handleLoginPress}
          className="border w-7/12  h-14 justify-center items-center rounded m-1 bg-black"
        >
          <Text className="text-white text-xl">Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
