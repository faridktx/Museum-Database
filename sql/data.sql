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
  ('Artifact Collection Mug', 'Ceramic mug featuring famous artifacts', 100, 18.99, 'Home'),
  ('2024 Museum Calendar', 'Wall calendar featuring 12 famous artworks', 100, 15.99, 'Home'),
  ('Mini Sculpture Replica', 'High-quality replica of famous sculpture', 100, 49.99, 'Collectibles'),
  ('Museum Collection Notebook', 'Hardcover notebook with museum designs', 100, 14.99, 'Stationery'),
  ('Museum Logo T-Shirt', 'Cotton t-shirt with embroidered museum logo', 100, 22.99, 'Apparel'),
  ('Masterpiece Puzzle (1000 pc)', '1000 piece puzzle of famous artwork', 100, 27.99, 'Games');

INSERT INTO railway.artists (artist_name, birth_date, death_date, nationality) VALUES
('Leonardo da Vinci', '1452-04-15', '1519-05-02', 'Italian'),
('Frida Kahlo', '1907-07-06', '1954-07-13', 'Mexican'),
('Pablo Picasso', '1881-10-25', '1973-04-08', 'Spanish'),
('Vincent van Gogh', '1853-03-30', '1890-07-29', 'Dutch'),
('Claude Monet', '1840-11-14', '1926-12-05', 'French'),
('Andy Warhol', '1928-08-06', '1987-02-22', 'American'),
('Georgia O’Keeffe', '1887-11-15', '1986-03-06', 'American'),
('Yayoi Kusama', '1929-03-22', NULL, 'Japanese'),
('Banksy', NULL, NULL, 'British'),
('Takashi Murakami', '1962-02-01', NULL, 'Japanese'),
('Ai Weiwei', '1957-08-28', NULL, 'Chinese'),
('Jean-Michel Basquiat', '1960-12-22', '1988-08-12', 'American'),
('Zarina Hashmi', '1937-07-16', '2020-04-25', 'Indian'),
('Emily Kame Kngwarreye', '1910-11-01', '1996-09-02', 'Australian'),
('Kara Walker', '1969-11-26', NULL, 'American');

INSERT INTO railway.artifacts (
    artifact_name, exhibit_id, artist_id, description,
    created_date, value, acquisition_type, acquisition_date
) VALUES
('Mona Lisa', 1, 1, 'Iconic portrait by Leonardo da Vinci', '1503-01-01', 800000000, 'donation', '2005-06-10'),
('The Two Fridas', 1, 2, 'Dual self-portrait by Frida Kahlo', '1939-01-01', 5000000, 'purchase', '2010-04-18'),
('Guernica', 2, 3, 'Anti-war mural by Picasso', '1937-06-01', 200000000, 'donation', '2008-11-05'),
('Starry Night', 2, 4, 'Post-impressionist night sky scene', '1889-06-01', 100000000, 'purchase', '2012-03-25'),
('Water Lilies', 3, 5, 'Impressionist painting of water', '1916-01-01', 70000000, 'donation', '2009-01-10'),
('Campbells Soup Cans', 1, 6, 'Pop art series by Warhol', '1962-01-01', 30000000, 'purchase', '2013-07-08'),
('Black Iris III', 3, 7, 'Floral abstraction by OKeeffe', '1926-01-01', 25000000, 'donation', '2015-02-20'),
('Infinity Mirror Room', 1, 8, 'Installation of mirrors and lights', '1965-01-01', 15000000, 'purchase', '2017-10-04'),
('Girl with Balloon', 2, 9, 'Iconic stencil graffiti by Banksy', '2002-01-01', 1400000, 'donation', '2018-06-16'),
('Superflat Flowers', 3, 10, 'Colorful pop piece by Murakami', '2001-01-01', 5000000, 'purchase', '2014-05-11'),
('Sunflower Seeds', 1, 11, 'Installation using porcelain seeds', '2010-01-01', 7000000, 'donation', '2020-08-01'),
('Untitled', 2, 12, 'Neo-expressionist work by Basquiat', '1982-01-01', 90000000, 'purchase', '2011-09-15'),
('Paper House', 3, 13, 'Minimalist printwork by Zarina', '1980-01-01', 300000, 'donation', '2016-12-20'),
('Awelye', 2, 14, 'Aboriginal painting by Kngwarreye', '1994-01-01', 1000000, 'purchase', '2019-04-02'),
('Gone: An Historical Romance', 1, 15, 'Silhouette art by Kara Walker', '1994-01-01', 2000000, 'donation', '2021-01-30');

