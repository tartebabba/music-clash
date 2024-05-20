import { useState } from "react";
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
        },
        selectedCard: {
          backgroundColor: 'lightgreen',
          width: '100%',
          height: '100%',
          position: 'relative'
        }
        });
        
        const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
        const [selected, setSelected] = useState<number[]>([]);

    function handleClick(index: number) {
      if (selected.includes(index)) {
        setSelected(selected.filter((item) => {
          return item !== index;
        }))    
      } else if (selected.length < 4) {
        setSelected([...selected, index])
      }
    }

    const groups = [[1, 4, 6, 9], [2, 3, 7, 8], [5, 10, 11, 12], [13, 14, 15, 16]]

    function handleSubmit() {
      
      const guess = selected.sort().join('');
      console.log(guess);

      for (let i = 0; i < groups.length; i++) {
        if (groups[i].sort().join('') === guess) {
          console.log('winner');
        }
      }
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
                    onPress={() => handleClick(item)}
                    style={selected.includes(index + 1) ? styles.selectedCard : styles.cardButton}>
                    <View style={styles.card}>
                      <Text>{item}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
            />
            <TouchableOpacity onPress={handleSubmit}>
              <Text>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
}