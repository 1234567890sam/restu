-- ==========================================================
-- QR Digital Menu SaaS — Solapur Restaurant Sample Seed Data
-- ==========================================================

-- 1. Insert Demo Restaurant
INSERT INTO public.restaurants (
    id,
    owner_id,
    name,
    slug,
    tagline,
    description,
    phone,
    email,
    address,
    city,
    state,
    postal_code,
    country,
    currency,
    theme_color,
    secondary_color,
    template,
    opening_hours,
    is_active,
    subscription_plan,
    subscription_status
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'Hotel Panchratna Executive',
    'hotel-panchratna',
    'Authentic Solapuri Flavours & Royal Dining',
    'Serving Solapur authentic Maharashtrian delicacies, spicy mutton sukka, jawar bhakri, and exquisite North Indian & Tandoor dishes since 1998.',
    '+91 98220 12345',
    'contact@panchratnasolapur.com',
    'Opposite Old Pune Naka, Near Saat Rasta',
    'Solapur',
    'Maharashtra',
    '413003',
    'India',
    'INR',
    '#ea580c',
    '#0f172a',
    'classic',
    '11:00 AM - 11:30 PM (Daily)',
    true,
    'pro',
    'active'
) ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Categories for Hotel Panchratna
INSERT INTO public.categories (id, restaurant_id, name, description, icon, sort_order, is_active) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Solapuri Specialties', 'Famous local dishes made with authentic groundnut chutney & spices', 'Flame', 0, true),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Tandoori Starters', 'Charcoal smoked skewers and hot appetizers', 'Utensils', 1, true),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Main Course (Veg)', 'Rich paneer curries, dal tadka, and seasonal vegetables', 'Salad', 2, true),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Main Course (Non-Veg)', 'Tender mutton rassa, chicken handi, and coastal curries', 'Soup', 3, true),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Breads & Bhakri', 'Hot tandoor naans, rotis, and traditional Solapuri Jowar Bhakri', 'Pizza', 4, true),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Desserts & Beverages', 'Gulab jamun, matka kulfi, and chilled masala buttermilk', 'Coffee', 5, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Menu Items
INSERT INTO public.menu_items (
    restaurant_id,
    category_id,
    name,
    description,
    price,
    offer_price,
    food_type,
    spice_level,
    badge,
    sort_order,
    is_available
) VALUES
-- Solapuri Specialties
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Solapuri Shenga Chutney & Kadak Bhakri Thali', 'Crunchy roasted groundnut garlic chutney served with hot Jowar bhakri, thecha, raw onion, and fresh butter.', 180, 200, 'veg', 'spicy', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Solapuri Mutton Sukka', 'Slow-cooked tender goat meat tossed in spicy black masala roasted dry coconut paste.', 380, NULL, 'non-veg', 'extra_spicy', 'chef_special', 1, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Tambada Pandhra Rassa Bowl', 'Signature Kolhapuri & Solapuri red fiery broth and soothing white coconut almond soup.', 140, NULL, 'non-veg', 'spicy', 'must_try', 2, true),

-- Tandoori Starters
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'Paneer Tikka Angara', 'Fresh cottage cheese cubes marinated in Kashmiri chili yogurt and roasted over hot charcoal.', 260, 290, 'veg', 'medium', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Murgh Malai Kebab', 'Melt-in-mouth boneless chicken tenders marinated in cardamom, cashew paste, and fresh cream.', 320, NULL, 'non-veg', 'mild', 'chef_special', 1, true),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Crispy Corn Salt & Pepper', 'Sweet golden corn kernels tossed with crushed pepper, spring onions, and garlic.', 210, NULL, 'veg', 'mild', 'none', 2, true),

-- Main Course Veg
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Paneer Butter Masala', 'Soft cottage cheese simmered in a silky tomato gravy with rich butter and fenugreek leaves.', 270, 300, 'veg', 'medium', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Dal Tadka Dhaba Style', 'Yellow lentils tempered with ghee, cumin seeds, garlic, and dried red chilies.', 190, NULL, 'veg', 'mild', 'none', 1, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000003', 'Veg Kolhapuri Teekha', 'Assorted garden vegetables cooked in spicy red gravy infused with authentic Maharashtrian spices.', 240, NULL, 'veg', 'extra_spicy', 'must_try', 2, true),

-- Main Course Non-Veg
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Butter Chicken Delhi Style', 'Tandoor roasted chicken simmered in a velvety tomato makhani gravy enriched with fresh cream.', 340, 370, 'non-veg', 'mild', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000004', 'Mutton Handi Special', 'Traditional clay pot simmered goat curry with deep roasted whole spices.', 420, NULL, 'non-veg', 'spicy', 'chef_special', 1, true),

-- Breads
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Jowar Bhakri (2 Pcs)', 'Freshly patted warm sorghum bread, a staple of Solapur households.', 40, NULL, 'veg', 'mild', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000005', 'Butter Garlic Naan', 'Clay-oven leavened bread brushed with garlic butter and fresh coriander.', 65, NULL, 'veg', 'mild', 'none', 1, true),

-- Desserts & Beverages
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Solapuri Masala Chaas (Chilled)', 'Refreshing spiced buttermilk tempered with roasted cumin, mint, and rock salt.', 50, NULL, 'veg', 'mild', 'bestseller', 0, true),
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000006', 'Gulab Jamun with Rabdi', 'Golden fried khoya dumplings soaked in saffron syrup served over thick chilled rabdi.', 120, NULL, 'veg', 'mild', 'must_try', 1, true)
ON CONFLICT DO NOTHING;
