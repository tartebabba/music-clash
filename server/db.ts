import supabase from './supabase-setup';

export async function getGames() {
  try {
    const { data } = await supabase.from('games').select();
    return data
  } catch (error) {
    console.error("Error fetching games:", error);
  }

}

export async function getGameDetails(gameID: Number) {
  const { data } = await supabase
    .from('game_details')
    .select()
    .eq('game_id', gameID);
  return data;
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

interface ArtistSongs {
  artist: string;
  song_1: string;
  song_2: string;
  song_3: string;
  song_4: string;
}

// export async function postMultipleArtistSongs(
//   postObject: ArtistSongs[]
// ) {
//   const data = await supabase
//     .from('game_details')
//     .insert(postObject)
//     .select();
//   console.log(data);
// }

export async function createGame(
  postObject: ArtistSongs[]
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

export async function insertUserGame(userGame: UserGame) {
  try {
    let currentDate = new Date().toJSON();
    userGame = { date: currentDate, ...userGame };
    const { data, error } = await supabase
      .from('user_games')
      .insert(userGame)
      .select();
    if (error) {
      console.log(error);
      throw new Error(
        `Error inserting user-game: ${error.message}`
      );
    }
  } catch (error) {
    console.error('Error in insertUserGame:', error);
    throw error;
  }
}

export async function insertArtistSongsCatalog(artistSongs:ArtistSongs) {
  const songsArray = [artistSongs.song_1, artistSongs.song_2, artistSongs.song_3, artistSongs.song_4]
  songsArray.sort()
  const { artist } = artistSongs;
  
  const artistSongsAlphabetically = {artist: artist, song_1: songsArray[0], song_2: songsArray[1], song_3: songsArray[2], song_4: songsArray[3]}
  try {
    const { data, error } = await supabase
      .from('artist_songs_catalog')
      .select(`id, artist`)
      .eq('artist', `${artist}`);
     
    const artistExists = data!.length ? true : false   
    if(artistExists){
      const { error } = await supabase
      .from('artist_songs_catalog')
      .update({ artist: `${artist}` })
      .eq('id', data![0].id)
    }
    else {    
      const { error } = await supabase
      .from('artist_songs_catalog')
      .insert(artistSongsAlphabetically)
      .select();
      if (error) {
        console.log(error);
        throw new Error(
          `Error inserting into artist_songs_catalog: ${error.message}`
        );
      }
    }
  } catch (error) {
      console.error('Error in insertArtistSongsCatalog:', error);
      throw error;
  }
}


// table top 100 artists top 10 (artist_songs_combinations)
// get songs by artist function
// prevent duplicate artist/game data
