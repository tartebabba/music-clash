 -- Create the table
 CREATE TABLE games (
   id SERIAL PRIMARY KEY,
   date DATE NOT NULL
 );

 create table if not exists
  game_details (
    id bigint primary key generated always as identity,
    game_id int references games (id),
    artist text not null,
    song_1 text not null,
    song_2 text not null,
    song_3 text not null,
    song_4 text not null
  );

    CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name VARCHAR,
  username VARCHAR(20) NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL
  );

   CREATE TABLE user_games (
   id SERIAL PRIMARY KEY,
   user_id INT references users(user_id),
   game_id INT references games(id),
   date DATE NOT NULL,
   won BOOLEAN,
   active BOOLEAN NOT NULL,
   completed_row_1 BOOLEAN,
   completed_row_2 BOOLEAN
 );

  create table if not exists
  artist_songs_catalog (
    id bigint primary key generated always as identity,
    artist text not null,
    song_1 text not null, 
    song_2 text not null,
    song_3 text not null,
    song_4 text not null
  );