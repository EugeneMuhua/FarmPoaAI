-- Add sample products for testing the marketplace
-- First, create a sample farmer profile
INSERT INTO public.profiles (user_id, full_name, user_type, location, phone) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'John Mwangi', 'farmer', 'Nairobi, Kenya', '+254700000001'),
  ('00000000-0000-0000-0000-000000000002', 'Mary Wanjiku', 'farmer', 'Kiambu, Kenya', '+254700000002'),
  ('00000000-0000-0000-0000-000000000003', 'Peter Kimani', 'farmer', 'Nakuru, Kenya', '+254700000003');

-- Add sample products
INSERT INTO public.products (
  farmer_id, name, description, price, unit, category, 
  quantity_available, location, harvest_date, is_available
) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Fresh Tomatoes', 'Organic Roma tomatoes, vine-ripened and perfect for cooking', 120.00, 'kg', 'Vegetables', 50, 'Nairobi, Kenya', '2025-01-10', true),
  ('00000000-0000-0000-0000-000000000001', 'Green Kale', 'Fresh organic kale, rich in vitamins and perfect for healthy meals', 80.00, 'bunch', 'Vegetables', 30, 'Nairobi, Kenya', '2025-01-12', true),
  ('00000000-0000-0000-0000-000000000002', 'Sweet Bananas', 'Sweet and ripe bananas, perfect for snacking or baking', 60.00, 'bunch', 'Fruits', 25, 'Kiambu, Kenya', '2025-01-08', true),
  ('00000000-0000-0000-0000-000000000002', 'Avocados', 'Premium Hass avocados, creamy and delicious', 15.00, 'piece', 'Fruits', 100, 'Kiambu, Kenya', '2025-01-11', true),
  ('00000000-0000-0000-0000-000000000003', 'White Maize', 'High-quality white maize, perfect for ugali and other dishes', 45.00, 'kg', 'Grains', 200, 'Nakuru, Kenya', '2024-12-15', true),
  ('00000000-0000-0000-0000-000000000003', 'French Beans', 'Fresh, crispy French beans ideal for cooking', 150.00, 'kg', 'Vegetables', 40, 'Nakuru, Kenya', '2025-01-09', true),
  ('00000000-0000-0000-0000-000000000001', 'Fresh Spinach', 'Organic spinach leaves, freshly harvested', 70.00, 'bunch', 'Vegetables', 35, 'Nairobi, Kenya', '2025-01-13', true),
  ('00000000-0000-0000-0000-000000000002', 'Orange Mangoes', 'Juicy Kent mangoes, sweet and tropical', 25.00, 'piece', 'Fruits', 80, 'Kiambu, Kenya', '2025-01-05', true);