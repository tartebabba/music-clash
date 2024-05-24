import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";

import { Picker } from "@react-native-picker/picker";

import io, { Socket } from "socket.io-client";
import { MultiplayerScreenProps } from "./types";
import { getGameDetails } from "../../../server/db";

const socket: Socket = io("http://localhost:4001");

export default function Multiplayer({
    route,
    navigation,
  }: MultiplayerScreenProps) {
    const { artists } = route.params;
    const [items, setItems] = useState(artists)
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
      backgroundColor: "lightblue",
      width: "100%",
      height: "100%",
      position: "relative",
    },
    waitingCard: {
      backgroundColor: "darkgrey",
      width: "100%",
      height: "100%",
      position: "relative",
    },
    selectedCard: {
      backgroundColor: "lightgreen",
      width: "100%",
      height: "100%",
      position: "relative",
    },
    foundCard: {
      width: "100%",
      height: "100%",
      position: "relative",
    },
    button: {
      backgroundColor: "lightgrey",
      padding: 10,
      margin: 10,
    },
    disableButton: {
      backgroundColor: "darkgrey",
      padding: 10,
      margin: 10,
    },
    input: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      margin: 10,
      borderColor: "black",
      borderWidth: 2,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    boardContainer: {
      flex: 1,
      alignItems: "center",
      margin: 40,
    },
  });

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
  const [foundGroups, setFoundGroups] = useState<string[]>([]);
  const [guessResult, setGuessResult] = useState<string>("");
  const [lives, setLives] = useState<number>(2);
  const [room, setRoom] = useState<string>("");
  const [user, setUser] = useState<string>("user1");
  const [opponentEvents, setOpponentEvents] = useState<OpponentEvents>({
    lives: 2,
    found_groups: [],
    events: [],
  });
  const [score, setScore] = useState<Score>({ player1: 0, player2: 0 });
  const [rematchRequested, setRematchRequested] = useState<boolean>(false);
  const [opponentRematchRequested, setOpponentRematchRequested] =
    useState<boolean>(false);
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string>("");
  const [isFull, setIsFull] = useState<boolean>(false);
  const [isAlreadyFull, setIsAlreadyFull] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [opponentDisconnected, setOpponentDisconnected] = useState<boolean>(false);

  useEffect(() => {
    socket.emit("getAvailableRooms");
  }, []);

  useEffect(() => {
    resetGameState();

    socket.on("availableRooms", ({ rooms }) => {
      setAvailableRooms(Object.keys(rooms));
    });

    socket.on("roomFull", () => {
      setIsAlreadyFull(true);
      setRoom("");
      setSelectedRoom("");
    });

    socket.on("roomReady", () => {
      setOpponentDisconnected(false);
      setIsFull(true);
    });

    socket.on("opponentDisconnected", () => {
      setIsFull(false);
      setOpponentDisconnected(true);
      resetGameState();
    });

    socket.on("groupFound", ({ group }) => {
      setOpponentEvents((prevEvents) => ({
        ...prevEvents,
        found_groups: [...prevEvents.found_groups, ...group],
        events: [...prevEvents.events, `Group found: ${group.join(", ")}`],
      }));
    });
    socket.on("incorrectGuess", () => {
      setOpponentEvents((prevEvents) => ({
        ...prevEvents,
        lives: prevEvents.lives - 1,
        events: [...prevEvents.events, "Life lost"],
      }));
    });

    socket.on("checkScores", (scores) => {
      console.log(scores);
      console.log(scores.player2);
      setScore({
        player1: scores.player1,
        player2: scores.player2,
      });
    });

    socket.on("rematchRequest", () => {
      setOpponentRematchRequested(true);
    });

    socket.on("confirmRematch", () => {
      resetGameState();
      setRematchRequested(false);
      setOpponentRematchRequested(false);
    });

    return () => {
      socket.off("availableRooms");
      socket.off("roomFull");
      socket.off("roomReady");
      socket.off("opponentDisconnected");
      socket.off("groupFound");
      socket.off("incorrectGuess");
      socket.off("checkScores");
      socket.off("rematchRequest");
      socket.off("confirmRematch");
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
    const guess = selected.sort().join("");
    setGuessResult("incorrect");
    let correct = false;

    for (let i = 0; i < groups.length; i++) {
      if (groups[i].sort().join("") === guess) {
        setFoundGroups([...foundGroups, ...selected]);
        setGuessResult("correct");
        correct = true;

        socket.emit("groupFound", room, user, selected);

        if (foundGroups.length === 12) {
          setGuessResult("winner");
        }
      }
    }
    setSelected([]);

    if (correct === false) {
      setLives(lives - 1);
      socket.emit("incorrectGuess", room, user, selected);
    }
  }

  function handlePlayAgain() {
    setRematchRequested(true);
    socket.emit("rematchRequest", { room });
  }

  function confirmRematch() {
    socket.emit("confirmRematch", { room });
    resetGameState();
    setRematchRequested(false);
    setOpponentRematchRequested(false);
  }

  function resetGameState() {
    setItems([])
    setFoundGroups([]);
    setGuessResult("");
    setLives(2);
    setGameOver(false);
    setShowResults(false);
    setOpponentEvents({
      lives: 2,
      found_groups: [],
      events: [],
    });
  }

  function getBackgroundColor(item: string) {
    const colours = ["red", "blue", "purple", "green"];
    const index = foundGroups.indexOf(item);
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  function getOpponentBackgroundColor(index: number) {
    const colours = ["red", "blue", "purple", "green"];
    const groupIndex = Math.floor(index / 4);
    return colours[groupIndex];
  }

  const handleCreateRoom = () => {
    const newRoomName = `${user}'s Room`;
    setRoom(newRoomName);
    socket.emit("createRoom", user, newRoomName);
  };

  const handleJoinRoom = () => {
    if (selectedRoom) {
      setRoom(selectedRoom);
      socket.emit("joinRoom", user, selectedRoom);
    }
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom", user, room);
    setRoom("");
    setSelectedRoom("");
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

    if ((lives === 0 || foundGroups.length === 16) && gameOver === false) {
      setGameOver(true);
    }
  }, [lives, foundGroups, opponentEvents, gameOver]);

  useEffect(() => {
    if (gameOver) {
      console.log("Test");
      socket.emit("gameOver", user, room, lives);
    }
  }, [gameOver]);

  useEffect(() => {
    console.log("Test1");
    if (opponentDisconnected === true) {
      alert("Opponent has disconnected");
      setTimeout(function () {
        console.log("Test2");
        setOpponentDisconnected(false);
      }, 10000);
    }
  }, [opponentDisconnected]);

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <TextInput
          style={styles.input}
          placeholder="User..."
          value={user}
          onChangeText={setUser}
        />
        {room === "" ? (
          <>
            <Pressable style={styles.button} onPress={handleCreateRoom}>
              <Text>Create New Room</Text>
            </Pressable>

            {availableRooms.length === 0 ? null : (
              <>
                <Picker
                  selectedValue={selectedRoom}
                  onValueChange={(itemValue: string) => setSelectedRoom(itemValue)}
                  style={styles.input}
                >
                  <Picker.Item label="Select a room..." value="" />
                  {availableRooms.map((room) => (
                    <Picker.Item key={room} label={room} value={room} />
                  ))}
                </Picker>
                <Pressable style={styles.button} onPress={handleJoinRoom}>
                  <Text>Join Room</Text>
                </Pressable>
                {isAlreadyFull ? <Text>This room is full</Text> : null}
              </>
            )}
          </>
        ) : (
          <>
            <Text>{`Room: ${room}`}</Text>
            <Pressable style={styles.button} onPress={handleLeaveRoom}>
              <Text>Leave Room</Text>
            </Pressable>
          </>
        )}

        <Text>Welcome to Music Clash</Text>
        {opponentDisconnected ? <Text>Opponent Disconnected</Text> : null}
        <View style={styles.row}>
          <View style={styles.boardContainer}>
            <Text>You have {lives} lives remaining</Text>
            <FlatList
              data={shuffledItems}
              numColumns={4}
              renderItem={({ item }) => (
                <View style={styles.cardContainer}>
                  <Pressable
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
                    disabled={
                      foundGroups.includes(item) ||
                      lives === 0 ||
                      opponentEvents.found_groups.length === 16 ||
                      !isFull
                    }
                  >
                    <View style={styles.card}>
                      <Text>{item}</Text>
                    </View>
                  </Pressable>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
            />
            <Pressable
              disabled={selected.length !== 4}
              style={
                selected.length !== 4 ? styles.disableButton : styles.button
              }
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </Pressable>
            {guessResult !== "" ? (
              guessResult === "correct" || guessResult === "winner" ? (
                <Text>Correct</Text>
              ) : (
                <Text>Try again</Text>
              )
            ) : null}
            {guessResult === "winner" || opponentEvents.lives === 0 ? (
              <>
                <Text>Winner</Text>{" "}
                <Pressable style={styles.button} onPress={handlePlayAgain}>
                  <Text>Play again</Text>
                </Pressable>
              </>
            ) : null}
            {lives === 0 || opponentEvents.found_groups.length === 16 ? (
              <>
                <Text>You lose</Text> <Text></Text>
                <Pressable style={styles.button} onPress={handlePlayAgain}>
                  <Text>Play again</Text>
                </Pressable>
              </>
            ) : null}
            {showResults ? (
              <Text>
                Player1 {score.player1} wins : player2: {score.player2} wins
              </Text>
            ) : null}
          </View>
          <View style={styles.boardContainer}>
            {!isFull ? (
              <Text>Waiting for opponent</Text>
            ) : (
              <Text>Opponent has {opponentEvents.lives} lives remaining</Text>
            )}
            <FlatList
              data={shuffledItems}
              numColumns={4}
              renderItem={({ item, index }) => (
                <View style={styles.cardContainer}>
                  <Pressable
                    style={
                      index <= opponentEvents.found_groups.length
                        ? [
                            styles.foundCard,
                            {
                              backgroundColor:
                                getOpponentBackgroundColor(index),
                            },
                          ]
                        : !isFull
                        ? styles.waitingCard
                        : styles.cardButton
                    }
                    disabled={true}
                  >
                    <View style={styles.card}>
                      <Text></Text>
                    </View>
                  </Pressable>
                </View>
              )}
              keyExtractor={(item) => item.toString()}
            />
          </View>
        </View>
        {rematchRequested && !opponentRematchRequested ? (
          <Text>Waiting for opponent to confirm rematch...</Text>
        ) : opponentRematchRequested && !rematchRequested ? (
          <Pressable style={styles.button} onPress={confirmRematch}>
            <Text>Confirm rematch</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
