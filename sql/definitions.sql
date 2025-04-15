DROP TABLE IF EXISTS railway.artifacts;
DROP TABLE IF EXISTS railway.artists;
DROP TABLE IF EXISTS railway.exhibits;
DROP TABLE IF EXISTS railway.employees;
DROP TABLE IF EXISTS railway.gift_shop_inventory;
DROP TABLE IF EXISTS railway.gift_shop_sales;
DROP TABLE IF EXISTS railway.guests;
DROP TABLE IF EXISTS railway.users;
DROP TABLE IF EXISTS railway.tickets;
DROP TABLE IF EXISTS railway.membership_types;
DROP TABLE IF EXISTS railway.ticket_types;

CREATE TABLE railway.artists (
    artist_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    artist_name VARCHAR(25) NOT NULL,
    birth_date DATE NULL,
    death_date DATE NULL,
    nationality VARCHAR(25) NOT NULL
);
CREATE TABLE railway.exhibits (
    exhibit_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    exhibit_name VARCHAR(50) NOT NULL,
    description VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE
);
CREATE TABLE railway.artifacts (
    artifact_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    artist_id SMALLINT UNSIGNED NOT NULL,
    exhibit_id INT UNSIGNED NOT NULL,
    description VARCHAR(100),
    created_date DATE,
    value INT NOT NULL,
    acquisition_type VARCHAR(10) NOT NULL,
    acquisition_date DATE NOT NULL,

    FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (exhibit_ID) REFERENCES exhibits(exhibit_id) ON DELETE CASCADE
);
CREATE TABLE railway.employees (
    employee_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(25) NOT NULL,
    exhibit_id INT UNSIGNED NOT NULL,
    ssn CHAR(11) NOT NULL,
    phone_number CHAR(12) NOT NULL,
    address VARCHAR(100) NOT NULL,
    personal_email VARCHAR(100) NOT NULL, 
    work_email VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    hiring_date DATE NOT NULL,
    fired_date DATE,
    salary INT NOT NULL,
    role VARCHAR(15),

    FOREIGN KEY (exhibit_id) REFERENCES exhibits(exhibit_id) ON DELETE CASCADE
);
CREATE TABLE railway.guests (
    guest_id VARCHAR(250) NOT NULL PRIMARY KEY,
    membership_type VARCHAR(30),
    paid_date DATE
);
CREATE TABLE railway.gift_shop_inventory (
    item_id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(50) NOT NULL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    quantity SMALLINT NOT NULL,
    unit_price FLOAT NOT NULL
);
CREATE TABLE railway.gift_shop_sales (
    sale_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    item_id SMALLINT UNSIGNED NOT NULL,
    guest_id VARCHAR(250) NOT NULL,
    sale_date DATE NOT NULL,
    quantity INT NOT NULL,
    total_cost INT NOT NULL,

    FOREIGN KEY (item_id) REFERENCES gift_shop_inventory(item_id) ON DELETE CASCADE,
    FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);
CREATE TABLE railway.users (
    user_id VARCHAR(250) NOT NULL PRIMARY KEY,
    email VARCHAR(100),
    phone_number CHAR(12),
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role VARCHAR(20) NOT NULL
);
CREATE TABLE railway.tickets (
    ticket_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    guest_id VARCHAR(250) NOT NULL,
    purchase_date DATE NOT NULL,
    ticket_type VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (guest_id) REFERENCES guests(guest_id) ON DELETE CASCADE
);
CREATE TABLE railway.membership_types (
    membership_type VARCHAR(30) NOT NULL PRIMARY KEY,
    period VARCHAR(5) NOT NULL,
    price INT NOT NULL,
    ticket_discount INT NOT NULL,
    exhibit_discount INT NOT NULL,
    giftshop_discount INT NOT NULL,
    benefits VARCHAR(500) NOT NULL
);
CREATE TABLE railway.ticket_types (
    ticket_type VARCHAR(20) NOT NULL PRIMARY KEY,
    price INT NOT NULL
);