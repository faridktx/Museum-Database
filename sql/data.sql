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

INSERT INTO railway.gift_shop_inventory (item_name, description, quantity, unit_price, category)
VALUES
  ('Ancient Egypt Exhibition Booklet', 'A detailed guide to our Ancient Egypt exhibition', 100, 12.99, 'Books'),
  ('Museum Collection Tote Bag', 'Canvas tote bag with museum logo', 100, 24.99, 'Apparel'),
  ('Art History: A Complete Guide', 'Comprehensive art history reference book', 100, 39.99, 'Books'),
  ('Museum Collection Notebook', 'Hardcover notebook with museum designs', 100, 14.99, 'Books'),
  ('Artifact Collection Mug', 'Ceramic mug featuring famous artifacts', 100, 18.99, 'Home'),
  ('2024 Museum Calendar', 'Wall calendar featuring 12 famous artworks', 100, 15.99, 'Home'),
  ('Mini Sculpture Replica', 'High-quality replica of famous sculpture', 100, 49.99, 'Collectibles'),
  ('Museum Logo T-Shirt', 'Cotton t-shirt with embroidered museum logo', 100, 22.99, 'Apparel'),
  ('Masterpiece Puzzle (1000 pc)', '1000 piece puzzle of famous artwork', 100, 27.99, 'Games');

INSERT INTO railway.artists (artist_name, birth_date, death_date, nationality) VALUES
('Luca Romano', '1832-05-11', '1901-07-22', 'Italian'),
('Sofia Reyes', '1964-02-28', NULL, 'Mexican'),
('Carlos Mendoza', '1920-10-17', '1999-06-01', 'Mexican'),
('Mateo Vargas', '1911-01-03', '1980-09-15', 'Spanish'),
('Jules Dupont', '1877-04-19', '1955-12-12', 'French'),
('Walter Greene', '1895-03-02', '1972-01-20', 'American'),
('Naoko Fujita', '1938-07-08', NULL, 'Japanese'),
('Samuel Hart', '1909-11-09', '1988-04-30', 'British'),
('Liang Wu', '1945-06-12', NULL, 'Chinese'),
('Priya Desai', '1973-10-25', NULL, 'Indian'),
('Ethan Wright', '1985-05-05', NULL, 'American'),
('Rosa Jiménez', '1950-09-14', '2015-03-19', 'Mexican'),
('Renzo Bianchi', '1910-06-22', '1980-08-17', 'Italian'),
('Claire Bernard', '1882-12-12', '1950-07-01', 'French'),
('Emily Watson', '1991-01-01', NULL, 'Australian'),
('Victor Castillo', '1968-03-17', NULL, 'Spanish'),
('Annika Larsen', '1942-07-23', '2009-11-10', 'Dutch'),
('William Ford', '1905-10-10', '1985-05-20', 'American'),
('Hiroshi Tanaka', '1929-04-04', '2010-08-30', 'Japanese'),
('Amara Patel', '1980-12-06', NULL, 'Indian'),
('Natalie Brooks', '1975-06-30', NULL, 'American'),
('Isabelle Laurent', '1933-02-01', '2000-10-08', 'French'),
('Damian Clarke', '1958-09-13', NULL, 'British'),
('Oscar Delgado', '1990-07-22', NULL, 'Mexican'),
('Antonio Moretti', '1860-11-15', '1932-02-28', 'Italian'),
('Yu Chen', '1970-03-05', NULL, 'Chinese'),
('Marco Leone', '1900-01-01', '1965-04-04', 'Italian'),
('Laura Ortega', '1988-08-18', NULL, 'Spanish'),
('Jun Park', '1965-05-15', NULL, 'Japanese'),
('Fiona Hughes', '1939-10-30', '2001-12-12', 'British'),
('Benjamin Cole', '1915-06-06', '1990-01-09', 'American'),
('Anika Kapoor', '1959-01-11', NULL, 'Indian'),
('Sven Dekker', '1918-02-28', '1983-07-17', 'Dutch'),
('Marie Leclerc', '1899-09-19', '1970-03-21', 'French'),
('Takumi Sato', '1982-04-02', NULL, 'Japanese'),
('Chen Fang', '1930-08-25', '1999-06-06', 'Chinese'),
('Jacques Moreau', '1925-05-16', '1991-11-30', 'French'),
('Ava Mitchell', '1992-03-03', NULL, 'Australian'),
('Alejandro Cruz', '1978-11-11', NULL, 'Mexican'),
('Dario Conti', '1890-12-12', '1960-05-01', 'Italian'),
('Oliver White', '1984-02-10', NULL, 'American'),
('Elena Rojas', '1948-09-09', NULL, 'Mexican'),
('Manuel Herrera', '1902-06-18', '1975-12-22', 'Spanish'),
('Erik Janssen', '1951-08-29', NULL, 'Dutch'),
('Aiko Nakamura', '1935-07-07', NULL, 'Japanese');

