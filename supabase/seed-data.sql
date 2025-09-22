-- Seed data for Pennkraft database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/editor

-- Temporarily disable RLS for seeding (if needed)
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE estimates DISABLE ROW LEVEL SECURITY;
ALTER TABLE line_items DISABLE ROW LEVEL SECURITY;

-- Clear existing data (optional)
DELETE FROM line_items WHERE id IS NOT NULL;
DELETE FROM estimates WHERE id IS NOT NULL;
DELETE FROM projects WHERE id IS NOT NULL;
DELETE FROM materials WHERE id IS NOT NULL;
DELETE FROM labor_rates WHERE id IS NOT NULL;
DELETE FROM clients WHERE id IS NOT NULL;

-- 1. Insert Clients
INSERT INTO clients (name, email, phone, address) VALUES
('Smith Construction Co.', 'john@smithconstruction.com', '555-0101', '123 Main St, Dallas, TX 75201'),
('Garcia Properties LLC', 'maria@garciaproperties.com', '555-0102', '456 Oak Ave, Houston, TX 77002'),
('Johnson Development Group', 'robert@johnsondev.com', '555-0103', '789 Pine Blvd, Austin, TX 78701'),
('Williams Home Builders', 'sarah@williamshomes.com', '555-0104', '321 Elm Street, San Antonio, TX 78205'),
('Chen Commercial Real Estate', 'michael@chencre.com', '555-0105', '654 Cedar Lane, Fort Worth, TX 76102'),
('Anderson Renovations', 'david@andersonreno.com', '555-0106', '987 Maple Drive, Plano, TX 75074'),
('Thompson Contracting', 'lisa@thompsoncontract.com', '555-0107', '246 Oak Park, Arlington, TX 76010'),
('Martinez Custom Homes', 'carlos@martinezhomes.com', '555-0108', '135 Pine Ridge, Irving, TX 75061');

-- 2. Insert Materials
INSERT INTO materials (name, unit, cost, category, description) VALUES
-- Painting Materials
('Premium Interior Paint', 'gallon', 35.00, 'Paint', 'High-quality interior latex paint'),
('Exterior Paint', 'gallon', 45.00, 'Paint', 'Weather-resistant exterior paint'),
('Primer', 'gallon', 25.00, 'Paint', 'Multi-surface primer'),
('Paint Brush Set', 'set', 25.00, 'Paint Supplies', 'Professional brush set'),
('Roller Set', 'set', 15.00, 'Paint Supplies', '9-inch roller with covers'),
('Drop Cloth', 'each', 12.00, 'Paint Supplies', '9x12 canvas drop cloth'),
('Painters Tape', 'roll', 6.00, 'Paint Supplies', '2-inch blue tape'),
('Paint Tray', 'each', 5.00, 'Paint Supplies', 'Plastic paint tray'),
('Texture Spray', 'can', 8.00, 'Paint', 'Knockdown texture spray'),

-- Tile Materials
('Ceramic Tile 12x12', 'sq ft', 2.50, 'Tile', 'Standard ceramic floor tile'),
('Porcelain Tile 24x24', 'sq ft', 4.50, 'Tile', 'Large format porcelain tile'),
('Subway Tile 3x6', 'sq ft', 8.00, 'Tile', 'Classic white subway tile'),
('Mosaic Tile', 'sq ft', 12.00, 'Tile', 'Glass mosaic accent tile'),
('Natural Stone Tile', 'sq ft', 15.00, 'Tile', 'Travertine natural stone'),
('Tile Adhesive', 'bag', 15.00, 'Tile Supplies', '50lb modified thinset'),
('Grout', 'bag', 18.00, 'Tile Supplies', '25lb sanded grout'),
('Tile Spacers', 'bag', 5.00, 'Tile Supplies', '1/4 inch spacers (100 pack)'),
('Grout Sealer', 'bottle', 25.00, 'Tile Supplies', 'Penetrating grout sealer'),
('Tile Edge Trim', 'piece', 8.00, 'Tile Supplies', 'Metal edge trim 8ft'),

-- Drywall Materials
('Drywall Sheet 4x8 1/2"', 'sheet', 12.00, 'Drywall', '1/2 inch regular drywall'),
('Drywall Sheet 4x8 5/8"', 'sheet', 14.00, 'Drywall', '5/8 inch regular drywall'),
('Moisture Resistant Drywall', 'sheet', 15.00, 'Drywall', '1/2 inch green board'),
('Fire Rated Drywall', 'sheet', 18.00, 'Drywall', '5/8 inch Type X'),
('Cement Board', 'sheet', 22.00, 'Drywall', '1/2 inch cement board'),
('Joint Compound', 'bucket', 15.00, 'Drywall Supplies', '5 gallon all-purpose'),
('Drywall Tape', 'roll', 6.00, 'Drywall Supplies', '500ft paper tape'),
('Mesh Tape', 'roll', 8.00, 'Drywall Supplies', '300ft fiberglass mesh'),
('Drywall Screws 1-5/8"', 'box', 8.00, 'Drywall Supplies', '1-5/8 inch (1000 count)'),
('Corner Bead', 'piece', 4.00, 'Drywall Supplies', 'Metal corner bead 10ft'),

