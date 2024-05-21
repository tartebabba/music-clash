import { useState } from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

export default function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      <Text>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username..."
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder="Password..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
    </View>
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
