import { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { GameScreenProps, GameState } from './types';
import { getGameDetails } from '../../../server/db';
import NavBar from './NavBar';
import GameBanner from './GameBanner';
import EndGameBanner from './EndGame';

export default function Game({ route }: GameScreenProps) {
  const { artists } = route.params;
  const [items, setItems] = useState(artists);
  const [shuffledItems, setShuffledItems] = useState<
    string[]
  >([]);
  const [groups, setGroups] = useState<string[][]>([]);
  const [gameType, setGameType] =
    useState<string>('Spotify');

  const [gameState, setGameState] = useState<GameState>({
    isGameOver: false,
    isSpotifyGame: true,
    triesRemaining: 4,
  });
  useEffect(() => {
    setItems(artists);
    setGameType('Spotify');
    console.log(items);
  }, [artists]);

  useEffect(() => {
    if (items.length === 0) {
      setGameType('Vanilla');
      setGameState((prevState) => ({
        ...prevState,
        isSpotifyGame: false,
      }));
      let gameID = Math.floor(Math.random() * 10) + 1;
      getGameDetails(gameID).then(
        (randomDefaultGameItems) => {
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
      setGameState((prevState) => ({
        ...prevState,
        isSpotifyGame: true,
      }));
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
      setGameState((prevState) => ({
        ...prevState,
        triesRemaining: prevState.triesRemaining - 1,
      }));
    }
  }
  function getBackgroundColor(item: string) {
    const colours = [
      '#dc2626',
      '#4ade80',
      '#6366f1',
      '#06b6d4',
    ];
    const index = foundGroups.indexOf(item);
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  const isButtonDisabled = selected.length !== 4;
  const endGameBannerProps = {
    gameState,
    foundGroups,
    setItems,
    setFoundGroups,
    setGuessResult,
    setLives,
  };

  return (
    <>
      <View className="flex bg-white h-full">
        <NavBar setGameState={setGameState} />
        <View>
          <GameBanner />
          <Text className=" text-bold text-center my-1 mb-2">
            {gameState.isSpotifyGame
              ? 'Group Four Hits From One Artist From Your Music Library'
              : 'Group Four Hits From One Artist'}
          </Text>
        </View>
        <View className="flex-2 p-2">
          <FlatList
            data={shuffledItems}
            numColumns={4}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
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
                      className={`font-bold text-center p-1 ${
                        selected.includes(item) ||
                        foundGroups.includes(item)
                          ? 'text-white'
                          : 'text-black'
                      }`}
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
        <View className="flex-1 ">
          <Text className="text-center my-2">
            Tries remaining: {lives}
          </Text>
          <View className="items-center">
            <TouchableOpacity
              disabled={isButtonDisabled}
              className={`p-2 m-2 rounded-md w-[50%] ${isButtonDisabled ? 'bg-slate-50 border-black border ' : 'bg-slate-900'}`}
              onPress={handleSubmit}
            >
              <Text
                className={`${isButtonDisabled ? 'text-slate-500' : 'text-white font-bold'} text-center`}
              >
                Submit
              </Text>
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
            <EndGameBanner {...endGameBannerProps} />
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
    borderRadius: 10,
  },
  selectedCard: {
    backgroundColor: '#5A594E',
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
  },
  foundCard: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'lightgrey',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
});
