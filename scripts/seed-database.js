const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseKey === 'YOUR_ANON_KEY_HERE') {
  console.error('❌ Please add your Supabase URL and ANON KEY to .env.local');
  console.log('\n📝 Instructions:');
  console.log('1. Go to: https://supabase.com/dashboard/project/sgsjafwcqclqcryjpfcy/settings/api');
  console.log('2. Copy the "anon public" key');
  console.log('3. Update .env.local with: NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearExistingData() {
  console.log('🧹 Clearing existing seed data...');

  // Clear in order to respect foreign key constraints
  const tablesToClear = [
    'line_items',
    'estimates',
    'projects',
    'materials',
    'labor_rates',
    'clients'
  ];

  for (const table of tablesToClear) {
    const { error } = await supabase
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows

    if (error && !error.message.includes('No rows found')) {
      console.log(`  ⚠️ Could not clear ${table}: ${error.message}`);
    }
  }
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // 1. Seed Clients
    console.log('👥 Creating clients...');
    const clientsData = [
      {
        name: 'Smith Construction Co.',
        email: 'john@smithconstruction.com',
        phone: '555-0101',
        address: '123 Main St, Dallas, TX 75201'
      },
      {
        name: 'Garcia Properties LLC',
        email: 'maria@garciaproperties.com',
        phone: '555-0102',
        address: '456 Oak Ave, Houston, TX 77002'
      },
      {
        name: 'Johnson Development Group',
        email: 'robert@johnsondev.com',
        phone: '555-0103',
        address: '789 Pine Blvd, Austin, TX 78701'
      },
      {
        name: 'Williams Home Builders',
        email: 'sarah@williamshomes.com',
        phone: '555-0104',
        address: '321 Elm Street, San Antonio, TX 78205'
      },
      {
        name: 'Chen Commercial Real Estate',
        email: 'michael@chencre.com',
        phone: '555-0105',
        address: '654 Cedar Lane, Fort Worth, TX 76102'
      }
    ];

    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .insert(clientsData)
      .select();

    if (clientsError) {
      console.error('  ❌ Error creating clients:', clientsError);
      return;
    }
    console.log(`  ✅ Created ${clients.length} clients`);

    // 2. Seed Materials
    console.log('\n📦 Creating materials database...');
    const materialsData = [
      // Painting Materials
      { name: 'Premium Interior Paint', unit: 'gallon', cost: 35.00, category: 'Paint', description: 'High-quality interior latex paint' },
      { name: 'Exterior Paint', unit: 'gallon', cost: 45.00, category: 'Paint', description: 'Weather-resistant exterior paint' },
      { name: 'Primer', unit: 'gallon', cost: 25.00, category: 'Paint', description: 'Multi-surface primer' },
      { name: 'Paint Brush Set', unit: 'set', cost: 25.00, category: 'Paint Supplies', description: 'Professional brush set' },
      { name: 'Roller Set', unit: 'set', cost: 15.00, category: 'Paint Supplies', description: '9-inch roller with covers' },
      { name: 'Drop Cloth', unit: 'each', cost: 12.00, category: 'Paint Supplies', description: '9x12 canvas drop cloth' },
      { name: "Painter's Tape", unit: 'roll', cost: 6.00, category: 'Paint Supplies', description: '2-inch blue tape' },

      // Tile Materials
      { name: 'Ceramic Tile 12x12', unit: 'sq ft', cost: 2.50, category: 'Tile', description: 'Standard ceramic floor tile' },
      { name: 'Porcelain Tile 24x24', unit: 'sq ft', cost: 4.50, category: 'Tile', description: 'Large format porcelain tile' },
      { name: 'Subway Tile 3x6', unit: 'sq ft', cost: 8.00, category: 'Tile', description: 'Classic white subway tile' },
      { name: 'Tile Adhesive', unit: 'bag', cost: 15.00, category: 'Tile Supplies', description: '50lb modified thinset' },
      { name: 'Grout', unit: 'bag', cost: 18.00, category: 'Tile Supplies', description: '25lb sanded grout' },
      { name: 'Tile Spacers', unit: 'bag', cost: 5.00, category: 'Tile Supplies', description: '1/4 inch spacers (100 pack)' },

      // Drywall Materials
      { name: 'Drywall Sheet 4x8', unit: 'sheet', cost: 12.00, category: 'Drywall', description: '1/2 inch regular drywall' },
      { name: 'Moisture Resistant Drywall', unit: 'sheet', cost: 15.00, category: 'Drywall', description: '1/2 inch green board' },
      { name: 'Fire Rated Drywall', unit: 'sheet', cost: 18.00, category: 'Drywall', description: '5/8 inch Type X' },
      { name: 'Joint Compound', unit: 'bucket', cost: 15.00, category: 'Drywall Supplies', description: '5 gallon all-purpose' },
      { name: 'Drywall Tape', unit: 'roll', cost: 6.00, category: 'Drywall Supplies', description: '500ft paper tape' },
      { name: 'Drywall Screws', unit: 'box', cost: 8.00, category: 'Drywall Supplies', description: '1-5/8 inch (1000 count)' },

      // Glass Materials
      { name: 'Tempered Glass 1/4"', unit: 'sq ft', cost: 12.00, category: 'Glass', description: 'Clear tempered safety glass' },
      { name: 'Shower Door Glass 3/8"', unit: 'sq ft', cost: 18.00, category: 'Glass', description: 'Clear tempered shower glass' },
      { name: 'Mirror', unit: 'sq ft', cost: 8.00, category: 'Glass', description: '1/4 inch silvered mirror' },
      { name: 'Glass Clips', unit: 'pack', cost: 12.00, category: 'Glass Hardware', description: 'Chrome clips (4 pack)' },
      { name: 'Shower Door Hardware', unit: 'set', cost: 150.00, category: 'Glass Hardware', description: 'Complete hardware kit' },

      // Flooring Materials
      { name: 'Hardwood Flooring', unit: 'sq ft', cost: 5.50, category: 'Flooring', description: 'Oak hardwood planks' },
      { name: 'Laminate Flooring', unit: 'sq ft', cost: 2.25, category: 'Flooring', description: 'Wood-look laminate' },
      { name: 'Vinyl Plank Flooring', unit: 'sq ft', cost: 3.50, category: 'Flooring', description: 'Luxury vinyl plank' },
      { name: 'Carpet', unit: 'sq yd', cost: 25.00, category: 'Flooring', description: 'Medium grade carpet' },
      { name: 'Underlayment', unit: 'sq ft', cost: 0.50, category: 'Flooring Supplies', description: 'Foam underlayment' },
      { name: 'Transition Strips', unit: 'each', cost: 15.00, category: 'Flooring Supplies', description: 'Metal transition strip' }
    ];

    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .insert(materialsData)
      .select();

    if (materialsError) {
      console.error('  ❌ Error creating materials:', materialsError);
    } else {
      console.log(`  ✅ Created ${materials.length} materials`);
    }

    // 3. Seed Labor Rates
    console.log('\n💼 Creating labor rates...');
    const laborRatesData = [
      { trade: 'Painter', rate_type: 'hourly', rate: 45.00, description: 'Journeyman painter' },
      { trade: 'Painter', rate_type: 'hourly', rate: 65.00, description: 'Master painter' },
      { trade: 'Painter Helper', rate_type: 'hourly', rate: 25.00, description: 'Painter assistant' },
      { trade: 'Tile Installer', rate_type: 'hourly', rate: 55.00, description: 'Experienced tile setter' },
      { trade: 'Tile Helper', rate_type: 'hourly', rate: 30.00, description: 'Tile assistant' },
      { trade: 'Drywall Installer', rate_type: 'hourly', rate: 50.00, description: 'Drywall hanger' },
      { trade: 'Drywall Finisher', rate_type: 'hourly', rate: 55.00, description: 'Taping and finishing' },
      { trade: 'Glazier', rate_type: 'hourly', rate: 60.00, description: 'Glass installer' },
      { trade: 'Flooring Installer', rate_type: 'hourly', rate: 50.00, description: 'Flooring specialist' },
      { trade: 'General Laborer', rate_type: 'hourly', rate: 20.00, description: 'General helper' },
      { trade: 'Foreman', rate_type: 'hourly', rate: 75.00, description: 'Job site supervisor' },
      { trade: 'Project Manager', rate_type: 'hourly', rate: 95.00, description: 'Project management' }
    ];

    const { data: laborRates, error: laborRatesError } = await supabase
      .from('labor_rates')
      .insert(laborRatesData)
      .select();

    if (laborRatesError) {
      console.error('  ❌ Error creating labor rates:', laborRatesError);
    } else {
      console.log(`  ✅ Created ${laborRates.length} labor rates`);
    }

    // 4. Seed Projects
    console.log('\n📁 Creating projects...');
    const projectsData = [
      {
        client_id: clients[0].id,
        name: 'Office Building Renovation - Painting',
        description: 'Complete interior painting for 3-story office building',
        status: 'active',
        address: '1000 Commerce St, Dallas, TX 75201',
        start_date: '2024-02-01',
        end_date: '2024-03-15'
      },
      {
        client_id: clients[1].id,
        name: 'Luxury Apartment Complex - Tile Work',
        description: 'Bathroom and kitchen tile installation for 50 units',
        status: 'active',
        address: '2000 Westheimer Rd, Houston, TX 77006',
        start_date: '2024-03-01',
        end_date: '2024-05-30'
      },
      {
        client_id: clients[2].id,
        name: 'New Construction - Drywall Installation',
        description: 'Complete drywall installation for 20 townhomes',
        status: 'active',
        address: '3000 South Congress, Austin, TX 78704',
        start_date: '2024-02-15',
        end_date: '2024-04-30'
      },
      {
        client_id: clients[3].id,
        name: 'Custom Home - Master Bath Glass',
        description: 'Frameless shower enclosure and custom mirrors',
        status: 'completed',
        address: '4000 Broadway, San Antonio, TX 78209',
        start_date: '2024-01-15',
        end_date: '2024-01-25'
      },
      {
        client_id: clients[4].id,
        name: 'Commercial Plaza - Flooring',
        description: 'LVP flooring installation for retail spaces',
        status: 'active',
        address: '5000 7th Street, Fort Worth, TX 76102',
        start_date: '2024-02-01',
        end_date: '2024-02-28'
      }
    ];

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .insert(projectsData)
      .select();

    if (projectsError) {
      console.error('  ❌ Error creating projects:', projectsError);
    } else {
      console.log(`  ✅ Created ${projects.length} projects`);
    }

    // 5. Seed Estimates
    console.log('\n📋 Creating estimates...');
    const estimatesData = [
      {
        project_id: projects[0].id,
        estimate_number: 'EST-2024-001',
        status: 'accepted',
        subtotal: 45000.00,
        tax_rate: 8.25,
        tax_amount: 3712.50,
        discount_amount: 2250.00,
        total_amount: 46462.50,
        valid_until: '2024-02-28',
        notes: 'Includes all materials and labor. Prevailing wage rates applied.',
        terms: 'Net 30. 50% deposit required to start work.'
      },
      {
        project_id: projects[1].id,
        estimate_number: 'EST-2024-002',
        status: 'sent',
        subtotal: 125000.00,
        tax_rate: 8.25,
        tax_amount: 10312.50,
        discount_amount: 0.00,
        total_amount: 135312.50,
        valid_until: '2024-03-15',
        notes: 'Price includes premium tile materials and waterproofing.',
        terms: 'Payment schedule: 30% deposit, 40% at midpoint, 30% on completion.'
      },
      {
        project_id: projects[2].id,
        estimate_number: 'EST-2024-003',
        status: 'draft',
        subtotal: 180000.00,
        tax_rate: 8.25,
        tax_amount: 14850.00,
        discount_amount: 9000.00,
        total_amount: 185850.00,
        valid_until: '2024-03-01',
        notes: 'Volume discount applied for multiple units.',
        terms: 'Progress billing based on completed units.'
      }
    ];

    const { data: estimates, error: estimatesError } = await supabase
      .from('estimates')
      .insert(estimatesData)
      .select();

    if (estimatesError) {
      console.error('  ❌ Error creating estimates:', estimatesError);
    } else {
      console.log(`  ✅ Created ${estimates.length} estimates`);

      // 6. Seed Line Items for Estimates
      console.log('\n📝 Creating estimate line items...');
      const lineItemsData = [
        // Line items for first estimate (Painting)
        {
          estimate_id: estimates[0].id,
          item_order: 1,
          description: 'Surface Preparation - Walls and Ceilings',
          quantity: 15000,
          unit: 'sq ft',
          unit_price: 0.75,
          total_price: 11250.00,
          category: 'Labor'
        },
        {
          estimate_id: estimates[0].id,
          item_order: 2,
          description: 'Premium Interior Paint - 2 Coats',
          quantity: 150,
          unit: 'gallon',
          unit_price: 35.00,
          total_price: 5250.00,
          category: 'Materials'
        },
        {
          estimate_id: estimates[0].id,
          item_order: 3,
          description: 'Primer Application',
          quantity: 75,
          unit: 'gallon',
          unit_price: 25.00,
          total_price: 1875.00,
          category: 'Materials'
        },
        {
          estimate_id: estimates[0].id,
          item_order: 4,
          description: 'Labor - Painting Application',
          quantity: 600,
          unit: 'hours',
          unit_price: 45.00,
          total_price: 27000.00,
          category: 'Labor'
        },

        // Line items for second estimate (Tile)
        {
          estimate_id: estimates[1].id,
          item_order: 1,
          description: 'Porcelain Tile 24x24',
          quantity: 8500,
          unit: 'sq ft',
          unit_price: 4.50,
          total_price: 38250.00,
          category: 'Materials'
        },
        {
          estimate_id: estimates[1].id,
          item_order: 2,
          description: 'Tile Installation Labor',
          quantity: 1200,
          unit: 'hours',
          unit_price: 55.00,
          total_price: 66000.00,
          category: 'Labor'
        },
        {
          estimate_id: estimates[1].id,
          item_order: 3,
          description: 'Waterproofing System',
          quantity: 8500,
          unit: 'sq ft',
          unit_price: 2.50,
          total_price: 21250.00,
          category: 'Materials'
        }
      ];

      const { data: lineItems, error: lineItemsError } = await supabase
        .from('line_items')
        .insert(lineItemsData)
        .select();

      if (lineItemsError) {
        console.error('  ❌ Error creating line items:', lineItemsError);
      } else {
        console.log(`  ✅ Created ${lineItems.length} line items`);
      }
    }

    console.log('\n✨ Database seeding complete!');

    // Display summary
    console.log('\n📊 Database Summary:');
    console.log('=' .repeat(40));
    console.log(`  Clients:     ${clients?.length || 0}`);
    console.log(`  Materials:   ${materials?.length || 0}`);
    console.log(`  Labor Rates: ${laborRates?.length || 0}`);
    console.log(`  Projects:    ${projects?.length || 0}`);
    console.log(`  Estimates:   ${estimates?.length || 0}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');

  if (clearFirst) {
    await clearExistingData();
  }

  await seedDatabase();
}

main();