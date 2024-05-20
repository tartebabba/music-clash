import { useState } from "react";
import { TextInput, View } from "react-native";

export default function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('')

    console.log(userName, password);

    return (
        <View>
            <TextInput placeholder="Username..." value={userName} onChangeText={setUserName}/>
            <TextInput placeholder="Password..." value={password} onChangeText={setPassword} secureTextEntry/>
        </View>
    )
}