import { Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props } from "./types";

export default function HomePage({navigation}: Props) {
    const styles = StyleSheet.create({
        title: {
          fontSize: 40,
        },
        button: {
            backgroundColor: '#000',
            color: '#fff'
        },
        container: {
              flex: 1,
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
            }
    });

    function handleGamePress() {
        navigation.navigate('Game')
    }

    function handleLoginPress() {
        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Music Clash</Text>
            <TouchableOpacity onPress={handleGamePress}>
            <Text style={styles.button}>Play game</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLoginPress}>
            <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity>
            <Text style={styles.button}>Play with Spotify</Text>
            </TouchableOpacity>
        </View>
    )
}
