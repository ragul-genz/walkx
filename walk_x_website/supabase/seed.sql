-- ==============================================================================
-- WalkX Platform — Initial Seed Data
-- ==============================================================================
-- Seeds initial verified rewards catalog & social causes
-- ==============================================================================

-- 1. SEED REWARDS CATALOG
insert into public.rewards (id, title, points_cost, inr_value, icon, description, category, stock_count, unlocked, partner_brand)
values
  ('rw_amazon_500', '₹500 Amazon Pay Gift Card', 45000, 500, '🎁', 'Redeemable for any purchase on Amazon India. Digital code delivered instantly.', 'shopping', 150, true, 'Amazon Pay India'),
  ('rw_boat_earbuds', 'boAt Airdopes 141 ANC', 85000, 1499, '🎧', 'True wireless earbuds with 42H playtime, ENx noise cancellation, and IPX4 rating.', 'electronics', 40, true, 'boAt Lifestyle'),
  ('rw_cult_pass', '1-Month Cult.fit Pass', 65000, 999, '💪', 'Unlimited access to Cult group workouts, yoga classes, and premium strength gyms across India.', 'fitness', 75, true, 'Cult.fit'),
  ('rw_starbucks_300', '₹300 Starbucks Coffee Card', 27000, 300, '☕', 'Enjoy hand-crafted coffees, frappuccinos, and bakery items at any Starbucks India outlet.', 'giftcard', 120, true, 'Starbucks India'),
  ('rw_decathlon_1000', '₹1,000 Decathlon Sports Voucher', 90000, 1000, '👟', 'Valid on all athletic footwear, running gear, outdoor hiking apparel, and fitness accessories.', 'shopping', 50, true, 'Decathlon India'),
  ('rw_upi_cash_550', '₹550 Instant Direct UPI Cash', 50000, 550, '⚡', 'Direct credit to your linked UPI VPA (Google Pay, PhonePe, Paytm). Fully verified settlement.', 'cash', 500, true, 'WalkX Financial Reserve')
on conflict (id) do nothing;

-- 2. SEED SOCIAL CAUSES
insert into public.donation_causes (
  id, title, tagline, description, category, image_url, icon,
  organization_name, organization_type, organization_location,
  registration_number, target_amount, raised_amount, donors_count, verified_partner, is_active
) values
  (
    'cs_edu_rural',
    'Rural Girl Child STEM Education',
    'Providing laptops, digital lab kits, and code coaching to girls in government schools.',
    'Equips underserved rural schoolgirls across 14 districts with STEM kits, verified digital literacy workshops, and after-school mentorship.',
    'Education',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    '📚',
    'Vidya Shiksha Foundation (Sample)',
    'Registered Section 8 Non-Profit (Sample)',
    'Tamil Nadu, India',
    'SAMPLE-NGO-TN-2024-001',
    50000,
    18750,
    142,
    'Tamil Nadu Rural Development Trust',
    true
  ),
  (
    'cs_health_dialysis',
    'Subsidized Dialysis & Kidney Care',
    'Covering critical weekly dialysis sessions for low-income daily-wage laborers.',
    'Provides life-saving hemodialysis and kidney care medications to marginalized families who cannot afford private clinical treatments.',
    'Healthcare',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    '🏥',
    'Jeevan Care Health Trust (Sample)',
    'Public Charitable Medical Trust (Sample)',
    'Karnataka & Kerala, India',
    'SAMPLE-MED-KA-2023-089',
    75000,
    42300,
    318,
    'National Kidney Health Council',
    true
  ),
  (
    'cs_food_nourish',
    'Daily Warm Meals for Street Children',
    'Delivering balanced hygienic nutrition packs to children in urban transit slums.',
    'Distributes freshly cooked, nutritionally fortified lunches and fruit rations to street-dwelling children and homeless elder citizens.',
    'Food support',
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80',
    '🍲',
    'Annapurna Feeding Network (Sample)',
    'Registered Society NGO (Sample)',
    'Maharashtra & Delhi NCR, India',
    'SAMPLE-FOD-DL-2022-441',
    40000,
    31400,
    285,
    'All-India Food Relief Alliance',
    true
  ),
  (
    'cs_env_mangroves',
    'Coastal Mangrove & Miyawaki Forest',
    'Restoring vulnerable coastal wetlands with 10,000 salt-tolerant mangrove saplings.',
    'Prevents coastal erosion, mitigates cyclone tidal impacts, and restores biodiversity habitats through community-monitored bio-shields.',
    'Environment',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    '🌱',
    'Green Earth Bio Trust (Sample)',
    'Environmental Protection Society (Sample)',
    'West Bengal & Odisha, India',
    'SAMPLE-ENV-WB-2021-902',
    60000,
    24600,
    197,
    'Bay of Bengal Coastal Conservation',
    true
  )
on conflict (id) do nothing;
