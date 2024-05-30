import { getGames, getGameDetails, createUser, loginUser, getUserByEmail, generateRandomVanillaGames, checkUsernameExists} from '../db';
import {describe, expect, test} from '@jest/globals';
import supabase from '../supabase-setup';



describe('getGameDetails', () => {
  test('returns an array of all games played', async () => {
    const data = await getGameDetails(1)
    const expected = [
      {
          id: 1,
          artist: "Dua Lipa",
          game_id: 1,
          song_1: "Don't Start Now",
          song_2: "Levitating (feat. DaBaby)",
          song_3: "New Rules",
          song_4: "One Kiss"
      },
      {
          id: 2,
          game_id: 1,
          artist: "Ed Sheeran",
          song_1: "Bad Habits",
          song_2: "Perfect",
          song_3: "Shape of You",
          song_4: "Thinking Out Loud"
      },
      {
          id: 3,
          game_id: 1,
          artist: "Coldplay",
          song_1: "A Sky Full of Stars",
          song_2: "The Scientist",
          song_3: "Viva La Vida",
          song_4: "Yellow"
      },
      {
          id: 4,
          game_id: 1,
          artist: "Post Malone",
          song_1: "Circles",
          song_2: "Rockstar (feat. 21 Savage)",
          song_3: "Sunflower (with Swae Lee)",
          song_4: "Wow."
      }
  ]
    expect(data).toEqual(expected)
  })
})

describe('getGames', () => {
  test('returns an array of all games played', async () => {
    const data = await getGames()
    const expected = [
      {
          "date": "2024-05-20",
          "id": 1
      },
      {
          "date": "2024-05-19",
          "id": 2
      },
      {
          "date": "2024-05-18",
          "id": 3
      },
      {
          "date": "2024-05-17",
          "id": 4
      },
      {
          "date": "2024-05-16",
          "id": 5
      },
      {
          "date": "2024-05-15",
          "id": 6
      },
      {
          "date": "2024-05-14",
          "id": 7
      },
      {
          "date": "2024-05-13",
          "id": 8
      },
      {
          "date": "2024-05-12",
          "id": 9
      },
      {
          "date": "2024-05-11",
          "id": 10
      },
      {
          "date": "2024-05-10",
          "id": 11
      },
      {
          "date": "2024-05-09",
          "id": 12
      },
      {
          "date": "2024-05-08",
          "id": 13
      },
      {
          "date": "2024-05-07",
          "id": 14
      },
      {
          "date": "2024-05-06",
          "id": 15
      },
      {
          "date": "2024-05-05",
          "id": 16
      },
      {
          "date": "2024-05-04",
          "id": 17
      },
      {
          "date": "2024-05-03",
          "id": 18
      },
      {
          "date": "2024-05-02",
          "id": 19
      },
      {
          "date": "2024-05-01",
          "id": 20
      }
  ]
    expect(data).toEqual(expected)
  })
})

describe('getGameDetails', () => {
  test('when passed a game ID, returns an array of objects containing the artists and songs in that game', async () => {
    const data = await getGameDetails(3)
    const expected = [
      {
          game_id: 3,
          id: 9,
          artist: "Kendrick Lamar",
          song_1: "All The Stars (with SZA)",
          song_2: "HUMBLE",
          song_3: "LOVE. FEAT. ZACARI",
          song_4: "Money Trees"
      },
      {
          game_id: 3,
          id: 10,
          artist: "Taylor Swift",
          song_1: "Anti-Hero",
          song_2: "Blank Space",
          song_3: "Love Story",
          song_4: "Shake It Off"
      },
      {
          game_id: 3,
          id: 11,
          artist: "Maroon 5",
          song_1: "Maps",
          song_2: "Memories",
          song_3: "Payphone",
          song_4: "Sugar"
      },
      {
          game_id: 3,
          id: 12,
          artist: "Kanye West",
          song_1: "Gold Digger",
          song_2: "Heartless",
          song_3: "Power",
          song_4: "Stronger"
      }
  ]
  expect(data).toEqual(expected)
  })
})

describe('createUser', () => {
  const user = {name: "Robbie Chapman",
    username: "robbochobbo",
    email: "robbiechapman@gmail.com",
    password: "password123"}

  test('creates a user in users table', async () => {
    const data = await createUser(user)
    const expected = [
      {
        user_id: 2,
        name: 'Robbie Chapman',
        username: 'robbochobbo',
        email: 'robbiechapman@gmail.com'
      }
    ]
    expect(data).toEqual(expected)
  })
  test('throws an error if user already exists', async () => {
    const data = await createUser(user)
    expect(data).toBe(null)
  })

  test('user is added to Supabase Auth and able to login', async () => {
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'robbiechapman@gmail.com',
      password: 'password123',
    })
    expect(data.user?.aud).toBe('authenticated')
  })
})

describe('loginUser', () => {
  const user = {email: "robbiechapman@gmail.com", password: "password123"}

  test('allows existing user to successfully log in', async () => {
    const data = await loginUser(user)
    expect(data?.user.aud).toBe('authenticated')
  })
  test('non-existing user will return null', async () => {
    const notUser = {email: "notuser@gmail.com", password: "password123"}
    const data = await loginUser(notUser)
    expect(data).toBe(null)
  })
  test('existing user but incorrect password will return null', async () => {
    const wrongPassword = {email: "robbiechapman@gmail.com", password: "password12345"}
    const data = await loginUser(wrongPassword)
    expect(data).toBe(null)
  })
})

describe('getUserByEmail', () => {
  test('when passed an email address, returns the user_id, username, email and name of user', async () => {
    const data = await getUserByEmail("robbiechapman@gmail.com")
    const expected = [
      {
        user_id: 2,
        name: 'Robbie Chapman',
        username: 'robbochobbo',
        email: 'robbiechapman@gmail.com'
      }
    ]
    expect(data).toEqual(expected)
  })
})

describe('checkUsernameExists', () => {
  test('when passed a username string, returns true if username exists and false if it does not', async () => {
    const bool = await checkUsernameExists("robbochobbo")
    expect(bool).toBe(true)
    const bool2 = await checkUsernameExists("robbochobbo123456789")
    expect(bool2).toBe(false)
  })
})

