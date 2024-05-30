import { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { createUser, loginUser, getUserByEmail, checkUsernameExists} from '../../../server/db';
import LoadingPage from './LoadingPage';
import { Props, User } from './types';
import { useUser } from './ContextProvider';
import { useNavigation } from '@react-navigation/native';

const TextInputStyle =
  'border border-slate-600 rounded-md m-1 p-2';
const TextLabelStyle = 'm-1 text-left';

export default function Login() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [signUpName, setSignUpName] = useState('');
  const [signUpUserName, setSignUpUserName] = useState('');
  const [usernameExists, setUsernameExists] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();
  const navigation = useNavigation();

  const handleLogin = async () => {
    const userLogin = {email: loginEmail, password: loginPassword}
    const response  = await loginUser(userLogin)
    if(response) {
      const data = await getUserByEmail(loginEmail)
  
      if (data && data.length > 0) {
        const { name, username } = data[0];
        setUser({name: name,
        username: username,
        email: loginEmail})
        navigation.navigate("ProfilePage");
      }
    }
    else {
      console.error("Login failed");
    }
  };
  
  
  const handleSignUp = () => {
    const user = {
      name: signUpName,
      username: signUpUserName,
      email: signUpEmail,
      password: signUpPassword,
    };

    createUser(user)
      .then((dataArray: User[] | null) => {
        if (dataArray && dataArray.length > 0) {
          const [data] = dataArray;
          if (data) {
            setUser(data);
            navigation.navigate('ProfilePage', {
              user: data,
            });
          }
        }
      })
      .catch((err) => setIsSigningUp(true));
  };

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <LoadingPage></LoadingPage>
      </View>
    );
  return (
    <>
      <View className="justify-center items-center h-full border">
        <Text className="m-1 text-center text-xl font-bold my-2">
          {isSigningUp ? 'Sign up' : 'Login'}
        </Text>
        {isSigningUp ? (
          <View className="w-9/12">
            <View>
              <Text className={TextLabelStyle}>Name</Text>
              <TextInput
                className={TextInputStyle}
                placeholder="Name"
                value={signUpName}
                onChangeText={setSignUpName}
              />
              <Text className={TextLabelStyle}>
                Username
              </Text>
              <TextInput
                autoCapitalize="none"
                className={TextInputStyle}
                placeholder="Username"
                value={signUpUserName}
                onChangeText={setSignUpUserName}
                onBlur={async (e) => {
                  const exists = await checkUsernameExists(e.nativeEvent.text) 
                  setUsernameExists(exists)
                }}
              />
              {usernameExists && <Text className='m-1'>Username already exists!</Text>}
              {signUpUserName.length > 20 && (
                <Text>Too long</Text>
              )}
              <Text className={TextLabelStyle}>Email</Text>
              <TextInput
                autoCapitalize="none"
                className={TextInputStyle}
                placeholder="Email"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
              />
              <Text className={TextLabelStyle}>
                Password
              </Text>
              <TextInput
                autoCapitalize="none"
                className={TextInputStyle}
                placeholder="Password"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry
              />
              <Pressable
                disabled={usernameExists}
                onPress={handleSignUp}
                className={`rounded-md my-4 mx-1 p-2 ${usernameExists ? 'bg-gray-500' : 'bg-black'}`}
              >
                <Text className="text-white text-center">
                  Sign up
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            <View className="w-9/12">
              <Text className={TextLabelStyle}>
                Email
              </Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Email"
                value={loginEmail}
                onChangeText={setLoginEmail}
                className={TextInputStyle}
              />
              <Text className={TextLabelStyle}>
                Password
              </Text>
              <TextInput
                autoCapitalize="none"
                placeholder="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                className={TextInputStyle}
              />
              <Pressable
                onPress={handleLogin}
                className="rounded-md bg-black my-4 mx-1 p-2"
              >
                <Text className="text-white text-center">
                  Login
                </Text>
              </Pressable>
            </View>
          </>
        )}
        <View className="justify-center items-center w-9/12">
          <View className="flex-row items-center my-2">
            <View className="flex-1 h-0.5 bg-gray-300"></View>
            <Text className="px-2 text-gray-400">OR</Text>
            <View className="flex-1 h-0.5 bg-gray-300"></View>
          </View>
          <Pressable
            onPress={() =>
              setIsSigningUp((prevState) => !prevState)
            }
            className="bg-black rounded-md my-4 mx-1 p-2 w-full"
          >
            <Text className="text-slate-50 text-center">
              {isSigningUp ? 'Login' : 'Sign up'}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

