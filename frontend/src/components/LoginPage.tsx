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

  return (
    <>
      <View style={styles.container}>
        <Text>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username..."
          value={loginUserName}
          onChangeText={setLoginUserName}
        />
        <TextInput
          style={styles.input}
          placeholder="Password..."
          value={loginPassword}
          onChangeText={setLoginPassword}
          secureTextEntry
        />
        <Pressable onPress={handleLogin}>
          <Text></Text>
        </Pressable>
        <Pressable onPress={handleLogin}>
          <Text>Login</Text>
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Name..."
          value={signUpName}
          onChangeText={setSignUpName}
        />
        <TextInput
          style={styles.input}
          placeholder="Username..."
          value={signUpUserName}
          onChangeText={setSignUpUserName}
        />
        {signUpUserName.length > 20 ? (
          <Text>Too long</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Email..."
          value={signUpEmail}
          onChangeText={setSignUpEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password..."
          value={signUpPassword}
          onChangeText={setSignUpPassword}
          secureTextEntry
        />
        <Pressable onPress={handleSignUp}>
          <Text>Sign up</Text>
        </Pressable>
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
