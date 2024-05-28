import { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from 'react-native';
import { GameScreenProps } from './types';
import { getGameDetails } from '../../../server/db';

export default function Game({
  route,
  navigation,
}: GameScreenProps) {
  const { artists } = route.params;
  const [items, setItems] = useState(artists);
  const [shuffledItems, setShuffledItems] = useState<
    string[]
  >([]);
  const [groups, setGroups] = useState<string[][]>([]);

  useEffect(() => {
    if (items.length === 0) {
      let gameID = Math.floor(Math.random() * 10) + 1;
      getGameDetails(gameID).then(
        (randomDefaultGameItems) => {
          console.log(randomDefaultGameItems);

          if (
            randomDefaultGameItems?.length === 0 ||
            !randomDefaultGameItems
          ) {
            console.log('Failed to fetch game details!');
            return;
          }
          setGroups(
            randomDefaultGameItems.map((item) => [
              item.song_1,
              item.song_2,
              item.song_3,
              item.song_4,
            ])
          );

          setShuffledItems([
            ...randomDefaultGameItems
              .flatMap((item) => [
                item.song_1,
                item.song_2,
                item.song_3,
                item.song_4,
              ])
              .sort(() => 0.5 - Math.random()),
          ]);
        }
      );
    } else {
      setGroups(
        items.map((item) => [
          item.song_1,
          item.song_2,
          item.song_3,
          item.song_4,
        ])
      );

      setShuffledItems([
        ...items
          .flatMap((item) => [
            item.song_1,
            item.song_2,
            item.song_3,
            item.song_4,
          ])
          .sort(() => 0.5 - Math.random()),
      ]);
    }
  }, [items]);

  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[]>(
    []
  );
  const [guessResult, setGuessResult] = useState('');
  const [lives, setLives] = useState(4);

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

  function handleSubmit() {
    const guess = selected.sort().join('');
    setGuessResult('incorrect');
    let correct = false;

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].sort().join('') === guess) {
        setFoundGroups([...foundGroups, ...selected]);
        setGuessResult('correct');
        correct = true;

        if (foundGroups.length === 12) {
          setGuessResult('winner');
        }
      }
    }
    setSelected([]);

    if (correct === false) {
      setLives(lives - 1);
    }
  }

  function handlePlayAgain() {
    setItems([]);
    setFoundGroups([]);
    setGuessResult('');
    setLives(4);
  }

  function getBackgroundColor(item: string) {
    const colours = ['red', 'blue', 'purple', 'green'];
    const index = foundGroups.indexOf(item);
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  return (
    <>
      <View className="flex bg-white just border-2">
        <View className="flex-2 self-center  border-2">
          <Image
            className="self-center"
            source={require('../../../assets/music(64px).png')}
          />
          <Text className="text-lg text-bold">
            Welcome to Music Clash
          </Text>
        </View>
        <View className=" flex-4 ">
          <FlatList
            data={shuffledItems}
            numColumns={4}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              // flexGrow: 1,
            }}
            renderItem={({ item }) => (
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  onPress={() => handleClick(item)}
                  style={
                    foundGroups.includes(item)
                      ? [
                          styles.foundCard,
                          {
                            backgroundColor:
                              getBackgroundColor(item),
                          },
                        ]
                      : selected.includes(item)
                        ? styles.selectedCard
                        : styles.cardButton
                  }
                  disabled={
                    foundGroups.includes(item) ||
                    lives === 0
                  }
                >
                  <View className="flex-1 justify-center">
                    <Text
                      className={`font-bold text-center p-1 ${selected.includes(item) ? 'text-white' : 'text-black'}`}
                    >
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </View>
        <View className="flex-2 border-2">
          <Text>{lives} lives remaining</Text>
          <View className="">
            <TouchableOpacity
              disabled={selected.length !== 4}
              style={
                selected.length !== 4
                  ? styles.disableButton
                  : styles.button
              }
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </TouchableOpacity>
            {guessResult !== '' ? (
              guessResult === 'correct' ||
              guessResult === 'winner' ? (
                <Text>Correct</Text>
              ) : (
                <Text>Try again</Text>
              )
            ) : null}
            {guessResult === 'winner' ? (
              <>
                <Text>Winner</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePlayAgain}
                >
                  <Text>Play again</Text>
                </TouchableOpacity>
              </>
            ) : null}
            {lives === 0 ? (
              <View>
                <Text>You lose</Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePlayAgain}
                >
                  <View>
                    <Text>Play again</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
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
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContainer: {
    width: 85,
    height: 85,
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
    backgroundColor: 'rgb(239, 239, 230)',
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: '#5A594E',
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