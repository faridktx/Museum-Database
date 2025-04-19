INSERT INTO railway.membership_types (
    membership_type,
    period,
    price,
    ticket_discount,
    exhibit_discount,
    giftshop_discount,
    benefits
)
VALUES 
(
    'individual',
    'year',
    75,
    5,
    5,
    10,
    'Free admission for one adult; Invitations to members-only events; 10% discount at museum shop; 5% off tickets and exhibits; Member newsletter subscription; Early access to special exhibitions'
),
(
    'dual',
    'year',
    120,
    7,
    7,
    10,
    'Free admission for two adults; Invitations to members-only events; 10% discount at museum shop; 7% off tickets and exhibits; Member newsletter subscription; Early access to special exhibitions; Free entry to members lounge'
),
(
    'family',
    'year',
    160,
    10,
    10,
    15,
    'Free admission for two adults and up to 4 children; Invitations to members-only events; 15% discount at museum shop; 10% off tickets and exhibits; Member newsletter subscription; Early access to special exhibitions; Free entry to members lounge; Free kids activities on family days'
),
(
    'benefactor',
    'year',
    500,
    15,
    15,
    20,
    'Free admission for two adults and up to 6 guests; VIP invitations to all museum events; 20% discount at museum shop; 15% off tickets and exhibits; Member newsletter subscription; Private tours with curators; Free entry to members lounge; Exclusive benefactor events; Recognition on benefactor wall'
);

INSERT INTO railway.exhibits (exhibit_name, description, start_date, end_date)
VALUES
  ('Timepieces of Old', 'Historic clocks from the 18th-20th centuries', '2025-05-01', '2025-09-30'),
  ('Mystic Artifacts', 'Rare objects with mythical origins', '2025-06-15', NULL),
  ('Miniature Marvels', 'Tiny sculptures and intricate models', '2025-04-20', '2025-07-31'),
  ('The Cabinet of Curiosities', 'A re-creation of Victorian oddity rooms', '2025-03-10', '2025-08-10'),
  ('Forgotten Technologies', 'Obsolete gadgets and machines', '2025-05-25', '2025-10-15');

INSERT INTO railway.ticket_types (ticket_type, price)
VALUES
  ('general', 15),
  ('senior', 10),
  ('student', 8),
  ('child', 5);

INSERT INTO railway.gift_shop_inventory (item_name, description, quantity, unit_price, category, supplier)
VALUES
  ('Ancient Egypt Exhibition Booklet', 'A detailed guide to our Ancient Egypt exhibition', 100, 12.99, 'Books', 'Museum Press'),
  ('Museum Collection Tote Bag', 'Canvas tote bag with museum logo', 100, 24.99, 'Apparel', 'Heritage Threads'),
  ('Art History: A Complete Guide', 'Comprehensive art history reference book', 100, 39.99, 'Books', 'Global Art Publications'),
  ('Museum Collection Notebook', 'Hardcover notebook with museum designs', 100, 14.99, 'Books', 'Museum Press'),
  ('Artifact Collection Mug', 'Ceramic mug featuring famous artifacts', 100, 18.99, 'Home', 'CultureCrafts'),
  ('2024 Museum Calendar', 'Wall calendar featuring 12 famous artworks', 100, 15.99, 'Home', 'Timeless Prints'),
  ('Mini Sculpture Replica', 'High-quality replica of famous sculpture', 100, 49.99, 'Collectibles', 'Artisan Replicas'),
  ('Museum Logo T-Shirt', 'Cotton t-shirt with embroidered museum logo', 100, 22.99, 'Apparel', 'Heritage Threads'),
  ('Masterpiece Puzzle (1000 pc)', '1000 piece puzzle of famous artwork', 100, 27.99, 'Games', 'PuzzleWorks');