-- Glass Materials
('Tempered Glass 1/4"', 'sq ft', 12.00, 'Glass', 'Clear tempered safety glass'),
('Tempered Glass 3/8"', 'sq ft', 16.00, 'Glass', '3/8 inch tempered glass'),
('Shower Door Glass 3/8"', 'sq ft', 18.00, 'Glass', 'Clear tempered shower glass'),
('Frosted Glass', 'sq ft', 20.00, 'Glass', 'Frosted privacy glass'),
('Mirror 1/4"', 'sq ft', 8.00, 'Glass', '1/4 inch silvered mirror'),
('Glass Clips', 'pack', 12.00, 'Glass Hardware', 'Chrome clips (4 pack)'),
('Shower Door Hardware', 'set', 150.00, 'Glass Hardware', 'Complete hardware kit'),
('Mirror Adhesive', 'tube', 8.00, 'Glass Hardware', 'Mirror mastic adhesive'),
('Glass Silicone', 'tube', 6.00, 'Glass Hardware', 'Clear silicone sealant'),

-- Flooring Materials
('Hardwood Flooring Oak', 'sq ft', 5.50, 'Flooring', 'Oak hardwood planks'),
('Engineered Hardwood', 'sq ft', 4.25, 'Flooring', 'Engineered wood flooring'),
('Laminate Flooring', 'sq ft', 2.25, 'Flooring', 'Wood-look laminate'),
('Vinyl Plank Flooring', 'sq ft', 3.50, 'Flooring', 'Luxury vinyl plank'),
('Carpet', 'sq yd', 25.00, 'Flooring', 'Medium grade carpet'),
('Carpet Pad', 'sq yd', 5.00, 'Flooring', 'Carpet padding'),
('Underlayment', 'sq ft', 0.50, 'Flooring Supplies', 'Foam underlayment'),
('Transition Strips', 'each', 15.00, 'Flooring Supplies', 'Metal transition strip'),
('Floor Adhesive', 'bucket', 45.00, 'Flooring Supplies', 'Flooring adhesive 4 gal'),
('Baseboards', 'lin ft', 3.50, 'Flooring Supplies', 'MDF baseboards');

-- 3. Insert Labor Rates
INSERT INTO labor_rates (trade, rate_type, rate, description) VALUES
('Painter - Journeyman', 'hourly', 45.00, 'Experienced painter'),
('Painter - Master', 'hourly', 65.00, 'Master painter with 10+ years'),
('Painter - Helper', 'hourly', 25.00, 'Painter assistant'),
('Tile Installer', 'hourly', 55.00, 'Experienced tile setter'),
('Tile Helper', 'hourly', 30.00, 'Tile installation assistant'),
('Drywall Hanger', 'hourly', 50.00, 'Drywall installation specialist'),
('Drywall Finisher', 'hourly', 55.00, 'Taping and texture specialist'),
('Glazier', 'hourly', 60.00, 'Glass installation specialist'),
('Flooring Installer - Hardwood', 'hourly', 55.00, 'Hardwood flooring specialist'),
('Flooring Installer - Carpet', 'hourly', 45.00, 'Carpet installation specialist'),
('General Laborer', 'hourly', 20.00, 'General construction helper'),
('Foreman', 'hourly', 75.00, 'Job site supervisor'),
('Project Manager', 'hourly', 95.00, 'Project management and coordination'),
('Estimator', 'hourly', 85.00, 'Cost estimation specialist');

-- Get client IDs for projects (you may need to adjust these based on actual IDs)
WITH client_ids AS (
  SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM clients
  LIMIT 5
)

