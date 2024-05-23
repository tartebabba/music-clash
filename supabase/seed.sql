 -- Insert some sample data into the table
 INSERT INTO games (date) VALUES ('2024-05-20');
 INSERT INTO games (date) VALUES ('2024-05-19');
 INSERT INTO games (date) VALUES ('2024-05-18');

-- Insert some sample data into the table
insert into
  game_details (game_id, artist, song_1, song_2, song_3, song_4)
values
  (
    1,
    'Drake',
    'Family Matters',
    'In My Feelings',
    'Hotline Bling',
    'Best I Ever Had'
  ),
  (
    1,
    'Taylor Swift',
    'Love Story',
    'Shake It Off',
    'Blank Space',
    'You Belong With Me'
  ),
  (
    1,
    'Drake',
    'One Dance',
    'Started From the Bottom',
    'Take Care',
    'Nice For What'
  );

INSERT INTO users (name, username, email, password) 
VALUES ('John Doe', 'johndoe', 'john.doe@example.com', 'password123');

INSERT INTO user_games (user_id, game_id, date, won, active, completed_row_1, completed_row_2) 
VALUES (1, 2, '2024-05-20', TRUE, FALSE, TRUE, TRUE);


insert into
  artist_songs_catalog (artist, song_1, song_2, song_3, song_4)
values
  ('Taylor Swift', 'Anti-Hero', 'Blank Space', 'Love Story', 'Shake It Off'),
  ('Drake', 'God''s Plan', 'Hotline Bling', 'In My Feelings', 'One Dance'),
  ('The Weeknd', 'Blinding Lights', 'Save Your Tears', 'Starboy', 'The Hills'),
  ('Ed Sheeran', 'Bad Habits', 'Perfect', 'Shape of You', 'Thinking Out Loud'),
  ('Ariana Grande', '7 rings', 'positions', 'Side to Side', 'thank u, next'),
  ('Justin Bieber', 'Love Yourself', 'Peaches', 'Sorry', 'STAY (with The Kid LAROI)'),
  ('Eminem', 'Godzilla (feat. Juice WRLD)', 'Lose Yourself', 'The Real Slim Shady', 'Without Me'),
  ('Post Malone', 'Circles', 'Rockstar (feat. 21 Savage)', 'Sunflower (with Swae Lee)', 'Wow.'),
  ('Kanye West', 'Gold Digger', 'Heartless', 'Power', 'Stronger'),
  ('The Beatles', 'Come Together', 'Here Comes The Sun', 'Let It Be', 'Yesterday'),
  ('Michael Jackson', 'Beat It', 'Billie Jean', 'Smooth Criminal', 'Thriller'),
  ('Queen', 'Another One Bites The Dust', 'Bohemian Rhapsody', 'Don''t Stop Me Now', 'Under Pressure'),
  ('Bruno Mars', 'Just the Way You Are', 'Locked out of Heaven', 'That''s What I Like', 'When I Was Your Man'),
  ('Coldplay', 'A Sky Full of Stars', 'The Scientist', 'Viva La Vida', 'Yellow'),
  ('Dua Lipa', 'Don''t Start Now', 'Levitating (feat. DaBaby)', 'New Rules', 'One Kiss'),
  ('Kendrick Lamar', 'All The Stars (with SZA)', 'HUMBLE', 'LOVE. FEAT. ZACARI', 'Money Trees'),
  ('Maroon 5', 'Maps', 'Memories', 'Payphone', 'Sugar'),
  ('Sam Smith', 'I''m Not The Only One', 'Stay With Me', 'Too Good At Goodbyes', 'Unholy (feat. Kim Petras)'),
  ('Harry Styles', 'Adore You', 'As It Was', 'Sign of the Times', 'Watermelon Sugar'),
  ('Adele', 'Easy On Me', 'Rolling in the Deep', 'Set Fire to the Rain', 'Someone Like You');