import {getGames, getGameDetails} from "./db-test"
import {describe, expect, test} from '@jest/globals';

describe('getGames', () => {


  test('returns an array of all games played', async () => {
    const data = await getGames()
    console.log(data);
    
    const expected = [{
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
        }]
    expect(data).toEqual(expected)
  })
})