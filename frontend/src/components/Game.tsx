import { useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

export default function Game() {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centered: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContainer: {
      width: 100,
      height: 100,
      margin: 5,
    },
    card: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backfaceVisibility: 'hidden',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardButton: {
      backgroundColor: 'lightblue',
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    selectedCard: {
      backgroundColor: 'lightgreen',
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    foundCard: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    button: {
      backgroundColor: 'lightgrey',
      padding: 10,
      margin: 10,
    },
    disableButton: {
      backgroundColor: 'darkgrey',
      padding: 10,
      margin: 10,
    },
  });

  const items = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
  ];
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[]>([]);
  const [guessResult, setGuessResult] = useState('');

  function handleClick(item: string) {
    if (selected.includes(item)) {
      setSelected(
        selected.filter((elem) => {
          return elem !== item;
        })
      );
    } else if (selected.length < 4) {
      setSelected([...selected, item]);
    }
  }

  const groups = [
    ['1', '4', '6', '9'],
    ['2', '3', '7', '8'],
    ['5', '10', '11', '12'],
    ['13', '14', '15', '16'],
  ];

  function handleSubmit() {
    const guess = selected.sort().join('');
    setGuessResult('incorrect');

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].sort().join('') === guess) {
        setFoundGroups([...foundGroups, ...selected]);
        setGuessResult('correct');

        console.log(foundGroups.length);

        if (foundGroups.length === 12) {
          setGuessResult('winner');
        }
      }
    }
    setSelected([]);
  }

  function handlePlayAgain() {
    setFoundGroups([]);
    setGuessResult('');
  }

  function getBackgroundColor(item: string) {
    const colours = ['red', 'blue', 'purple', 'green'];
    const index = foundGroups.indexOf(item);
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Text>Welcome to Music Clash</Text>
        <FlatList
          data={items}
          numColumns={4}
          renderItem={({ item }) => (
            <View style={styles.cardContainer}>
              <TouchableOpacity
                onPress={() => handleClick(item)}
                style={
                  foundGroups.includes(item)
                    ? [
                        styles.foundCard,
                        {
                          backgroundColor: getBackgroundColor(item),
                        },
                      ]
                    : selected.includes(item)
                      ? styles.selectedCard
                      : styles.cardButton
                }
                disabled={foundGroups.includes(item)}
              >
                <View style={styles.card}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.toString()}
        />
        <TouchableOpacity
          disabled={selected.length !== 4}
          style={selected.length !== 4 ? styles.disableButton : styles.button}
          onPress={handleSubmit}
        >
          <Text>Submit</Text>
        </TouchableOpacity>
        {guessResult !== '' ? (
          guessResult === 'correct' || guessResult === 'winner' ? (
            <Text>Correct</Text>
          ) : (
            <Text>Try again</Text>
          )
        ) : null}
        {guessResult === 'winner' ? (
          <>
            <Text>Winner</Text>{' '}
            <TouchableOpacity style={styles.button} onPress={handlePlayAgain}>
              <Text>Play again</Text>
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  );
}
