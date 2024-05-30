import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Props } from './types';
import { useUser } from './ContextProvider';
import { useNavigation } from '@react-navigation/native';
import ProvideProfilePicture from '../utils/utils';
import NavBar from './NavBar';

export default function ProfilePage({ route }: Props) {
  const navigation = useNavigation()
  const { user, setUser } = useUser();

  function handleLoginPress() {
    setUser(null)
    navigation.navigate('HomePage');
  }

  return (
    <>
      <View><NavBar/></View>
      <View className='p-5 pt-8'>
        <View className='items-center pb-4'>
          <Image className='h-40 w-40 mt-5 rounded-full' source={require('../../../assets/default_pfp.jpeg')} />
        </View>

        <Text className='p-2 text-center text-2xl'>Profile</Text>

        <View className='mb-4 p-2 border-t-2 border-t-slate-500'>
          <Text>name</Text>
          <Text className='text-2xl '>{user?.name}</Text>
        </View>
        
        <View className='mb-4 p-2'>
          <Text>username</Text>
          <Text className='text-2xl '>{user?.username}</Text>
        </View>

        <View className='mb-10 p-2 border-b-2 border-b-slate-500'>
          <Text>email</Text>
          <Text className='text-2xl '>{user?.email}</Text>
        </View>

        <View className='items-center'>
          <TouchableOpacity onPress={handleLoginPress} className="border w-7/12  h-14 justify-center items-center rounded m-1 bg-black">
            <Text className="text-white text-xl">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
