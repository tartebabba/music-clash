const { createClient } = require("@supabase/supabase-js")

const supabaseUrl = "https://ubmzmglsaigdsxuhgkmv.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVibXptZ2xzYWlnZHN4dWhna212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYxOTMzMTUsImV4cCI6MjAzMTc2OTMxNX0.dAxuKuUP5yTDrP5pQK-FO--SSpyKE9j1GWKd6S6elDU"

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getGames() {
  const { data } = await supabase.from('games').select();
  console.log(data);
}

export async function getGameDetails() {
  const { data } = await supabase
    .from('game_details')
    .select();
  console.log(data);
}

interface Game {
  date: string;
}
export async function postGame(postObject: Game) {
  const { data } = await supabase
    .from('games')
    .insert(postObject)
    .select();
  console.log(data![0].id);
}

interface GameDetails {
  artist: string;
  song_1: string;
  song_2: string;
  song_3: string;
  song_4: string;
}

// export async function postMultipleGameDetails(
//   postObject: GameDetails[]
// ) {
//   const data = await supabase
//     .from('game_details')
//     .insert(postObject)
//     .select();
//   console.log(data);
// }

export async function createGame(
  postObject: GameDetails[]
) {
  try {
    let currentDate = new Date().toJSON();
    const { data, error: gameError } = await supabase
      .from('games')
      .insert({ date: currentDate })
      .select();
    if (gameError) {
      console.log(gameError);
      throw new Error(
        `Error inserting game record: ${gameError.message}`
      );
    }
    const gameId = data![0].id;
    const mappedPostObject = postObject.map((row) => {
      return { game_id: gameId, ...row };
    });

    const { error: detailsError } = await supabase
      .from('game_details')
      .insert(mappedPostObject)
      .select();
    if (detailsError) {
      console.log(detailsError);
      throw new Error(
        `Error inserting game details: ${detailsError.message}`
      );
    }
  } catch (error) {
    console.error('Error in createGame:', error);
    throw error;
  }
}

interface UserDetails {
  name: string;
  username: string;
  email: string;
  password: string;
}

export async function createUser(user: UserDetails) {
  try {
    const { email } = user;
    const { count: userExists, error } = await supabase
      .from('users')
      .select(`email`, {
        count: 'exact',
        head: true,
      })
      .eq('email', `${email}`);

    if (!userExists) {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select();
    } else {
      throw new Error(`User already exists.`);
    }
  } catch (error) {
    console.error('Error in creating user:', error);
  }
}

interface UserGame {
  user_id: number;
  game_id: number;
  date?: string;
  won: boolean;
  active: boolean;
  completed_row_1: boolean;
  completed_row_2: boolean;
}

export async function insertUserGame(userGame:UserGame) {
  try {
    let currentDate = new Date().toJSON();
    userGame = {date: currentDate, ...userGame}
    const {data, error} = await supabase
    .from('user_games')
    .insert(userGame)
    .select()
    if (error) {
      console.log(error);
      throw new Error(
        `Error inserting user-game: ${error.message}`
      );
    }
  }
  catch(error){
    console.error('Error in insertUserGame:', error);
    throw error;
  }
}


// table top 100 artists top 10 (artist_songs_combinations)
// get songs by artist function
  // prevent duplicate artist/game data 