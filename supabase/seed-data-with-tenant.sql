-- Seed data for Pennkraft database with tenant support
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/editor

-- First, check if tenants table exists and get/create a default tenant
DO $$
DECLARE
    default_tenant_id UUID;
BEGIN
    -- Check if tenants table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'tenants') THEN
        -- Get first tenant or create one
        SELECT id INTO default_tenant_id FROM tenants LIMIT 1;

        IF default_tenant_id IS NULL THEN
            -- Create a default tenant
            INSERT INTO tenants (name, slug, settings)
            VALUES ('Pennkraft Estimating', 'pennkraft', '{}')
            RETURNING id INTO default_tenant_id;
        END IF;
    ELSE
        -- If no tenants table, use a static UUID
        default_tenant_id := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid;
    END IF;

    -- Store the tenant_id in a temporary table for use in the rest of the script
    CREATE TEMP TABLE IF NOT EXISTS temp_tenant (id UUID);
    DELETE FROM temp_tenant;
    INSERT INTO temp_tenant VALUES (default_tenant_id);
END $$;

-- Temporarily disable RLS for seeding
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE materials DISABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE estimates DISABLE ROW LEVEL SECURITY;
ALTER TABLE line_items DISABLE ROW LEVEL SECURITY;

-- Clear existing data (optional - be careful with this in production!)
-- Uncomment these lines if you want to clear existing data first
-- DELETE FROM line_items WHERE id IS NOT NULL;
-- DELETE FROM estimates WHERE id IS NOT NULL;
-- DELETE FROM projects WHERE id IS NOT NULL;
-- DELETE FROM materials WHERE id IS NOT NULL;
-- DELETE FROM labor_rates WHERE id IS NOT NULL;
-- DELETE FROM clients WHERE id IS NOT NULL;

-- 1. Insert Clients with tenant_id
INSERT INTO clients (tenant_id, name, email, phone, address)
SELECT
    (SELECT id FROM temp_tenant LIMIT 1),
    name,
    email,
    phone,
    address
FROM (VALUES
    ('Smith Construction Co.', 'john@smithconstruction.com', '555-0101', '123 Main St, Dallas, TX 75201'),
    ('Garcia Properties LLC', 'maria@garciaproperties.com', '555-0102', '456 Oak Ave, Houston, TX 77002'),
    ('Johnson Development Group', 'robert@johnsondev.com', '555-0103', '789 Pine Blvd, Austin, TX 78701'),
    ('Williams Home Builders', 'sarah@williamshomes.com', '555-0104', '321 Elm Street, San Antonio, TX 78205'),
    ('Chen Commercial Real Estate', 'michael@chencre.com', '555-0105', '654 Cedar Lane, Fort Worth, TX 76102'),
    ('Anderson Renovations', 'david@andersonreno.com', '555-0106', '987 Maple Drive, Plano, TX 75074'),
    ('Thompson Contracting', 'lisa@thompsoncontract.com', '555-0107', '246 Oak Park, Arlington, TX 76010'),
    ('Martinez Custom Homes', 'carlos@martinezhomes.com', '555-0108', '135 Pine Ridge, Irving, TX 75061')
) AS t(name, email, phone, address)
ON CONFLICT (email) DO NOTHING;