INSERT INTO railway.artists (
    artist_name, birth_year, death_year, nationality, movement, biography, notable_works
) VALUES
('Luca Romano', 1832, 1901, 'Italian', 'Baroque', 'Luca Romano was an Italian painter known for religious themes.', 'The Calling;Visions of Rome'),
('Sofia Reyes', 1964, NULL, 'Mexican', 'Surrealism', 'Sofia Reyes creates dream-like imagery in her work.', 'Dream Bloom;Inner Realms'),
('Carlos Mendoza', 1920, 1999, 'Mexican', 'Cubism', 'Carlos Mendoza explored geometric abstraction.', 'Fragmented Souls;Urban Mosaic'),
('Mateo Vargas', 1911, 1980, 'Spanish', 'Realism', 'Mateo Vargas was known for lifelike portraiture.', 'The Worker;Village Noon'),
('Jules Dupont', 1877, 1955, 'French', 'Impressionism', 'Jules Dupont captured light in everyday scenes.', 'Morning by the Seine;Paris Shadows'),
('Walter Greene', 1895, 1972, 'American', 'Pop Art', 'Walter Greene’s work features bold colors and icons.', 'Ad Madness;Neon Rush'),
('Naoko Fujita', 1938, NULL, 'Japanese', 'Minimalism', 'Naoko Fujita emphasizes form and space.', 'White Silence;Form and Void'),
('Samuel Hart', 1909, 1988, 'British', 'Expressionism', 'Samuel Hart used bold strokes and emotion.', 'Screaming Sky;Anguish'),
('Liang Wu', 1945, NULL, 'Chinese', 'Abstract', 'Liang Wu blends tradition with abstraction.', 'Ink Motion;Spirit of the East'),
('Priya Desai', 1973, NULL, 'Indian', 'Surrealism', 'Priya Desai’s work delves into subconscious symbols.', 'Mirrored Sands;Third Eye'),
('Ethan Wright', 1985, NULL, 'American', 'Minimalism', 'Ethan Wright explores color and shape.', 'Linescape;Empty Grid'),
('Rosa Jiménez', 1950, 2015, 'Mexican', 'Realism', 'Rosa Jiménez captured rural Mexican life.', 'Market Day;Abuela’s Kitchen'),
('Renzo Bianchi', 1910, 1980, 'Italian', 'Baroque', 'Renzo Bianchi painted elaborate historical scenes.', 'Fall of Empires;Chariot of Fire'),
('Claire Bernard', 1882, 1950, 'French', 'Impressionism', 'Claire Bernard depicted nature with soft palettes.', 'Lavender Fields;Evening Walk'),
('Emily Watson', 1991, NULL, 'Australian', 'Pop Art', 'Emily Watson mixes modern icons with satire.', 'Pixel Dreams;Cereal Box Heroes'),
('Victor Castillo', 1968, NULL, 'Spanish', 'Cubism', 'Victor Castillo is influenced by Picasso’s style.', 'Disjointed Thoughts;Faces in Motion'),
('Annika Larsen', 1942, 2009, 'Dutch', 'Expressionism', 'Annika Larsen expressed inner turmoil through paint.', 'Storm Within;Fractured Light'),
('William Ford', 1905, 1985, 'American', 'Abstract', 'William Ford’s style evolved from realism to abstraction.', 'Color Code;Form Shift'),
('Hiroshi Tanaka', 1929, 2010, 'Japanese', 'Minimalism', 'Hiroshi Tanaka focused on essence over detail.', 'Still Air;Ink Dot'),
('Amara Patel', 1980, NULL, 'Indian', 'Surrealism', 'Amara Patel creates fantastical female figures.', 'Floating Temples;Time Garden'),
('Natalie Brooks', 1975, NULL, 'American', 'Pop Art', 'Natalie Brooks reflects pop culture in her work.', 'Glam Girl;TV Nation'),
('Isabelle Laurent', 1933, 2000, 'French', 'Impressionism', 'Isabelle Laurent painted scenic views of Provence.', 'Sunlit Village;Windswept Hills'),
('Damian Clarke', 1958, NULL, 'British', 'Abstract', 'Damian Clarke explores color interaction.', 'The Edge;Prism Shift'),
('Oscar Delgado', 1990, NULL, 'Mexican', 'Realism', 'Oscar Delgado paints detailed city scenes.', 'Corner Store;Crosswalk Heat'),
('Antonio Moretti', 1860, 1932, 'Italian', 'Baroque', 'Antonio Moretti recreated dramatic biblical stories.', 'Last Supper;The Judgment'),
('Yu Chen', 1970, NULL, 'Chinese', 'Expressionism', 'Yu Chen conveys emotion through dynamic brushwork.', 'Crimson Wind;Whispers'),
('Marco Leone', 1900, 1965, 'Italian', 'Realism', 'Marco Leone captured post-war Italian life.', 'Train Station;Factory Light'),
('Laura Ortega', 1988, NULL, 'Spanish', 'Surrealism', 'Laura Ortega paints surreal Mediterranean worlds.', 'Seashell Voices;Twilight Dreamers'),
('Jun Park', 1965, NULL, 'Japanese', 'Minimalism', 'Jun Park emphasizes space and structure.', 'Folded Horizon;Zen Lines'),
('Fiona Hughes', 1939, 2001, 'British', 'Cubism', 'Fiona Hughes reinterprets landscapes geometrically.', 'Hill Triangles;Coastal Grid'),
('Benjamin Cole', 1915, 1990, 'American', 'Expressionism', 'Benjamin Cole painted with urgent, vivid gestures.', 'Inner Fire;Crash'),
('Anika Kapoor', 1959, NULL, 'Indian', 'Abstract', 'Anika Kapoor experiments with layered textures.', 'Threaded Light;Weave'),
('Sven Dekker', 1918, 1983, 'Dutch', 'Realism', 'Sven Dekker depicted everyday Dutch life.', 'Bicycle Alley;Tulip Row'),
('Marie Leclerc', 1899, 1970, 'French', 'Impressionism', 'Marie Leclerc embraced fleeting natural moments.', 'Fountain Park;Bridge Glance'),
('Takumi Sato', 1982, NULL, 'Japanese', 'Minimalism', 'Takumi Sato balances modernity and tradition.', 'Shadow Cut;Quiet Bamboo'),
('Chen Fang', 1930, 1999, 'Chinese', 'Abstract', 'Chen Fang layered symbols in nonliteral compositions.', 'Hidden Dragon;Calligraphy Storm'),
('Jacques Moreau', 1925, 1991, 'French', 'Cubism', 'Jacques Moreau distorted architecture in paint.', 'Spiral Hall;Fragmented Stair'),
('Ava Mitchell', 1992, NULL, 'Australian', 'Pop Art', 'Ava Mitchell mixes youth culture and irony.', 'Insta Series;Selfie Wall'),
('Alejandro Cruz', 1978, NULL, 'Mexican', 'Surrealism', 'Alejandro Cruz paints mystical deserts.', 'Cactus Mirage;Sun Oracle'),
('Dario Conti', 1890, 1960, 'Italian', 'Baroque', 'Dario Conti studied dramatic chiaroscuro.', 'Saint’s Trial;Golden Flames'),
('Oliver White', 1984, NULL, 'American', 'Abstract', 'Oliver White embraces spontaneous creation.', 'Drip Code;Color Draft'),
('Elena Rojas', 1948, NULL, 'Mexican', 'Realism', 'Elena Rojas painted vibrant family scenes.', 'Festival Street;Grandma’s Kitchen'),
('Manuel Herrera', 1902, 1975, 'Spanish', 'Expressionism', 'Manuel Herrera exaggerated forms for effect.', 'Carnival Eyes;Twist of Fate'),
('Erik Janssen', 1951, NULL, 'Dutch', 'Minimalism', 'Erik Janssen reduces architecture to essentials.', 'Facade Study;Lines of Light'),
('Aiko Nakamura', 1935, NULL, 'Japanese', 'Surrealism', 'Aiko Nakamura explores subconscious memories.', 'Forest of Mind;Spiral Mirror');