INSERT INTO railway.employees (
  employee_name, exhibit_id, ssn, phone_number, address,
  personal_email, work_email, birth_date, hiring_date,
  fired_date, salary, role
) VALUES
('Alice Monroe', 1, '123-45-6789', '555-123-4567', '101 Art Ln, Austin, TX',
 'alice@example.com', 'a.monroe@museum.org', '1985-05-10', '2015-06-01', NULL, 55000, 'Curator'),

('Brian Kim', 2, '234-56-7890', '555-234-5678', '202 Exhibit Ave, Dallas, TX',
 'brian@example.com', 'b.kim@museum.org', '1990-08-22', '2018-09-15', NULL, 48000, 'Docent'),

('Chloe Zhang', 3, '345-67-8901', '555-345-6789', '303 Gallery St, Houston, TX',
 'chloe@example.com', 'c.zhang@museum.org', '1992-12-03', '2019-01-10', NULL, 47000, 'Archivist'),

('David Lee', 1, '456-78-9012', '555-456-7890', '404 Canvas Rd, El Paso, TX',
 'david@example.com', 'd.lee@museum.org', '1980-03-14', '2010-05-20', '2023-02-01', 60000, 'Director'),

('Eva Tran', 2, '567-89-0123', '555-567-8901', '505 Frame Dr, San Antonio, TX',
 'eva@example.com', 'e.tran@museum.org', '1987-07-19', '2016-08-01', NULL, 52000, 'Registrar'),

('Frank Novak', 3, '678-90-1234', '555-678-9012', '606 Exhibit Blvd, Austin, TX',
 'frank@example.com', 'f.novak@museum.org', '1975-10-30', '2005-03-11', '2020-12-15', 63000, 'Security'),

('Grace Liu', 1, '789-01-2345', '555-789-0123', '707 Sculpture Way, Plano, TX',
 'grace@example.com', 'g.liu@museum.org', '1993-11-06', '2021-02-28', NULL, 46000, 'Educator'),

('Henry Patel', 2, '890-12-3456', '555-890-1234', '808 Art St, Lubbock, TX',
 'henry@example.com', 'h.patel@museum.org', '1988-06-25', '2017-04-19', NULL, 50000, 'Technician'),

('Isla Torres', 3, '901-23-4567', '555-901-2345', '909 Archive Rd, Irving, TX',
 'isla@example.com', 'i.torres@museum.org', '1991-01-17', '2020-07-07', NULL, 49000, 'Assistant'),

('Jack Murphy', 1, '012-34-5678', '555-012-3456', '111 Museum Cir, Houston, TX',
 'jack@example.com', 'j.murphy@museum.org', '1983-04-11', '2009-06-30', '2022-09-30', 58000, 'Manager'),

('Karen Adams', 2, '135-79-2468', '555-135-2468', '121 Exhibit Park, Austin, TX',
 'karen@example.com', 'k.adams@museum.org', '1995-02-28', '2022-01-05', NULL, 44000, 'Guide'),

('Leo Baker', 3, '246-80-1357', '555-246-1357', '131 Canvas Trail, Tyler, TX',
 'leo@example.com', 'l.baker@museum.org', '1989-09-09', '2011-10-01', NULL, 51000, 'Curator'),

('Mia Flores', 1, '357-91-4680', '555-357-4680', '141 Frame Square, Houston, TX',
 'mia@example.com', 'm.flores@museum.org', '1996-12-21', '2023-05-10', NULL, 42000, 'Intern'),

('Noah Reed', 2, '468-02-5791', '555-468-5791', '151 Sculpture Ln, Austin, TX',
 'noah@example.com', 'n.reed@museum.org', '1984-07-15', '2012-11-23', NULL, 54000, 'Technician'),

('Olivia Grant', 3, '579-13-6802', '555-579-6802', '161 Archive Path, Dallas, TX',
 'olivia@example.com', 'o.grant@museum.org', '1990-10-01', '2014-03-03', NULL, 53000, 'Archivist');
