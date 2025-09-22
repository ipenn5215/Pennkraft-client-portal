-- Simple seed script for Pennkraft database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/editor

-- Step 1: Create or get a tenant
-- First check if you have a tenants table and create a tenant if needed
INSERT INTO tenants (name, slug, settings)
VALUES ('Pennkraft Estimating', 'pennkraft', '{}')
ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- If the above doesn't work (no tenants table), skip it and use a fixed UUID
-- You can replace this with your actual tenant_id if you know it
-- For now, let's use: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

-- Step 2: Disable RLS temporarily
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE estimates DISABLE ROW LEVEL SECURITY;
ALTER TABLE line_items DISABLE ROW LEVEL SECURITY;

-- Step 3: Insert Clients
-- IMPORTANT: Replace the tenant_id value with your actual tenant ID
INSERT INTO clients (tenant_id, name, email, phone, address) VALUES
-- Use the ID from step 1 or replace with your tenant_id
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Smith Construction Co.', 'john@smithconstruction.com', '555-0101', '123 Main St, Dallas, TX 75201'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Garcia Properties LLC', 'maria@garciaproperties.com', '555-0102', '456 Oak Ave, Houston, TX 77002'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Johnson Development Group', 'robert@johnsondev.com', '555-0103', '789 Pine Blvd, Austin, TX 78701'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Williams Home Builders', 'sarah@williamshomes.com', '555-0104', '321 Elm Street, San Antonio, TX 78205'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chen Commercial Real Estate', 'michael@chencre.com', '555-0105', '654 Cedar Lane, Fort Worth, TX 76102')
ON CONFLICT (email) DO NOTHING;

-- Step 4: Insert Materials (without tenant_id if not required)
INSERT INTO materials (name, unit, cost, category, description) VALUES
-- Painting Materials
('Premium Interior Paint', 'gallon', 35.00, 'Paint', 'High-quality interior latex paint'),
('Exterior Paint', 'gallon', 45.00, 'Paint', 'Weather-resistant exterior paint'),
('Primer', 'gallon', 25.00, 'Paint', 'Multi-surface primer'),
('Paint Brush Set', 'set', 25.00, 'Paint Supplies', 'Professional brush set'),
('Roller Set', 'set', 15.00, 'Paint Supplies', '9-inch roller with covers'),
-- Tile Materials
('Ceramic Tile 12x12', 'sq ft', 2.50, 'Tile', 'Standard ceramic floor tile'),
('Porcelain Tile 24x24', 'sq ft', 4.50, 'Tile', 'Large format porcelain tile'),
('Subway Tile 3x6', 'sq ft', 8.00, 'Tile', 'Classic white subway tile'),
('Tile Adhesive', 'bag', 15.00, 'Tile Supplies', '50lb modified thinset'),
('Grout', 'bag', 18.00, 'Tile Supplies', '25lb sanded grout'),
-- Drywall Materials
('Drywall Sheet 4x8', 'sheet', 12.00, 'Drywall', '1/2 inch regular drywall'),
('Moisture Resistant Drywall', 'sheet', 15.00, 'Drywall', '1/2 inch green board'),
('Joint Compound', 'bucket', 15.00, 'Drywall Supplies', '5 gallon all-purpose'),
('Drywall Tape', 'roll', 6.00, 'Drywall Supplies', '500ft paper tape'),
-- Glass Materials
('Tempered Glass 1/4"', 'sq ft', 12.00, 'Glass', 'Clear tempered safety glass'),
('Shower Door Glass', 'sq ft', 18.00, 'Glass', 'Clear tempered shower glass'),
('Mirror', 'sq ft', 8.00, 'Glass', '1/4 inch silvered mirror'),
-- Flooring Materials
('Hardwood Flooring', 'sq ft', 5.50, 'Flooring', 'Oak hardwood planks'),
('Laminate Flooring', 'sq ft', 2.25, 'Flooring', 'Wood-look laminate'),
('Vinyl Plank Flooring', 'sq ft', 3.50, 'Flooring', 'Luxury vinyl plank')
ON CONFLICT DO NOTHING;

-- Step 5: Insert Labor Rates
INSERT INTO labor_rates (trade, rate_type, rate, description) VALUES
('Painter - Journeyman', 'hourly', 45.00, 'Experienced painter'),
('Painter - Master', 'hourly', 65.00, 'Master painter with 10+ years'),
('Tile Installer', 'hourly', 55.00, 'Experienced tile setter'),
('Drywall Hanger', 'hourly', 50.00, 'Drywall installation specialist'),
('Glazier', 'hourly', 60.00, 'Glass installation specialist'),
('Flooring Installer', 'hourly', 50.00, 'Flooring specialist'),
('General Laborer', 'hourly', 20.00, 'General construction helper'),
('Foreman', 'hourly', 75.00, 'Job site supervisor')
ON CONFLICT DO NOTHING;

-- Step 6: Re-enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- Step 7: Show results
SELECT 'Seeding Complete!' as status;
SELECT COUNT(*) as client_count FROM clients;
SELECT COUNT(*) as material_count FROM materials;
SELECT COUNT(*) as labor_rate_count FROM labor_rates;