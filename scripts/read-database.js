const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

async function readDatabaseSchema() {
  const client = new Client({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('✅ Connected to database\n');

    // Query to get all tables in public schema
    const tablesQuery = `
      SELECT
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    const tablesResult = await client.query(tablesQuery);
    console.log('📊 Tables in database:\n');
    console.log('=' .repeat(60));

    for (const table of tablesResult.rows) {
      console.log(`\n📋 Table: ${table.table_name} (${table.column_count} columns)`);
      console.log('-'.repeat(40));

      // Get columns for each table
      const columnsQuery = `
        SELECT
          column_name,
          data_type,
          character_maximum_length,
          is_nullable,
          column_default,
          (
            SELECT COUNT(*)
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = c.table_name
              AND kcu.column_name = c.column_name
              AND tc.constraint_type = 'PRIMARY KEY'
          ) > 0 as is_primary_key,
          (
            SELECT COUNT(*)
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
              ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_name = c.table_name
              AND kcu.column_name = c.column_name
              AND tc.constraint_type = 'FOREIGN KEY'
          ) > 0 as is_foreign_key
        FROM information_schema.columns c
        WHERE table_schema = 'public'
          AND table_name = $1
        ORDER BY ordinal_position;
      `;

      const columnsResult = await client.query(columnsQuery, [table.table_name]);

      for (const col of columnsResult.rows) {
        let colInfo = `  • ${col.column_name}: ${col.data_type}`;

        if (col.character_maximum_length) {
          colInfo += `(${col.character_maximum_length})`;
        }

        if (col.is_primary_key) colInfo += ' 🔑 PRIMARY KEY';
        if (col.is_foreign_key) colInfo += ' 🔗 FOREIGN KEY';
        if (col.is_nullable === 'NO') colInfo += ' NOT NULL';
        if (col.column_default) colInfo += ` DEFAULT: ${col.column_default.substring(0, 30)}`;

        console.log(colInfo);
      }

      // Get row count
      try {
        const countQuery = `SELECT COUNT(*) FROM public.${table.table_name}`;
        const countResult = await client.query(countQuery);
        console.log(`\n  📊 Row count: ${countResult.rows[0].count}`);
      } catch (error) {
        console.log(`  ⚠️ Could not get row count: ${error.message}`);
      }
    }

    // Get foreign key relationships
    console.log('\n\n🔗 Foreign Key Relationships:\n');
    console.log('=' .repeat(60));

    const fkQuery = `
      SELECT
        tc.table_name as from_table,
        kcu.column_name as from_column,
        ccu.table_name AS to_table,
        ccu.column_name AS to_column
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
      ORDER BY tc.table_name, kcu.column_name;
    `;

    const fkResult = await client.query(fkQuery);

    for (const fk of fkResult.rows) {
      console.log(`  ${fk.from_table}.${fk.from_column} → ${fk.to_table}.${fk.to_column}`);
    }

    // Generate TypeScript type definitions
    console.log('\n\n📝 TypeScript Type Definitions:\n');
    console.log('=' .repeat(60));
    console.log('\nexport interface Database {');
    console.log('  public: {');
    console.log('    Tables: {');

    for (const table of tablesResult.rows) {
      const columnsResult = await client.query(columnsQuery, [table.table_name]);

      console.log(`      ${table.table_name}: {`);
      console.log('        Row: {');

      for (const col of columnsResult.rows) {
        let tsType = 'any';

        // Map PostgreSQL types to TypeScript
        switch (col.data_type) {
          case 'uuid':
          case 'text':
          case 'character varying':
          case 'character':
            tsType = 'string';
            break;
          case 'integer':
          case 'bigint':
          case 'smallint':
          case 'numeric':
          case 'decimal':
          case 'real':
          case 'double precision':
            tsType = 'number';
            break;
          case 'boolean':
            tsType = 'boolean';
            break;
          case 'timestamp with time zone':
          case 'timestamp without time zone':
          case 'date':
          case 'time':
            tsType = 'string';
            break;
          case 'jsonb':
          case 'json':
            tsType = 'any';
            break;
          default:
            tsType = 'any';
        }

        const nullable = col.is_nullable === 'YES' ? ' | null' : '';
        console.log(`          ${col.column_name}: ${tsType}${nullable};`);
      }

      console.log('        };');
      console.log('      };');
    }

    console.log('    };');
    console.log('  };');
    console.log('}');

    console.log('\n\n✅ Database schema analysis complete!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

readDatabaseSchema();