INSERT INTO railway.artifacts (
    artifact_name, exhibit_id, artist_id, description,
    created_date, value, acquisition_type, acquisition_date
) VALUES
('Relic Time', 4, 20, 'Historical artifact of cultural significance.', '1871-04-12', 7776899, 'Gift', '2022-02-28'),
('Memory of Structure', 4, 25, 'Nostalgic piece reflecting personal history.', '1961-03-17', 7091772, 'Bequest', '2023-12-31'),
('Myth of Structure', 4, 14, 'Interpretation of classical mythology.', '1906-04-25', 7274803, 'Gift', '2020-05-17'),
('Relic Color', 3, 44, 'Historical artifact of cultural significance.', '2005-08-31', 5896909, 'Bequest', '2020-01-14'),
('Study for Void', 1, 29, 'Preliminary sketch for a larger work.', '1938-05-07', 4719438, 'Gift', '2023-10-03'),
('Portrait of Void', 1, 33, 'Expressive portrait exploring identity.', '1859-05-07', 8681461, 'Gift', '2011-01-12'),
('Dream of Time', 2, 40, 'Surreal depiction of imagined worlds.', '1923-10-17', 3292908, 'Bequest', '2020-11-04'),
('Untitled Color', 2, 9, 'Abstract work with minimal elements.', '1945-07-05', 2347726, 'Purchase', '2022-06-16'),
('Untitled Light', 4, 31, 'Abstract work with minimal elements.', '1900-02-27', 549298, 'Gift', '2022-09-08'),
('Study for Silence', 4, 39, 'Preliminary sketch for a larger work.', '1888-07-03', 5471867, 'Purchase', '2020-01-02'),
('Figure Harmony', 4, 35, 'Representation of the human form.', '1956-12-01', 4492624, 'Bequest', '2021-11-09'),
('Relic Color', 5, 13, 'Historical artifact of cultural significance.', '1989-02-15', 7678165, 'Gift', '2020-07-29'),
('Portrait of Void', 3, 41, 'Expressive portrait exploring identity.', '1854-03-19', 9572912, 'Gift', '2021-12-04'),
('Study for Light', 1, 38, 'Preliminary sketch for a larger work.', '1933-04-15', 96180, 'Purchase', '2021-09-08'),
('Study for Harmony', 1, 7, 'Preliminary sketch for a larger work.', '1925-11-09', 3529150, 'Purchase', '2021-03-11'),
('Relic Motion', 4, 28, 'Historical artifact of cultural significance.', '1991-01-04', 416495, 'Purchase', '2022-07-09'),
('Composition Time', 3, 19, 'Balanced composition with thematic elements.', '1859-02-14', 9917612, 'Purchase', '2012-10-15'),
('Memory of Time', 5, 17, 'Nostalgic piece reflecting personal history.', '2010-10-27', 4607658, 'Bequest', '2020-06-06'),
('Composition Silence', 2, 42, 'Balanced composition with thematic elements.', '1868-12-08', 3975207, 'Bequest', '2022-03-13'),
('Myth of Motion', 4, 18, 'Interpretation of classical mythology.', '1913-03-09', 8499296, 'Bequest', '2019-07-16'),
('Relic Void', 4, 8, 'Historical artifact of cultural significance.', '1996-05-16', 7273668, 'Purchase', '2022-06-27'),
('Study for Motion', 2, 27, 'Preliminary sketch for a larger work.', '1852-07-28', 7690924, 'Gift', '2022-11-13'),
('Dream of Silence', 3, 6, 'Surreal depiction of imagined worlds.', '2014-05-17', 5708305, 'Purchase', '2022-12-23'),
('Portrait of Light', 3, 45, 'Expressive portrait exploring identity.', '1861-03-03', 5824218, 'Gift', '2014-01-13'),
('Figure Chaos', 5, 1, 'Representation of the human form.', '1872-01-25', 5030029, 'Purchase', '2013-08-12'),
('Composition Harmony', 4, 21, 'Balanced composition with thematic elements.', '1991-10-09', 9737723, 'Purchase', '2021-07-07'),
('Composition Silence', 4, 36, 'Balanced composition with thematic elements.', '1958-08-18', 972845, 'Purchase', '2023-05-29'),
('Artifact Rebirth', 4, 37, 'Rare museum artifact with symbolic value.', '1858-10-08', 2463703, 'Bequest', '2021-05-24'),
('Memory of Time', 2, 4, 'Nostalgic piece reflecting personal history.', '1917-06-30', 4116324, 'Bequest', '2023-12-21'),
('Relic Silence', 5, 23, 'Historical artifact of cultural significance.', '1969-10-16', 4499620, 'Gift', '2020-07-05'),
('Dream of Void', 3, 15, 'Surreal depiction of imagined worlds.', '1901-09-16', 3952313, 'Bequest', '2021-10-03'),
('Study for Chaos', 4, 24, 'Preliminary sketch for a larger work.', '2004-12-18', 3401255, 'Purchase', '2023-06-24'),
('Memory of Motion', 4, 12, 'Nostalgic piece reflecting personal history.', '1888-09-10', 5903847, 'Gift', '2020-10-15'),
('Portrait of Chaos', 1, 3, 'Expressive portrait exploring identity.', '1884-09-12', 3466332, 'Bequest', '2022-02-23'),
('Dream of Color', 2, 2, 'Surreal depiction of imagined worlds.', '1853-08-03', 9334052, 'Gift', '2022-02-17'),
('Relic Time', 2, 10, 'Historical artifact of cultural significance.', '1996-05-11', 1371562, 'Bequest', '2021-12-13'),
('Composition Time', 5, 26, 'Balanced composition with thematic elements.', '1894-06-15', 4091683, 'Gift', '2022-02-23'),
('Dream of Structure', 4, 11, 'Surreal depiction of imagined worlds.', '1971-12-09', 6098725, 'Purchase', '2012-11-29'),
('Myth of Time', 3, 16, 'Interpretation of classical mythology.', '1922-07-02', 9312481, 'Bequest', '2022-01-02'),
('Relic Light', 2, 22, 'Historical artifact of cultural significance.', '1985-07-28', 2425198, 'Purchase', '2023-09-08'),
('Composition Light', 2, 43, 'Balanced composition with thematic elements.', '2003-06-23', 6299780, 'Bequest', '2022-09-21'),
('Artifact Time', 4, 34, 'Rare museum artifact with symbolic value.', '1885-09-01', 5065886, 'Purchase', '2022-08-29'),
('Composition Chaos', 2, 5, 'Balanced composition with thematic elements.', '2017-06-19', 2296797, 'Bequest', '2022-12-15'),
('Artifact Rebirth', 2, 30, 'Rare museum artifact with symbolic value.', '1854-12-05', 5542210, 'Gift', '2020-12-02'),
('Study for Structure', 4, 32, 'Preliminary sketch for a larger work.', '1912-01-09', 193772, 'Gift', '2022-08-02'),
('Composition Rebirth', 4, 44, 'Balanced composition with thematic elements.', '1980-11-04', 8264334, 'Purchase', '2021-09-09'),
('Untitled Motion', 1, 21, 'Abstract work with minimal elements.', '1890-05-14', 571926, 'Bequest', '2015-11-23'),
('Portrait of Chaos', 5, 32, 'Expressive portrait exploring identity.', '1966-05-05', 1150376, 'Gift', '2020-01-14'),
('Study for Light', 1, 21, 'Preliminary sketch for a larger work.', '1967-04-12', 118865, 'Bequest', '2021-05-28'),
('Memory of Motion', 1, 43, 'Nostalgic piece reflecting personal history.', '2006-10-21', 1003982, 'Gift', '2020-04-20'),
('Dream of Time', 5, 43, 'Surreal depiction of imagined worlds.', '1927-07-13', 5826860, 'Gift', '2013-02-07'),
('Relic Silence', 4, 38, 'Historical artifact of cultural significance.', '1991-12-18', 3952638, 'Bequest', '2017-03-16'),
('Myth of Chaos', 4, 26, 'Interpretation of classical mythology.', '1962-01-12', 4487134, 'Purchase', '2020-01-27'),
('Figure Void', 1, 38, 'Representation of the human form.', '1944-12-30', 7198080, 'Purchase', '2021-07-02'),
('Untitled Silence', 1, 40, 'Abstract work with minimal elements.', '1898-12-05', 8724342, 'Gift', '2022-12-06'),
('Dream of Chaos', 5, 29, 'Surreal depiction of imagined worlds.', '1940-06-15', 8938377, 'Bequest', '2020-02-02'),
('Artifact Rebirth', 3, 6, 'Rare museum artifact with symbolic value.', '1971-08-08', 1101716, 'Bequest', '2021-06-16'),
('Memory of Chaos', 5, 24, 'Nostalgic piece reflecting personal history.', '2012-03-10', 9699965, 'Bequest', '2023-11-02'),
('Myth of Harmony', 1, 39, 'Interpretation of classical mythology.', '2009-05-27', 8438397, 'Purchase', '2020-08-15'),
('Untitled Harmony', 1, 42, 'Abstract work with minimal elements.', '1876-11-12', 5588640, 'Bequest', '2021-06-15'),
('Study for Time', 2, 44, 'Preliminary sketch for a larger work.', '1969-07-18', 7482829, 'Gift', '2022-11-19'),
('Study for Void', 2, 6, 'Preliminary sketch for a larger work.', '1946-10-17', 5783653, 'Purchase', '2022-12-09'),
('Study for Void', 5, 36, 'Preliminary sketch for a larger work.', '1850-11-29', 4029596, 'Purchase', '2023-06-29'),
('Figure Chaos', 4, 21, 'Representation of the human form.', '1931-10-29', 6297880, 'Gift', '2011-10-10'),
('Figure Motion', 5, 39, 'Representation of the human form.', '1852-01-07', 260358, 'Purchase', '2013-04-19'),
('Myth of Motion', 2, 2, 'Interpretation of classical mythology.', '1851-11-29', 5186995, 'Bequest', '2023-03-05'),
('Myth of Silence', 1, 20, 'Interpretation of classical mythology.', '1994-02-27', 9782701, 'Gift', '2023-08-11'),
('Artifact Time', 2, 34, 'Rare museum artifact with symbolic value.', '1967-08-02', 2405319, 'Purchase', '2015-06-01'),
('Figure Structure', 2, 25, 'Representation of the human form.', '1969-10-18', 8269688, 'Bequest', '2020-05-29'),
('Myth of Light', 1, 38, 'Interpretation of classical mythology.', '1930-09-23', 911342, 'Bequest', '2023-05-26'),
('Portrait of Light', 4, 27, 'Expressive portrait exploring identity.', '1909-07-21', 2842470, 'Purchase', '2023-01-25'),
('Composition Time', 5, 21, 'Balanced composition with thematic elements.', '1892-10-25', 7393097, 'Gift', '2023-11-21'),
('Untitled Chaos', 1, 8, 'Abstract work with minimal elements.', '1966-04-12', 8334735, 'Purchase', '2020-07-21'),
('Study for Time', 4, 40, 'Preliminary sketch for a larger work.', '1944-05-28', 1460981, 'Purchase', '2015-05-06'),
('Memory of Void', 3, 5, 'Nostalgic piece reflecting personal history.', '2001-09-12', 6626369, 'Purchase', '2020-06-04'),
('Study for Chaos', 2, 16, 'Preliminary sketch for a larger work.', '2006-01-08', 1694965, 'Purchase', '2023-09-20'),
('Memory of Void', 4, 37, 'Nostalgic piece reflecting personal history.', '1972-06-23', 5441145, 'Gift', '2010-04-25'),
('Dream of Harmony', 3, 9, 'Surreal depiction of imagined worlds.', '1992-08-24', 6843452, 'Gift', '2023-10-29'),
('Memory of Color', 2, 9, 'Nostalgic piece reflecting personal history.', '1919-10-08', 9473129, 'Bequest', '2021-04-30'),
('Composition Motion', 5, 2, 'Balanced composition with thematic elements.', '1984-07-12', 2089722, 'Gift', '2023-11-11'),
('Myth of Color', 5, 5, 'Interpretation of classical mythology.', '1984-09-21', 4081509, 'Purchase', '2021-08-31'),
('Figure Harmony', 5, 3, 'Representation of the human form.', '1990-09-14', 5701344, 'Bequest', '2015-11-01'),
('Portrait of Time', 2, 45, 'Expressive portrait exploring identity.', '1962-12-18', 5764712, 'Bequest', '2022-03-20'),
('Relic Chaos', 1, 14, 'Historical artifact of cultural significance.', '2013-05-07', 6491118, 'Bequest', '2021-09-20'),
('Composition Time', 3, 7, 'Balanced composition with thematic elements.', '2006-11-28', 7334434, 'Purchase', '2023-07-03'),
('Composition Motion', 1, 4, 'Balanced composition with thematic elements.', '1915-12-29', 2194762, 'Gift', '2021-03-07'),
('Untitled Motion', 5, 39, 'Abstract work with minimal elements.', '1962-11-28', 5677170, 'Gift', '2022-07-17'),
('Untitled Color', 3, 13, 'Abstract work with minimal elements.', '1865-03-11', 3754767, 'Gift', '2021-03-15'),
('Myth of Light', 4, 10, 'Interpretation of classical mythology.', '1934-05-10', 2588028, 'Gift', '2017-12-06'),
('Composition Silence', 2, 29, 'Balanced composition with thematic elements.', '1921-04-12', 411304, 'Purchase', '2020-08-31'),
('Portrait of Time', 3, 35, 'Expressive portrait exploring identity.', '1891-09-15', 4952972, 'Purchase', '2022-11-28'),
('Dream of Void', 3, 13, 'Surreal depiction of imagined worlds.', '1936-05-27', 4694235, 'Purchase', '2018-04-09'),
('Memory of Light', 1, 4, 'Nostalgic piece reflecting personal history.', '1864-07-03', 9018013, 'Gift', '2020-10-10'),
('Relic Structure', 1, 28, 'Historical artifact of cultural significance.', '1883-02-05', 5050576, 'Purchase', '2023-10-21'),
('Figure Rebirth', 4, 22, 'Representation of the human form.', '2009-11-04', 1293503, 'Bequest', '2021-03-11'),
('Untitled Color', 1, 31, 'Abstract work with minimal elements.', '1863-10-02', 8084140, 'Bequest', '2020-03-24'),
('Memory of Rebirth', 4, 6, 'Nostalgic piece reflecting personal history.', '1857-06-21', 9948028, 'Bequest', '2022-10-26'),
('Memory of Silence', 1, 15, 'Nostalgic piece reflecting personal history.', '1917-07-05', 8717683, 'Bequest', '2023-02-11'),
('Portrait of Motion', 2, 3, 'Expressive portrait exploring identity.', '2018-01-26', 3264347, 'Gift', '2023-07-08'),
('Portrait of Harmony', 5, 37, 'Expressive portrait exploring identity.', '1933-06-03', 4395383, 'Purchase', '2022-07-19');