-- 2. Insert Materials (check if materials table has tenant_id)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'materials' AND column_name = 'tenant_id'
    ) THEN
        -- Insert with tenant_id
        INSERT INTO materials (tenant_id, name, unit, cost, category, description)
        SELECT
            (SELECT id FROM temp_tenant LIMIT 1),
            name,
            unit,
            cost::numeric,
            category,
            description
        FROM (VALUES
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
            ('Drywall Sheet 4x8 1/2"', 'sheet', 12.00, 'Drywall', '1/2 inch regular drywall'),
            ('Moisture Resistant Drywall', 'sheet', 15.00, 'Drywall', '1/2 inch green board'),
            ('Joint Compound', 'bucket', 15.00, 'Drywall Supplies', '5 gallon all-purpose'),
            ('Drywall Tape', 'roll', 6.00, 'Drywall Supplies', '500ft paper tape'),
            ('Drywall Screws 1-5/8"', 'box', 8.00, 'Drywall Supplies', '1000 count'),

            -- Glass Materials
            ('Tempered Glass 1/4"', 'sq ft', 12.00, 'Glass', 'Clear tempered safety glass'),
            ('Shower Door Glass 3/8"', 'sq ft', 18.00, 'Glass', 'Clear tempered shower glass'),
            ('Mirror 1/4"', 'sq ft', 8.00, 'Glass', '1/4 inch silvered mirror'),

            -- Flooring Materials
            ('Hardwood Flooring Oak', 'sq ft', 5.50, 'Flooring', 'Oak hardwood planks'),
            ('Laminate Flooring', 'sq ft', 2.25, 'Flooring', 'Wood-look laminate'),
            ('Vinyl Plank Flooring', 'sq ft', 3.50, 'Flooring', 'Luxury vinyl plank'),
            ('Carpet', 'sq yd', 25.00, 'Flooring', 'Medium grade carpet')
        ) AS t(name, unit, cost, category, description)
        ON CONFLICT DO NOTHING;
    ELSE
        -- Insert without tenant_id
        INSERT INTO materials (name, unit, cost, category, description)
        SELECT name, unit, cost::numeric, category, description
        FROM (VALUES
            -- Same materials as above
            ('Premium Interior Paint', 'gallon', 35.00, 'Paint', 'High-quality interior latex paint'),
            ('Exterior Paint', 'gallon', 45.00, 'Paint', 'Weather-resistant exterior paint'),
            ('Primer', 'gallon', 25.00, 'Paint', 'Multi-surface primer'),
            ('Ceramic Tile 12x12', 'sq ft', 2.50, 'Tile', 'Standard ceramic floor tile'),
            ('Porcelain Tile 24x24', 'sq ft', 4.50, 'Tile', 'Large format porcelain tile'),
            ('Drywall Sheet 4x8 1/2"', 'sheet', 12.00, 'Drywall', '1/2 inch regular drywall'),
            ('Tempered Glass 1/4"', 'sq ft', 12.00, 'Glass', 'Clear tempered safety glass'),
            ('Hardwood Flooring Oak', 'sq ft', 5.50, 'Flooring', 'Oak hardwood planks')
        ) AS t(name, unit, cost, category, description)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 3. Insert Labor Rates (check if labor_rates has tenant_id)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'labor_rates' AND column_name = 'tenant_id'
    ) THEN
        INSERT INTO labor_rates (tenant_id, trade, rate_type, rate, description)
        SELECT
            (SELECT id FROM temp_tenant LIMIT 1),
            trade,
            rate_type,
            rate::numeric,
            description
        FROM (VALUES
            ('Painter - Journeyman', 'hourly', 45.00, 'Experienced painter'),
            ('Painter - Master', 'hourly', 65.00, 'Master painter with 10+ years'),
            ('Tile Installer', 'hourly', 55.00, 'Experienced tile setter'),
            ('Drywall Hanger', 'hourly', 50.00, 'Drywall installation specialist'),
            ('Glazier', 'hourly', 60.00, 'Glass installation specialist'),
            ('Flooring Installer', 'hourly', 50.00, 'Flooring specialist'),
            ('General Laborer', 'hourly', 20.00, 'General construction helper'),
            ('Foreman', 'hourly', 75.00, 'Job site supervisor')
        ) AS t(trade, rate_type, rate, description)
        ON CONFLICT DO NOTHING;
    ELSE
        INSERT INTO labor_rates (trade, rate_type, rate, description)
        SELECT trade, rate_type, rate::numeric, description
        FROM (VALUES
            ('Painter - Journeyman', 'hourly', 45.00, 'Experienced painter'),
            ('Painter - Master', 'hourly', 65.00, 'Master painter with 10+ years'),
            ('Tile Installer', 'hourly', 55.00, 'Experienced tile setter'),
            ('Drywall Hanger', 'hourly', 50.00, 'Drywall installation specialist'),
            ('Glazier', 'hourly', 60.00, 'Glass installation specialist'),
            ('Flooring Installer', 'hourly', 50.00, 'Flooring specialist'),
            ('General Laborer', 'hourly', 20.00, 'General construction helper'),
            ('Foreman', 'hourly', 75.00, 'Job site supervisor')
        ) AS t(trade, rate_type, rate, description)
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- 4. Insert Projects (check if projects has tenant_id)
WITH first_clients AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
    FROM clients
    WHERE tenant_id = (SELECT id FROM temp_tenant LIMIT 1)
    LIMIT 5
)
INSERT INTO projects (
    tenant_id,
    client_id,
    name,
    description,
    status,
    address,
    start_date,
    end_date
)
SELECT
    (SELECT id FROM temp_tenant LIMIT 1) as tenant_id,
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
FROM first_clients c
WHERE c.id IS NOT NULL
ON CONFLICT DO NOTHING;

-- 5. Insert Estimates
WITH first_projects AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY created_at) as row_num
    FROM projects
    WHERE tenant_id = (SELECT id FROM temp_tenant LIMIT 1)
    LIMIT 3
)
INSERT INTO estimates (
    tenant_id,
    project_id,
    estimate_number,
    status,
    subtotal,
    tax_rate,
    tax_amount,
    discount_amount,
    total_amount,
    valid_until,
    notes,
    terms
)
SELECT
    (SELECT id FROM temp_tenant LIMIT 1) as tenant_id,
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
FROM first_projects p
WHERE p.id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Re-enable RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE labor_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE line_items ENABLE ROW LEVEL SECURITY;

-- Clean up temp table
DROP TABLE IF EXISTS temp_tenant;

-- Verify the seeding
SELECT 'Seeding Complete!' as status;
SELECT 'Tenant ID used: ' || id::text as tenant_info FROM tenants LIMIT 1;
SELECT 'Clients: ' || COUNT(*) as count FROM clients;
SELECT 'Materials: ' || COUNT(*) as count FROM materials;
SELECT 'Labor Rates: ' || COUNT(*) as count FROM labor_rates;
SELECT 'Projects: ' || COUNT(*) as count FROM projects;
SELECT 'Estimates: ' || COUNT(*) as count FROM estimates;