INSERT INTO railway.artifacts (
    artifact_name, exhibit_id, artist_id, description,
    created_year, value, acquisition_type, acquisition_date,
    medium, condition, dimensions, needs_restoration
) VALUES
('Relic Time', 4, 20, 'Historical artifact of cultural significance.', 1871, 7776899, 'Gift', '2022-02-28', 'Oil on canvas', 'Good', '24in x 36in', TRUE),
('Memory of Structure', 4, 25, 'Nostalgic piece reflecting personal history.', 1961, 7091772, 'Bequest', '2023-12-31', 'Mixed media', 'Excellent', '30in x 40in', FALSE),
('Myth of Structure', 4, 14, 'Interpretation of classical mythology.', 1906, 7274803, 'Gift', '2020-05-17', 'Marble', 'Fair', '15in x 20in', FALSE),
('Relic Color', 3, 44, 'Historical artifact of cultural significance.', 2005, 5896909, 'Bequest', '2020-01-14', 'Acrylic', 'Good', '18in x 24in', FALSE),
('Study for Void', 1, 29, 'Preliminary sketch for a larger work.', 1938, 4719438, 'Gift', '2023-10-03', 'Graphite on paper', 'Good', '11in x 17in', FALSE),
('Portrait of Void', 1, 33, 'Expressive portrait exploring identity.', 1859, 8681461, 'Gift', '2011-01-12', 'Oil on wood', 'Fair', '20in x 28in', TRUE),
('Dream of Time', 2, 40, 'Surreal depiction of imagined worlds.', 1923, 3292908, 'Bequest', '2020-11-04', 'Watercolor', 'Excellent', '16in x 20in', FALSE),
('Untitled Color', 2, 9, 'Abstract work with minimal elements.', 1945, 2347726, 'Purchase', '2022-06-16', 'Digital print', 'Good', '12in x 12in', FALSE),
('Untitled Light', 4, 31, 'Abstract work with minimal elements.', 1900, 549298, 'Gift', '2022-09-08', 'Ink on paper', 'Good', '8in x 10in', FALSE),
('Study for Silence', 4, 39, 'Preliminary sketch for a larger work.', 1888, 5471867, 'Purchase', '2020-01-02', 'Charcoal on paper', 'Fair', '14in x 18in', FALSE),
('Figure Harmony', 4, 35, 'Representation of the human form.', 1956, 4492624, 'Bequest', '2021-11-09', 'Bronze', 'Good', '6ft x 2ft', FALSE),
('Relic Color', 5, 13, 'Historical artifact of cultural significance.', 1989, 7678165, 'Gift', '2020-07-29', 'Textile', 'Good', '36in x 36in', FALSE),
('Portrait of Void', 3, 41, 'Expressive portrait exploring identity.', 1854, 9572912, 'Gift', '2021-12-04', 'Oil on canvas', 'Poor', '22in x 30in', TRUE),
('Study for Light', 1, 38, 'Preliminary sketch for a larger work.', 1933, 96180, 'Purchase', '2021-09-08', 'Pastel on board', 'Good', '14in x 20in', FALSE),
('Study for Harmony', 1, 7, 'Preliminary sketch for a larger work.', 1925, 3529150, 'Purchase', '2021-03-11', 'Chalk', 'Fair', '10in x 14in', FALSE),
('Relic Motion', 4, 28, 'Historical artifact of cultural significance.', 1991, 416495, 'Purchase', '2022-07-09', 'Ceramic', 'Good', '12in x 18in', FALSE),
('Composition Time', 3, 19, 'Balanced composition with thematic elements.', 1859, 9917612, 'Purchase', '2012-10-15', 'Tempera', 'Excellent', '30in x 30in', FALSE),
('Memory of Time', 5, 17, 'Nostalgic piece reflecting personal history.', 2010, 4607658, 'Bequest', '2020-06-06', 'Oil on linen', 'Excellent', '32in x 48in', FALSE),
('Composition Silence', 2, 42, 'Balanced composition with thematic elements.', 1868, 3975207, 'Bequest', '2022-03-13', 'Mixed media', 'Fair', '24in x 36in', FALSE),
('Myth of Motion', 4, 18, 'Interpretation of classical mythology.', 1913, 8499296, 'Bequest', '2019-07-16', 'Marble', 'Good', '18in x 30in', FALSE),
('Relic Void', 4, 8, 'Historical artifact of cultural significance.', 1996, 7273668, 'Purchase', '2022-06-27', 'Wood', 'Good', '20in x 24in', FALSE),
('Study for Motion', 2, 27, 'Preliminary sketch for a larger work.', 1852, 7690924, 'Gift', '2022-11-13', 'Pencil on paper', 'Fair', '11in x 17in', TRUE),
('Dream of Silence', 3, 6, 'Surreal depiction of imagined worlds.', 2014, 5708305, 'Purchase', '2022-12-23', 'Acrylic on canvas', 'Excellent', '36in x 48in', FALSE);