-- 4. Insert Projects (using the first 5 clients)
INSERT INTO projects (client_id, name, description, status, address, start_date, end_date)
SELECT
  c.id,
  CASE
    WHEN c.row_num = 1 THEN 'Office Building Renovation - Painting'
    WHEN c.row_num = 2 THEN 'Luxury Apartment Complex - Tile Work'
    WHEN c.row_num = 3 THEN 'New Construction - Drywall Installation'
    WHEN c.row_num = 4 THEN 'Custom Home - Master Bath Glass'
    WHEN c.row_num = 5 THEN 'Commercial Plaza - Flooring'
  END as name,
  CASE
    WHEN c.row_num = 1 THEN 'Complete interior painting for 3-story office building'
    WHEN c.row_num = 2 THEN 'Bathroom and kitchen tile installation for 50 units'
    WHEN c.row_num = 3 THEN 'Complete drywall installation for 20 townhomes'
    WHEN c.row_num = 4 THEN 'Frameless shower enclosure and custom mirrors'
    WHEN c.row_num = 5 THEN 'LVP flooring installation for retail spaces'
  END as description,
  CASE
    WHEN c.row_num = 4 THEN 'completed'
    ELSE 'active'
  END as status,
  CASE
    WHEN c.row_num = 1 THEN '1000 Commerce St, Dallas, TX 75201'
    WHEN c.row_num = 2 THEN '2000 Westheimer Rd, Houston, TX 77006'
    WHEN c.row_num = 3 THEN '3000 South Congress, Austin, TX 78704'
    WHEN c.row_num = 4 THEN '4000 Broadway, San Antonio, TX 78209'
    WHEN c.row_num = 5 THEN '5000 7th Street, Fort Worth, TX 76102'
  END as address,
  CASE
    WHEN c.row_num = 1 THEN '2024-02-01'::date
    WHEN c.row_num = 2 THEN '2024-03-01'::date
    WHEN c.row_num = 3 THEN '2024-02-15'::date
    WHEN c.row_num = 4 THEN '2024-01-15'::date
    WHEN c.row_num = 5 THEN '2024-02-01'::date
  END as start_date,
  CASE
    WHEN c.row_num = 1 THEN '2024-03-15'::date
    WHEN c.row_num = 2 THEN '2024-05-30'::date
    WHEN c.row_num = 3 THEN '2024-04-30'::date
    WHEN c.row_num = 4 THEN '2024-01-25'::date
    WHEN c.row_num = 5 THEN '2024-02-28'::date
  END as end_date
FROM client_ids c;

-- 5. Insert Estimates (for the first 3 projects)
WITH project_ids AS (
  SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
  FROM projects
  LIMIT 3
)
INSERT INTO estimates (project_id, estimate_number, status, subtotal, tax_rate, tax_amount, discount_amount, total_amount, valid_until, notes, terms)
SELECT
  p.id,
  'EST-2024-' || LPAD(p.row_num::text, 3, '0') as estimate_number,
  CASE
    WHEN p.row_num = 1 THEN 'accepted'
    WHEN p.row_num = 2 THEN 'sent'
    ELSE 'draft'
  END as status,
  CASE
    WHEN p.row_num = 1 THEN 45000.00
    WHEN p.row_num = 2 THEN 125000.00
    ELSE 180000.00
  END as subtotal,
  8.25 as tax_rate,
  CASE
    WHEN p.row_num = 1 THEN 3712.50
    WHEN p.row_num = 2 THEN 10312.50
    ELSE 14850.00
  END as tax_amount,
  CASE
    WHEN p.row_num = 1 THEN 2250.00
    WHEN p.row_num = 2 THEN 0.00
    ELSE 9000.00
  END as discount_amount,
  CASE
    WHEN p.row_num = 1 THEN 46462.50
    WHEN p.row_num = 2 THEN 135312.50
    ELSE 185850.00
  END as total_amount,
  CASE
    WHEN p.row_num = 1 THEN '2024-02-28'::date
    WHEN p.row_num = 2 THEN '2024-03-15'::date
    ELSE '2024-03-01'::date
  END as valid_until,
  CASE
    WHEN p.row_num = 1 THEN 'Includes all materials and labor. Prevailing wage rates applied.'
    WHEN p.row_num = 2 THEN 'Price includes premium tile materials and waterproofing.'
    ELSE 'Volume discount applied for multiple units.'
  END as notes,
  CASE
    WHEN p.row_num = 1 THEN 'Net 30. 50% deposit required to start work.'
    WHEN p.row_num = 2 THEN 'Payment schedule: 30% deposit, 40% at midpoint, 30% on completion.'
    ELSE 'Progress billing based on completed units.'
  END as terms
FROM project_ids p;

-- Re-enable RLS if it was disabled
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- Verify the seeding
SELECT 'Seeding Complete!' as status;
SELECT 'Clients: ' || COUNT(*) as count FROM clients;
SELECT 'Materials: ' || COUNT(*) as count FROM materials;
SELECT 'Labor Rates: ' || COUNT(*) as count FROM labor_rates;
SELECT 'Projects: ' || COUNT(*) as count FROM projects;
SELECT 'Estimates: ' || COUNT(*) as count FROM estimates;