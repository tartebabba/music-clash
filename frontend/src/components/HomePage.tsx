import { Pressable, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Props } from "./types";
import { useState } from "react";
import * as AuthSession from 'expo-auth-session';

export default function HomePage({navigation}: Props) {
    const CLIENT_ID = 'e9cd46ff618640158846ea3d309d9c7d';
    const REDIRECT_URI = AuthSession.getRedirectUrl();
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'token';
    const [token, setToken] = useState('');

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

    async function handleSpotifyPress() {
        const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`
        const result = await AuthSession.startAsync({url});

        if (result.type === 'success') {
            setToken(result.params.access_token)
        }
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
            <TouchableOpacity onPress={handleSpotifyPress}>
            <Text style={styles.button}>Play with Spotify</Text>
            </TouchableOpacity>
        </View>
    )
}
