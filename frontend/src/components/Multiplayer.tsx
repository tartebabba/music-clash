import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import io, { Socket } from 'socket.io-client';
import { MultiplayerScreenProps } from './types';
import { getGameDetails } from '../../../server/db';

const socket: Socket = io('http://localhost:4001');

export default function Multiplayer({
  route,
  navigation,
}: MultiplayerScreenProps) {
  const { artists } = route.params;
  const [items, setItems] = useState(artists);
  const [shuffledItems, setShuffledItems] = useState<
    string[]
  >([]);
  const [groups, setGroups] = useState<string[][]>([]);

  const [gameID, setGameId] = useState<number>(0);

  useEffect(() => {
    if (items.length === 0) {
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
          setIsFull(true);
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
  }, [gameID]);

  type OpponentEvents = {
    lives: number;
    found_groups: number[];
    events: string[];
  };

  type Score = {
    player1: number;
    player2: number;
  };

  const [selected, setSelected] = useState<string[]>([]);
  const [foundGroups, setFoundGroups] = useState<string[]>(
    []
  );
  const [guessResult, setGuessResult] =
    useState<string>('');
  const [lives, setLives] = useState<number>(2);
  const [room, setRoom] = useState<string>('');
  const [user, setUser] = useState<string>('user1');
  const [opponentEvents, setOpponentEvents] =
    useState<OpponentEvents>({
      lives: 2,
      found_groups: [],
      events: [],
    });
  const [score, setScore] = useState<Score>({
    player1: 0,
    player2: 0,
  });
  const [rematchRequested, setRematchRequested] =
    useState<boolean>(false);
  const [
    opponentRematchRequested,
    setOpponentRematchRequested,
  ] = useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<
    string[]
  >([]);
  const [selectedRoom, setSelectedRoom] =
    useState<string>('');
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isAlreadyFull, setIsAlreadyFull] =
    useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showResults, setShowResults] =
    useState<boolean>(false);
  const [opponentDisconnected, setOpponentDisconnected] =
    useState<boolean>(false);

  useEffect(() => {
    socket.emit('getAvailableRooms');
  }, []);

  useEffect(() => {
    resetGameState();

    socket.on('availableRooms', ({ rooms }) => {
      setAvailableRooms(Object.keys(rooms));
    });

    socket.on('roomFull', () => {
      setIsAlreadyFull(true);
      setRoom('');
      setSelectedRoom('');
    });

    socket.on('roomReady', ({ gameID }) => {
      setGameId(gameID);
      setOpponentDisconnected(false);
    });

    socket.on('opponentDisconnected', () => {
      setIsFull(false);
      setOpponentDisconnected(true);
      resetGameState();
    });

    socket.on('groupFound', ({ group }) => {
      setOpponentEvents((prevEvents) => ({
        ...prevEvents,
        found_groups: [
          ...prevEvents.found_groups,
          ...group,
        ],
        events: [
          ...prevEvents.events,
          `Group found: ${group.join(', ')}`,
        ],
      }));
    });
    socket.on('incorrectGuess', () => {
      setOpponentEvents((prevEvents) => ({
        ...prevEvents,
        lives: prevEvents.lives - 1,
        events: [...prevEvents.events, 'Life lost'],
      }));
    });

    socket.on('checkScores', (scores) => {
      setScore({
        player1: scores.player1,
        player2: scores.player2,
      });
    });

    socket.on('rematchRequest', () => {
      setOpponentRematchRequested(true);
    });

    socket.on('confirmRematch', ({ gameID }) => {
      resetGameState();
      setGameId(gameID);
      setRematchRequested(false);
      setOpponentRematchRequested(false);
    });

    return () => {
      socket.off('availableRooms');
      socket.off('roomFull');
      socket.off('roomReady');
      socket.off('opponentDisconnected');
      socket.off('groupFound');
      socket.off('incorrectGuess');
      socket.off('checkScores');
      socket.off('rematchRequest');
      socket.off('confirmRematch');
    };
  }, [room]);

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

        socket.emit('groupFound', room, user, selected);

        if (foundGroups.length === 12) {
          setGuessResult('winner');
        }
      }
    }
    setSelected([]);

    if (correct === false) {
      setLives(lives - 1);
      socket.emit('incorrectGuess', room, user, selected);
    }
  }

  function handlePlayAgain() {
    socket.emit('rematchRequest', room);
    setRematchRequested(true);
  }

  function confirmRematch() {
    socket.emit('confirmRematch', room);
    resetGameState();
  }

  function resetGameState() {
    setItems([]);
    setShuffledItems([]);
    setFoundGroups([]);
    setGuessResult('');
    setLives(2);
    setGameOver(false);
    setShowResults(false);
    setOpponentEvents({
      lives: 2,
      found_groups: [],
      events: [],
    });
    setRematchRequested(false);
    setOpponentRematchRequested(false);
  }

  function getBackgroundColor(item: string) {
    const colours = [
      'red-600',
      'green-400',
      'indigo-500',
      'cyan-500',
    ];
    const index = foundGroups.indexOf(item);
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  function getOpponentBackgroundColor(index: number) {
    const colours = [
      'red-600',
      'green-400',
      'indigo-500',
      'cyan-500',
    ];
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  const handleCreateRoom = () => {
    const newRoomName = `${user}'s Room`;
    setRoom(newRoomName);
    socket.emit('createRoom', user, newRoomName);
  };

  const handleJoinRoom = () => {
    if (selectedRoom) {
      setRoom(selectedRoom);
      socket.emit('joinRoom', user, selectedRoom);
    }
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom', user, room);
    setRoom('');
    setSelectedRoom('');
  };

  useEffect(() => {
    if (
      (lives === 0 ||
        foundGroups.length === 16 ||
        opponentEvents.lives === 0 ||
        opponentEvents.found_groups.length === 16) &&
      gameOver === false
    ) {
      setShowResults(true);
    }

    if (
      (lives === 0 || foundGroups.length === 16) &&
      gameOver === false
    ) {
      setGameOver(true);
    }
  }, [lives, foundGroups, opponentEvents, gameOver]);

  useEffect(() => {
    if (gameOver) {
      socket.emit('gameOver', user, room, lives);
    }
  }, [gameOver]);

  useEffect(() => {
    if (opponentDisconnected === true) {
      alert('Opponent has disconnected');
      setTimeout(function () {
        setOpponentDisconnected(false);
      }, 10000);
    }
  }, [opponentDisconnected]);

  return (
    <View className="flex bg-white h-full">
      {/* <View className="w-0 h-0 bg-red-600" />
      <View className="w-0 h-0 bg-indigo-500" />
      <View className="w-0 h-0 bg-cyan-500" />
      <View className="w-0 h-0 bg-green-400" /> */}
      <View className="flex-1 items-center justify-center">
        <TextInput
          className="items-center justify-center p-2.5 m-2.5 border-2 border-black"
          placeholder="User..."
          value={user}
          onChangeText={setUser}
        />
        {room === '' ? (
          <>
            <Pressable
              className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
              onPress={handleCreateRoom}
            >
              <Text>Create New Room</Text>
            </Pressable>

            {availableRooms.length === 0 ? null : (
              <>
                <Picker
                  selectedValue={selectedRoom}
                  onValueChange={(itemValue: string) =>
                    setSelectedRoom(itemValue)
                  }
                  className="items-center justify-center p-2.5 m-2.5 border-2 border-black"
                >
                  <Picker.Item
                    label="Select a room..."
                    value=""
                  />
                  {availableRooms.map((room) => (
                    <Picker.Item
                      key={room}
                      label={room}
                      value={room}
                    />
                  ))}
                </Picker>
                <Pressable
                  className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
                  onPress={handleJoinRoom}
                >
                  <Text>Join Room</Text>
                </Pressable>
                {isAlreadyFull ? (
                  <Text>This room is full</Text>
                ) : null}
              </>
            )}
          </>
        ) : (
          <>
            <Text>{`Room: ${room}`}</Text>
            <Pressable
              className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
              onPress={handleLeaveRoom}
            >
              <Text>Leave Room</Text>
            </Pressable>
          </>
        )}

        <Text>Welcome to Music Clash</Text>
        {opponentDisconnected ? (
          <Text>Opponent Disconnected</Text>
        ) : null}
        <View className="flex-row justify-between">
          <View className="flex-2 p-2 m-4">
            <Text className="text-center my-2">
              You have {lives} lives remaining
            </Text>
            {isFull && shuffledItems.length === 16 ? (
              <View className="flex-2 p-2">
                <FlatList
                  data={shuffledItems}
                  numColumns={4}
                  renderItem={({ item }) => (
                    <View className="w-20 h-20 m-2 items-center">
                      <Pressable
                        onPress={() => handleClick(item)}
                        className={`w-full h-full relative ${
                          foundGroups.includes(item)
                            ? `bg-${getBackgroundColor(item)}`
                            : selected.includes(item)
                              ? 'bg-[#5A594E]'
                              : 'bg-[#efefe6]'
                        }`}
                        disabled={
                          foundGroups.includes(item) ||
                          lives === 0 ||
                          opponentEvents.found_groups
                            .length === 16 ||
                          !isFull
                        }
                      >
                        <View className="flex-1 justify-center">
                          <Text
                            className={`font-bold text-center p-1 ${
                              selected.includes(item)
                                ? 'text-white'
                                : 'text-black'
                            }`}
                          >
                            {item}
                          </Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                  keyExtractor={(item) => item.toString()}
                />
              </View>
            ) : (
              <View className="flex-2 p-2">
                <FlatList
                  data={[
                    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
                    13, 14, 15, 16,
                  ]}
                  numColumns={4}
                  renderItem={({ item }) => (
                    <View className="w-20 h-20 m-2 items-center">
                      <Pressable
                        className="bg-[#efefe6] w-full h-full relative"
                        disabled={true}
                      >
                        <View className="flex-1 justify-center">
                          <Text></Text>
                        </View>
                      </Pressable>
                    </View>
                  )}
                  keyExtractor={(item) => item.toString()}
                />
              </View>
            )}
            <View className="items-center">
              <Pressable
                disabled={selected.length !== 4}
                className={
                  selected.length !== 4
                    ? 'p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border'
                    : 'p-2 m-2 rounded-md w-[50%] bg-slate-900'
                }
                onPress={handleSubmit}
              >
                <Text
                  className={`${selected.length !== 4 ? 'text-slate-500' : 'text-white font-bold'} text-center`}
                >
                  Submit
                </Text>
              </Pressable>

              {guessResult === 'winner' ||
              guessResult === '' ||
              lives === 0 ||
              opponentEvents.found_groups.length ===
                16 ? null : guessResult === 'correct' ? (
                <Text>Correct</Text>
              ) : (
                <Text>Try again</Text>
              )}

              {guessResult === 'winner' ||
              opponentEvents.lives === 0 ? (
                <>
                  <Text>Winner</Text>{' '}
                  <Pressable
                    className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
                    onPress={handlePlayAgain}
                  >
                    <Text>Play again</Text>
                  </Pressable>
                </>
              ) : null}
              {lives === 0 ||
              opponentEvents.found_groups.length === 16 ? (
                <>
                  <Text>You lose</Text>
                  <Pressable
                    className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
                    onPress={handlePlayAgain}
                  >
                    <Text>Play again</Text>
                  </Pressable>
                </>
              ) : null}
              {showResults ? (
                <Text>
                  Player1 {score.player1} wins : player2:{' '}
                  {score.player2} wins
                </Text>
              ) : null}
            </View>
          </View>
          <View className="flex-2 p-2 m-4">
            {!isFull ? (
              <Text className="text-center my-2">
                Waiting for opponent
              </Text>
            ) : (
              <Text className="text-center my-2">
                Opponent has {opponentEvents.lives} lives
                remaining
              </Text>
            )}
            {isFull && shuffledItems.length === 16 ? (
              <FlatList
                data={shuffledItems}
                numColumns={4}
                renderItem={({ item, index }) => (
                  <View className="w-20 h-20 m-2 items-center">
                    <Pressable
                      className={
                        index <
                        opponentEvents.found_groups.length
                          ? [
                              'w-full h-full relative',
                              `bg-${getOpponentBackgroundColor(index)}`,
                            ].join(' ')
                          : 'bg-[#efefe6] w-full h-full relative'
                      }
                      disabled={true}
                    >
                      <View className="absolute w-full h-full backface-hidden flex items-center justify-center">
                        <Text></Text>
                      </View>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.toString()}
              />
            ) : (
              <FlatList
                data={[
                  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
                  14, 15, 16,
                ]}
                numColumns={4}
                renderItem={({ item }) => (
                  <View className="w-20 h-20 m-2 items-center">
                    <Pressable
                      className={
                        'bg-darkgrey w-full h-full relative'
                      }
                      disabled={true}
                    >
                      <View className="flex-1 justify-center">
                        <Text></Text>
                      </View>
                    </Pressable>
                  </View>
                )}
                keyExtractor={(item) => item.toString()}
              />
            )}
          </View>
        </View>
        {rematchRequested && !opponentRematchRequested ? (
          <Text>
            Waiting for opponent to confirm rematch...
          </Text>
        ) : opponentRematchRequested &&
          !rematchRequested ? (
          <Pressable
            className="p-2 m-2 rounded-md w-[50%] bg-slate-50 border-black border"
            onPress={confirmRematch}
          >
            <Text>Confirm rematch</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
