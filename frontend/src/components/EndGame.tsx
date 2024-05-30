import { Text, View, TouchableOpacity } from 'react-native';
import { GameState } from './types';

export default function EndGameBanner(props) {
  const {
    gameState,
    foundGroups,
    setShowFeedback,
    setGameState,
    setItems,
    setFoundGroups,
    setGuessResult,
  } = props;

  function handlePlayAgain() {
    setItems([]);
    setFoundGroups([]);
    setGuessResult(null);
    setGameState((prevState: GameState) => ({
      ...prevState,
      isGameOver: false,
      triesRemaining: 4,
    }));
    setShowFeedback(false);
  }
  const feedbackText =
    gameState.isGameOver && foundGroups.length / 4 === 4
      ? 'Winner!'
      : 'Next Time!';
  return (
    <View className="p-2 m-2 rounded-md w-[75%] border items-center bg-slate-100">
      {gameState.isGameOver && (
        <>
          <Text className="text-xl"> {feedbackText} </Text>
        </>
      )}

      <>
        <Text className="text-justify m-1 p-1">
          {`You got ${foundGroups.length / 4}/4 correct, in 4 tries.`}
        </Text>
        <View className="flex-row">
          <TouchableOpacity className=" w-[40%] bg-slate-700 m-2 p-1 rounded-md ">
            <Text className="text-white text-lg text-center">
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`${gameState.isSpotifyGame ? ' bg-green-400 border' : 'bg-slate-900'} w-[40%] m-2 p-1 rounded-md `}
            onPress={handlePlayAgain}
          >
            <Text
              className={`text-lg text-center text-white`}
            >
              Play Again
            </Text>
          </TouchableOpacity>
        </View>
      </>
    </View>
  );
}
