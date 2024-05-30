import supabase from './supabase-setup';
import { getRandomInt } from './utils/utils';

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

export async function createUser(user: UserDetails): Promise<UserDetails[] | null> {
  try {
    const { email } = user;
    const { count: userExists, error: selectError } = await supabase
      .from('users')
      .select('email', {
        count: 'exact',
        head: true,
      })
      .eq('email', email);

    if (selectError) {
      throw new Error('Error checking existing user');
    }

    if (!userExists) {
      const {error: supabaseError} = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name,
            username: user.username,
          },
        },
      })
      
      if(supabaseError) {
        throw new Error('Error inserting user with Supabase Auth');
      }


      const {password, ...userDetails} = user
      const { data, error: insertError } = await supabase
        .from('users')
        .insert(userDetails)
        .select();
        
      if (insertError) {
        throw new Error('Error inserting user');
      }

      return data;
    } else {
      throw new Error('User already exists.');
    }
  } catch (error) {
    console.error('Error in creating user:', error);
    return null;
  }
}

interface UserLogin {
  email: string;
  password: string;
}

export async function loginUser(user:UserLogin) {
  try {
    const { data, error:loginError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    })

    if (loginError){ throw new Error('login error')}
  
    return data
  } catch (error) {
    console.error('Error in logging in user:', error);
    return null;
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

export async function getUserByEmail(email:String) {
  try {
    const { data, error:getUserError } = await supabase
    .from('users')
    .select()
    .eq('email', email);

    if (getUserError){ throw new Error('error getting user')}

  return data;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function checkUsernameExists(username:String) {
  try {
    const { data, error:checkUsernameExistsError } = await supabase
    .from('users')
    .select()
    .eq('username', username);

    
    if (checkUsernameExistsError){ throw new Error('error checking for username')}
    if (data.length === 0){
      return false
    }
    else{
      return true
    }
  } catch (error) {
    console.error("Error checking for username:", error);
    return true
  }
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

export async function getArtistfromArtistSongsCatalog(id:number){
  const { data } = await supabase
    .from('artist_songs_catalog')
    .select()
    .eq('id', id);
    if(data !== null){
      return data[0]
    }
}

export async function generateRandomVanillaGames() {
  const twentyGames: any[][] = [];

  for (let i = 0; i < 20; i++) {
    const game: any[] = [];
    const usedArtists = new Set<string>();
    while (game.length < 4) {
      const randomInt = getRandomInt(1, 20);
      const randomArtist = await getArtistfromArtistSongsCatalog(randomInt);
      if (!usedArtists.has(randomArtist.artist)) {
        const {id, ...artistNoId} = randomArtist
        game.push({ id: i + 1, ...artistNoId });
        usedArtists.add(randomArtist.artist);
      }
    }
    twentyGames.push(game);
  }
  return twentyGames;
}




