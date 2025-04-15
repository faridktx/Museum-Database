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