INSERT INTO railway.employees (
  employee_name, exhibit_id, access_id, ssn, phone_number, address,
  personal_email, work_email, birth_date, hiring_date,
  fired_date, salary, role
) VALUES
('Michael Green', 5, NULL, '330-20-7889', '738-401-1468', '73720 Virginia Ways Apt. 619, West Steven, NJ 07475', 'tcalhoun@gmail.com', 'michael.green@museum.org', '1996-02-01', '2011-06-04', NULL, 40819, 'Administrator'),
('Bethany Rodriguez', 4, 'user_2un41siF8kB31SRRx2HKcByDRsl', '818-78-7686', '103-229-6874', '838 John Villages, Phillipsbury, VT 74108', 'hawkinstracey@smith.com', 'bethany.rodriguez@museum.org', '1977-03-17', '2022-05-16', '2025-02-26', 44572, 'Educator'),
('Joseph Adams', 3, NULL, '348-36-6778', '723-607-9758', '630 Nicholas Branch Suite 217, Laurafort, NH 06160', 'dylan25@wilson-webb.info', 'joseph.adams@museum.org', '1986-12-23', '2014-05-14', NULL, 69234, 'Educator'),
('Lynn Floyd', 2, NULL, '533-49-4081', '264-508-7222', '4017 Erin Gardens Suite 682, East Angelafort, MS 60142', 'vargaskathleen@martinez-smith.biz', 'lynn.floyd@museum.org', '2003-03-16', '2016-11-28', NULL, 41041, 'Curator'),
('Courtney Pratt', 1, NULL, '403-79-0057', '634-194-8838', '556 Smith Stream, West Matthewmouth, MT 27059', 'tvaughn@johnson-allen.com', 'courtney.pratt@museum.org', '1982-04-29', '2014-07-06', '2021-02-10', 47623, 'Curator'),
('Jason Holloway', 5, NULL, '587-79-6473', '330-741-9383', '153 Devin Mountain Apt. 672, South Brianshire, ID 10075', 'yrobertson@hotmail.com', 'jason.holloway@museum.org', '1981-06-03', '2022-08-25', '2024-08-31', 61295, 'Security');