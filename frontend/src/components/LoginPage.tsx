import { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  Pressable,
} from 'react-native';
import { createUser } from '../../../server/db';

export default function Login() {
  const [loginUserName, setLoginUserName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signUpName, setSignUpName] = useState('');
  const [signUpUserName, setSignUpUserName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

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
    createUser(user);
  };

  const TextInputStyle =
    'border border-black m-1 p-2';
  const TextLabelStyle = 'm-1 text-left';

  return (
    <>
      <View className="justify-center items-center">
        <View className="w-9/12">
          <Text className="m-1 text-center text-base text-bold">
            Login
          </Text>
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
          <Pressable onPress={handleLogin}>
          </Pressable>
          <Pressable
            onPress={handleLogin}
            className="rounded-md bg-black my-4 mx-1 p-2 "
          >
            <Text className="text-white text-center ">
              Login
            </Text>
          </Pressable>
        </View>
      <View className="justify-center items-center">
        <View className="flex-row items-center w-9/12 my-4">
          <View className="flex-1 h-0.5 bg-gray-300"></View>
          <Text className="px-2 text-gray-400">OR</Text>
          <View className="flex-1 h-0.5 bg-gray-300"></View>
        </View>
      </View>
      </View>
      <View className="justify-center items-center">
        <View className="w-9/12">
          <Text className="m-1 text-center text-base text-bold">Sign up</Text>
          <Text className={TextLabelStyle}>
            Name
          </Text>
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
          {signUpUserName.length > 20 ? (
            <Text>Too long</Text>
          ) : null}
           <Text className={TextLabelStyle}>
            Email
          </Text>
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
          <Pressable onPress={handleSignUp} className="rounded-md bg-black my-4 mx-1 p-2 ">
            <Text className="text-white text-center ">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 10,
    borderColor: 'black',
    borderWidth: 2,
  },
});
