import { Text, View, FlatList, StyleSheet, TouchableOpacity } from "react-native";

export default function Game() {

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        centered: {
          alignItems: "center",
          justifyContent: "center",
        },
        cardContainer: {
          width: 100,
          height: 100,
          margin: 5,
        },
        card: {
          position: "absolute",
          width: "100%",
          height: "100%",
          backfaceVisibility: "hidden",
          justifyContent: "center",
          alignItems: "center",
        },
        cardButton: {
            backgroundColor: 'lightblue',
            width: '100%',
            height: '100%',
            position: 'relative'
        }
      });

    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

    function handleClick() {
    }

    return (
        <View style={styles.container}>
          <View style={styles.centered}>
            <Text>Welcome to Music Clash</Text>
            <FlatList
              data={items}
              numColumns={4}
              renderItem={({ item, index }) => (
                <View style={styles.cardContainer}>
                  <TouchableOpacity
                    onPress={() => handleClick()}
                    style={styles.cardButton}>
                    <View style={styles.card}>
                      <Text>{item}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
      );
}