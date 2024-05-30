import { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { GameScreenProps, GameState } from './types';
import { getGameDetails } from '../../../server/db';
import NavBar from './NavBar';
import GameBanner from './GameBanner';
import EndGameBanner from './EndGame';
import GameFeedback from './GameFeedback';

export default function Game({ route }: GameScreenProps) {
  const { artists } = route.params;
  const [items, setItems] = useState(artists);
  const [shuffledItems, setShuffledItems] = useState<
    string[]
  >([]);
  const [groups, setGroups] = useState<string[][]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[]>(
    []
  );
  const [guessResult, setGuessResult] = useState<
    boolean | null
  >(null);

  const [gameState, setGameState] = useState<GameState>({
    isGameOver: false,
    isSpotifyGame: true,
    triesRemaining: 4,
  });

  const [showFeedback, setShowFeedback] = useState(false);

  const isButtonDisabled = selected.length !== 4;

  useEffect(() => {
    if (guessResult !== null) {
      setShowFeedback(true);
      const timer = setTimeout(() => {
        setShowFeedback(false);
        setGuessResult(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [guessResult]);

  useEffect(() => {
    setItems(artists);
    setGameState((prevState) => ({
      ...prevState,
      isSpotifyGame: true,
    }));
    console.log(items);
  }, [artists]);

  useEffect(() => {
    if (!gameState.triesRemaining)
      return setGameState((prevState) => ({
        ...prevState,
        isGameOver: true,
      }));
  }, [gameState.triesRemaining]);

  useEffect(() => {
    if (items.length === 0) {
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
    let correct = false;
    console.log(guess);

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].sort().join('') === guess) {
        setFoundGroups([...foundGroups, ...selected]);
        setGuessResult(true);
        setShowFeedback(true);
        correct = true;

        if (foundGroups.length === 12) {
          setGuessResult(true);
          setGameState((prevState) => ({
            ...prevState,
            isGameOver: true,
          }));
        }
      }
    }
    setSelected([]);

    if (correct === false) {
      setGuessResult(false);
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

  const endGameBannerProps = {
    gameState,
    foundGroups,
    setShowFeedback,
    setGameState,
    setItems,
    setFoundGroups,
    setGuessResult,
  };

  return (
    <>
      <View className="flex bg-white h-full ">
        <NavBar />
        <View>
          <GameBanner />
          <Text className=" text-bold text-center my-1 mb-2">
            {gameState.isSpotifyGame
              ? 'Group Four Hits From One Artist From Your Music Library'
              : 'Group Four Hits From One Artist'}
          </Text>
        </View>
        {showFeedback && !gameState.isGameOver && (
          <View className=" justify-center items-center">
            <GameFeedback guessResult={guessResult} />
          </View>
        )}
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
                    gameState.triesRemaining === 0
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
        <View className="flex-1 items-center">
          {gameState.isGameOver ? (
            <EndGameBanner {...endGameBannerProps} />
          ) : (
            <>
              <Text className="text-center my-2">
                Tries remaining: {gameState.triesRemaining}
              </Text>
              <View className="items-center">
                <TouchableOpacity
                  disabled={isButtonDisabled}
                  className={`p-2 m-2 rounded-md w-[50%] ${
                    isButtonDisabled
                      ? 'bg-slate-50 border-black border'
                      : 'bg-slate-900'
                  }`}
                  onPress={handleSubmit}
                >
                  <Text
                    className={`${
                      isButtonDisabled
                        ? 'text-slate-500'
                        : 'text-white font-bold'
                    } text-center`}
                  >
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: 85,
    height: 85,
    margin: 5,
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
});
