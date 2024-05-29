import { getGames, getGameDetails, createUser, loginUser, getUserByEmail} from '../db';
import {describe, expect, test} from '@jest/globals';
import supabase from '../supabase-setup';

describe('getGameDetails', () => {
  test('returns an array of all games played', async () => {
    const data = await getGameDetails(1)
    const expected = [
      {
        id: 1,
        game_id: 1,
        artist: 'Taylor Swift',
        song_1: 'Anti-Hero',
        song_2: 'Blank Space',
        song_3: 'Love Story',
        song_4: 'Shake It Off'
      },
      {
        id: 2,
        game_id: 1,
        artist: 'Drake',
        song_1: "God's Plan",
        song_2: 'Hotline Bling',
        song_3: 'In My Feelings',
        song_4: 'One Dance'
      },
      {
        id: 3,
        game_id: 1,
        artist: 'The Weeknd',
        song_1: 'Blinding Lights',
        song_2: 'Save Your Tears',
        song_3: 'Starboy',
        song_4: 'The Hills'
      },
      {
        id: 4,
        game_id: 1,
        artist: 'Ed Sheeran',
        song_1: 'Bad Habits',
        song_2: 'Perfect',
        song_3: 'Shape of You',
        song_4: 'Thinking Out Loud'
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
    const expected = [{
      "game_id": 3,
      "id": 9,
      "artist": "Kanye West",
      "song_1": "Gold Digger",
      "song_2": "Heartless",
      "song_3": "Power",
      "song_4": "Stronger"
  },
  {
      "game_id": 3,
      "id": 10,
      "artist": "The Beatles",
      "song_1": "Come Together",
      "song_2": "Here Comes The Sun",
      "song_3": "Let It Be",
      "song_4": "Yesterday"
  },
  {
      "game_id": 3,
      "id": 11,
      "artist": "Michael Jackson",
      "song_1": "Beat It",
      "song_2": "Billie Jean",
      "song_3": "Smooth Criminal",
      "song_4": "Thriller"
  },
  {
      "game_id": 3,
      "id": 12,
      "artist": "Queen",
      "song_1": "Another One Bites The Dust",
      "song_2": "Bohemian Rhapsody",
      "song_3": "Don't Stop Me Now",
      "song_4": "Under Pressure"
  }]
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
