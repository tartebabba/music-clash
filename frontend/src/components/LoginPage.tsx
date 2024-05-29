import { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { createUser } from '../../../server/db';
import LoadingPage from './LoadingPage';
import { Props, User } from './types';
import { useUser } from './ContextProvider';

const TextInputStyle =
  'border border-slate-600 rounded-md m-1 p-2';
const TextLabelStyle = 'm-1 text-left';

export default function Login({ navigation }: Props) {
  const [loginUserName, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const [signUpName, setSignUpName] = useState('');
  const [signUpUserName, setSignUpUserName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser } = useUser();

  const handleLogin = () => {
    console.log(loginUserName, loginPassword);
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
                className={TextInputStyle}
                placeholder="Username"
                value={signUpUserName}
                onChangeText={setSignUpUserName}
              />
              {signUpUserName.length > 20 && (
                <Text>Too long</Text>
              )}
              <Text className={TextLabelStyle}>Email</Text>
              <TextInput
                className={TextInputStyle}
                placeholder="Email"
                value={signUpEmail}
                onChangeText={setSignUpEmail}
              />
              <Text className={TextLabelStyle}>
                Password
              </Text>
              <TextInput
                className={TextInputStyle}
                placeholder="Password"
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry
              />
              <Pressable
                onPress={handleSignUp}
                className="rounded-md bg-black my-4 mx-1 p-2"
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
                Username
              </Text>
              <TextInput
                placeholder="Username"
                value={loginUserName}
                onChangeText={setLoginUserName}
                className={TextInputStyle}
              />
              <Text className={TextLabelStyle}>
                Password
              </Text>
              <TextInput
                placeholder="Password"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
                className={TextInputStyle}
              />
              <Pressable onPress={handleLogin}></Pressable>
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

