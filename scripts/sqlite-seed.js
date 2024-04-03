const sqlite3 = require('sqlite3').verbose();
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(db) {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );
    `);

    console.log(`Created "users" table`);

    // Insert data into the "users" table
    for (let user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await db.run(
        `
        INSERT OR IGNORE INTO users (id, name, email, password)
        VALUES (?, ?, ?, ?)
      `,
        [user.id, user.name, user.email, hashedPassword],
      );
    }

    console.log(`Seeded users`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedInvoices(db) {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        customer_id TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        date TEXT NOT NULL
      );
    `);

    console.log(`Created "invoices" table`);

    // Insert data into the "invoices" table
    for (let invoice of invoices) {
      await db.run(
        `
        INSERT OR IGNORE INTO invoices (id, customer_id, amount, status, date)
        VALUES (?, ?, ?, ?, ?)
      `,
        [
          invoice.id,
          invoice.customer_id,
          invoice.amount,
          invoice.status,
          invoice.date,
        ],
      );
    }

    console.log(`Seeded invoices`);
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedCustomers(db) {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        image_url TEXT NOT NULL
      );
    `);

    console.log(`Created "customers" table`);

    // Insert data into the "customers" table
    for (let customer of customers) {
      await db.run(
        `
        INSERT OR IGNORE INTO customers (id, name, email, image_url)
        VALUES (?, ?, ?, ?)
      `,
        [customer.id, customer.name, customer.email, customer.image_url],
      );
    }

    console.log(`Seeded customers`);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedRevenue(db) {
  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS revenue (
        month TEXT PRIMARY KEY,
        revenue INTEGER NOT NULL
      );
    `);

    console.log(`Created "revenue" table`);

    // Insert data into the "revenue" table
    for (let rev of revenue) {
      await db.run(
        `
        INSERT OR IGNORE INTO revenue (month, revenue)
        VALUES (?, ?)
      `,
        [rev.month, rev.revenue],
      );
    }

    console.log(`Seeded revenue`);
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  let db = new sqlite3.Database('./db.sqlite', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
  });

  await seedUsers(db);
  await seedCustomers(db);
  await seedInvoices(db);
  await seedRevenue(db);

  await db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Closed the database connection.');
  });
}

main ().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
