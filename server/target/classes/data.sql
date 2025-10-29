-- Seed categories
INSERT INTO categories (id, name, description) VALUES
  (1, 'Entrée', 'Starters and small plates'),
  (2, 'Main & Soup', 'Hearty dishes and soups'),
  (3, 'Deep Fried Chicken', 'Crispy Korean chicken'),
  (4, 'Side Menu', 'Sides and staples'),
  (5, 'BBQ Range', 'Grill-ready classics');

-- Seed menu items
INSERT INTO menu_items (name, description, price, category_id) VALUES
  ('Kimchi Pancake', 'Crispy pancake with kimchi', 14.00, 1),
  ('Seafood Pancake', 'Scallion pancake with assorted seafood', 16.00, 1),
  ('Japchae', 'Glass noodles with vegetables', 13.00, 1),

  ('Kimchi Jjigae', 'Stew with aged kimchi, tofu, pork', 16.00, 2),
  ('Doenjang Jjigae', 'Soybean paste stew with tofu and veg', 15.00, 2),
  ('Bibimbap', 'Rice with assorted toppings and gochujang', 17.00, 2),

  ('Original Fried Chicken', 'Classic crispy fried chicken', 22.00, 3),
  ('Yangnyeom', 'Sweet & spicy sauced chicken', 24.00, 3),
  ('Soy Garlic', 'Savory soy garlic glaze', 24.00, 3),

  ('Steamed Rice', 'Short-grain rice', 3.00, 4),
  ('Kimchi', 'House-made napa kimchi', 4.00, 4),
  ('Banchan Refill', 'Seasonal side dishes refill', 5.00, 4),

  ('Galbi', 'Marinated beef short ribs', 28.00, 5),
  ('Bulgogi', 'Marinated thin-sliced beef', 22.00, 5),
  ('Samgyeopsal', 'Pork belly for grilling', 20.00, 5);

-- Seed platters
INSERT INTO platters (name, description, price) VALUES
  ('Platter A (Beef Lovers)', 'Galbi, Bulgogi, Brisket, banchan', 89.00),
  ('Platter B (Pork & Beef)', 'Pork Belly, Bulgogi, Spicy Pork', 79.00),
  ('Platter C (Sea & Land)', 'Beef, prawns, squid, salad', 85.00),
  ('Platter D (Chef''s Choice)', 'Daily premium selection', 98.00),
  ('Platter E (Family Set)', 'Beef, pork, chicken, rice & soup', 99.00);