INSERT INTO railway.employees (
  employee_name, exhibit_id, ssn, phone_number, address,
  personal_email, work_email, birth_date, hiring_date,
  fired_date, salary, role
) VALUES
('Michael Green', 5, '330-20-7889', '738-401-1468', '73720 Virginia Ways Apt. 619, West Steven, NJ 07475', 'tcalhoun@gmail.com', 'michael.green@museum.org', '1996-02-01', '2011-06-04', NULL, 40819, 'Administrator'),
('Bethany Rodriguez', 4, '818-78-7686', '103-229-6874', '838 John Villages, Phillipsbury, VT 74108', 'hawkinstracey@smith.com', 'bethany.rodriguez@museum.org', '1977-03-17', '2022-05-16', '2025-02-26', 44572, 'Educator'),
('Joseph Adams', 3, '348-36-6778', '723-607-9758', '630 Nicholas Branch Suite 217, Laurafort, NH 06160', 'dylan25@wilson-webb.info', 'joseph.adams@museum.org', '1986-12-23', '2014-05-14', NULL, 69234, 'Educator'),
('Lynn Floyd', 2, '533-49-4081', '264-508-7222', '4017 Erin Gardens Suite 682, East Angelafort, MS 60142', 'vargaskathleen@martinez-smith.biz', 'lynn.floyd@museum.org', '2003-03-16', '2016-11-28', NULL, 41041, 'Curator'),
('Courtney Pratt', 1, '403-79-0057', '634-194-8838', '556 Smith Stream, West Matthewmouth, MT 27059', 'tvaughn@johnson-allen.com', 'courtney.pratt@museum.org', '1982-04-29', '2014-07-06', '2021-02-10', 47623, 'Curator'),
('Jason Holloway', 5, '587-79-6473', '330-741-9383', '153 Devin Mountain Apt. 672, South Brianshire, ID 10075', 'yrobertson@hotmail.com', 'jason.holloway@museum.org', '1981-06-03', '2022-08-25', '2024-08-31', 61295, 'Security'),
('Terry Woods', 2, '329-99-3791', '040-692-3347', 'PSC 8268, Box 1515, APO AP 23159', 'richarddaniels@hotmail.com', 'terry.woods@museum.org', '1974-02-21', '2014-04-16', NULL, 49115, 'Curator'),
('Natasha Delgado', 2, '118-60-6760', '427-924-4013', '7172 John Throughway Apt. 264, New Rachel, AZ 47650', 'zwaller@myers-ross.net', 'natasha.delgado@museum.org', '1965-02-24', '2018-11-08', NULL, 51149, 'Administrator'),
('Mike Morris', 2, '809-46-7631', '635-002-0528', '155 Gonzalez Wells, Pearsonburgh, WA 24506', 'trobinson@yahoo.com', 'mike.morris@museum.org', '1995-11-25', '2018-06-05', '2018-12-18', 65018, 'Development'),
('Rebecca Johnston', 1, '268-30-4455', '822-379-4417', '100 Reid Motorway Suite 933, Turnerside, NC 42004', 'qli@yahoo.com', 'rebecca.johnston@museum.org', '1996-01-23', '2011-08-03', '2022-11-16', 43169, 'Development'),
('Keith Flores', 3, '553-67-1484', '191-090-4777', 'USNS Lowery, FPO AE 41227', 'leemichael@gmail.com', 'keith.flores@museum.org', '1998-02-21', '2024-02-05', NULL, 66447, 'Curator'),
('Emily Callahan', 4, '611-32-5309', '304-630-8613', '1377 Reyes Heights, Michelletown, MN 33560', 'aaron53@chung.com', 'emily.callahan@museum.org', '2000-12-18', '2016-12-19', NULL, 52403, 'Educator'),
('Mr. Daniel Fowler', 5, '083-24-4716', '742-204-2599', 'Unit 8006 Box 0302, DPO AA 65724', 'rmills@gmail.com', 'mr..daniel.fowler@museum.org', '2002-08-10', '2012-01-22', NULL, 60599, 'Development'),
('Kim Curry', 5, '408-75-9652', '255-403-4791', '0374 Luna Stream, South Alicemouth, NJ 71888', 'aaron84@yahoo.com', 'kim.curry@museum.org', '1982-09-11', '2015-09-28', '2025-02-09', 42279, 'Curator'),
('Erin Randall', 2, '571-49-3821', '855-435-6440', '72142 Bass Manors Apt. 217, Davisport, ME 90406', 'jessica42@yahoo.com', 'erin.randall@museum.org', '1981-06-07', '2015-11-21', NULL, 42614, 'Custodian'),
('Anthony Hess', 1, '277-82-2874', '677-507-7803', '685 White Creek Apt. 011, South Tim, RI 99626', 'mparks@yahoo.com', 'anthony.hess@museum.org', '1984-05-24', '2011-06-08', NULL, 54857, 'Development'),
('Nicole Mccoy', 2, '187-67-3080', '602-026-9273', '469 Arnold Row, Trevormouth, ME 59544', 'brittanylewis@hotmail.com', 'nicole.mccoy@museum.org', '1978-02-24', '2011-06-22', NULL, 46865, 'Administrator'),
('Jessica Boyle', 1, '807-25-0093', '176-269-2717', 'USNV Fitzpatrick, FPO AP 96783', 'sawyermichelle@gmail.com', 'jessica.boyle@museum.org', '1983-03-23', '2014-04-15', NULL, 45607, 'Custodian'),
('Jason Aguilar', 2, '395-15-1599', '472-009-4990', '991 Mary Lights Apt. 950, Torresstad, VA 72755', 'uthompson@farmer.com', 'jason.aguilar@museum.org', '1985-09-06', '2017-12-23', NULL, 48845, 'Custodian'),
('Kelly Scott', 3, '301-93-7049', '763-166-9047', '06101 Hayes Plaza, West Joyfurt, MN 88989', 'woodschad@yahoo.com', 'kelly.scott@museum.org', '1985-03-17', '2013-10-17', NULL, 65427, 'Curator'),
('Chad Singh', 2, '641-01-2385', '143-643-8124', '3501 Austin Mission Suite 531, Carmenberg, NV 00986', 'mackenziewright@mcdowell.com', 'chad.singh@museum.org', '1974-10-11', '2023-11-07', NULL, 66379, 'Development'),
('Steven Davis', 4, '395-80-6172', '320-219-5291', '2309 Mooney Junction, Chavezburgh, ID 23399', 'laura88@brooks-jones.com', 'steven.davis@museum.org', '1981-10-08', '2019-05-19', NULL, 46913, 'Development'),
('Dustin Lawson', 2, '316-60-4008', '785-383-9890', '1548 Rodriguez Falls Suite 376, Michaelfort, MI 14938', 'shudson@santana.com', 'dustin.lawson@museum.org', '1974-05-22', '2023-01-23', NULL, 52964, 'Retail'),
('Jennifer Dawson', 2, '110-23-4934', '103-518-0169', '3651 Woods Union, North Erin, KS 88162', 'rhiggins@gmail.com', 'jennifer.dawson@museum.org', '1976-07-29', '2011-04-30', NULL, 48081, 'Administrator'),
('David Conway', 5, '806-67-1484', '523-636-6591', '3979 Huang Mountain Apt. 643, East James, VA 32306', 'angela32@harris.com', 'david.conway@museum.org', '2002-02-14', '2011-11-22', NULL, 59121, 'Security'),
('David Sanchez', 3, '498-95-1405', '397-625-6466', '1394 Jacob Garden, Kingmouth, NY 54717', 'kellywatson@hotmail.com', 'david.sanchez@museum.org', '1966-08-04', '2013-07-19', '2022-09-02', 44532, 'Retail'),
('Jonathan Fisher', 1, '831-68-5703', '300-345-9561', '60235 Harris Locks Apt. 557, Lake Melanie, NJ 82829', 'andrearodriguez@gmail.com', 'jonathan.fisher@museum.org', '1977-10-11', '2017-11-15', NULL, 68216, 'Educator'),
('Connie Chung', 2, '709-83-9457', '801-848-5321', '633 Linda Village Apt. 883, Maxwelltown, ID 18620', 'hopkinsangela@gmail.com', 'connie.chung@museum.org', '1975-07-25', '2012-01-10', NULL, 65954, 'Security'),
('Kelly Smith', 5, '703-20-5903', '825-238-3053', '5147 Mcdonald Lane, East Nichole, TX 05861', 'sydneywilliams@kim-allen.com', 'kelly.smith@museum.org', '2000-09-26', '2021-12-14', '2022-07-07', 52504, 'Retail'),
('Terry Perez', 5, '632-32-0465', '247-930-5233', '706 Stephanie Courts, Lake Kimberlyberg, NE 48805', 'todd91@gmail.com', 'terry.perez@museum.org', '1979-03-11', '2023-06-21', NULL, 58128, 'Curator'),
('Alexander Berry', 1, '353-15-4331', '726-782-3266', '2992 Anthony Springs Apt. 979, East Rhonda, NJ 44109', 'yatesseth@hotmail.com', 'alexander.berry@museum.org', '1987-02-01', '2018-11-10', NULL, 57595, 'Administrator'),
('Jack Mcintosh', 3, '252-43-3583', '352-311-0407', '6334 Gabriel Mill, Jessehaven, OH 49979', 'breyes@yahoo.com', 'jack.mcintosh@museum.org', '1967-03-09', '2019-09-28', '2025-01-05', 54246, 'Reception'),
('Nicholas Elliott', 4, '521-05-4409', '564-082-8520', '965 Alexa Plaza, New Sharon, NY 99779', 'iyork@villanueva.com', 'nicholas.elliott@museum.org', '1975-04-03', '2015-08-30', '2016-03-05', 63661, 'Administrator'),
('Cathy Evans', 5, '439-63-4782', '710-670-3498', '650 Strong Trace, East Michelle, WV 34873', 'ashleyterry@vaughn.com', 'cathy.evans@museum.org', '1982-07-21', '2015-08-19', NULL, 56635, 'Educator'),
('Michelle Howard', 3, '669-45-3600', '004-265-6649', 'Unit 9788 Box 7806, DPO AP 16316', 'jennifersilva@gmail.com', 'michelle.howard@museum.org', '1980-04-13', '2017-09-20', NULL, 56635, 'Custodian'),
('Connie Kirby', 2, '844-13-4842', '792-814-0594', 'USS Rodriguez, FPO AE 71048', 'vincent72@garza-hurley.com', 'connie.kirby@museum.org', '1974-06-14', '2024-03-09', NULL, 45293, 'Curator'),
('John Duncan', 5, '173-15-6950', '670-087-7756', '0129 Michaela Tunnel, Grossview, AR 68509', 'nicolegibson@olsen.org', 'john.duncan@museum.org', '1985-11-05', '2022-10-07', NULL, 40638, 'Educator'),
('Richard Moore', 3, '071-08-5612', '121-407-7160', '3982 David Trail, Johnton, GA 40352', 'yvonne14@vaughan-watkins.com', 'richard.moore@museum.org', '1996-04-04', '2021-05-03', NULL, 67252, 'Administrator'),
('Alan Carey', 2, '714-49-8397', '203-864-2421', '66247 Wayne Spring, Johnsontown, MD 44028', 'escobarteresa@kelley.com', 'alan.carey@museum.org', '1975-01-27', '2019-12-15', '2024-11-03', 68770, 'Educator'),
('Anthony Matthews', 1, '035-63-4747', '295-093-5283', '57374 Stevens Falls, East Brendachester, NJ 31555', 'pereztiffany@hotmail.com', 'anthony.matthews@museum.org', '1981-01-08', '2013-12-28', NULL, 66739, 'Educator'),
('Jacob Moore', 5, '136-61-0824', '295-436-8992', '86123 Sean Brooks, East Bonnie, RI 26535', 'ryanhart@carroll-reeves.info', 'jacob.moore@museum.org', '2001-06-01', '2014-10-02', NULL, 44207, 'Retail'),
('Nicholas Miller', 5, '162-25-3646', '651-412-7541', '51903 Marilyn Fork, Lake Johnfurt, NY 08785', 'robertsronald@gmail.com', 'nicholas.miller@museum.org', '1974-10-08', '2023-06-22', '2024-11-04', 57290, 'Security'),
('James Foley', 2, '054-98-9411', '729-237-5849', '08138 Jennifer Unions Suite 453, South Steven, VT 36385', 'whenry@myers.com', 'james.foley@museum.org', '2002-02-23', '2023-11-07', NULL, 64748, 'Custodian'),
('Curtis Johnson', 3, '072-11-5753', '902-913-5786', '3982 Troy Greens Apt. 960, Samuelton, GA 35757', 'tjackson@gmail.com', 'curtis.johnson@museum.org', '1971-03-23', '2024-02-12', NULL, 62009, 'Development'),
('Melissa Martinez', 4, '669-87-5934', '776-218-7888', '860 Corey Hill Apt. 603, West Deborah, MO 32813', 'denise04@gmail.com', 'melissa.martinez@museum.org', '1980-11-13', '2021-12-03', NULL, 54794, 'Educator'),
('Melissa Boyd', 2, '857-73-9498', '717-879-1995', '0170 Sanchez Glen, Lake Peter, TX 29589', 'derekbrown@hotmail.com', 'melissa.boyd@museum.org', '1990-05-04', '2010-09-28', '2015-03-24', 51078, 'Curator'),
('Ashley Stokes', 5, '751-53-2768', '760-702-4561', '479 Candice Oval Apt. 883, New Dennis, NC 93376', 'jamesmarshall@hotmail.com', 'ashley.stokes@museum.org', '1990-08-14', '2021-07-06', NULL, 59282, 'Custodian'),
('Christopher Hill', 1, '498-07-3509', '707-108-0933', '9435 Elizabeth Turnpike Suite 224, North Audreyton, NM 10252', 'hartmike@davis.com', 'christopher.hill@museum.org', '1998-04-12', '2010-12-29', '2011-02-10', 60679, 'Curator'),
('Sean Serrano', 2, '811-74-8409', '921-363-3045', '211 Luis Heights, East Matthew, KS 39544', 'frenchjoshua@williams-martin.com', 'sean.serrano@museum.org', '1969-08-27', '2010-10-10', '2013-05-17', 41029, 'Development'),
('Angela Lyons', 1, '571-08-7240', '862-354-1534', '053 Mcdonald Motorway Suite 325, Port Timothy, KS 78881', 'hornematthew@smith-taylor.com', 'angela.lyons@museum.org', '1969-08-16', '2021-05-24', NULL, 49125, 'Retail');