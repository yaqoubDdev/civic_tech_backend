const mongoose = require('mongoose');
const faker = require('faker');
require('dotenv').config();

const Report = require('./models/Report');
const calculatePriority = require('./utils/calculatePriority');
const smartRouting = require('./utils/smartRouting');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_tech';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('Connected to MongoDB for seeding');

    await Report.deleteMany({});

    const categories = ['Water', 'Roads', 'Power', 'Waste'];
    const types = {
      Water: ['Leak', 'Burst Pipe', 'No Supply', 'Contamination'],
      Roads: ['Pothole', 'Damaged Sidewalk', 'Missing Sign', 'Flooding'],
      Power: ['Outage', 'Flickering', 'Broken Street Light', 'Damaged Pole'],
      Waste: ['Overflowing Bin', 'Illegal Dumping', 'Missed Collection', 'Broken Container']
    };
    const statuses = ['Open', 'Scheduled', 'Resolved'];

    const reports = [];
    const centerLat = 8.485488;
    const centerLng = -13.226863;

    for (let i = 0; i < 50; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const type = types[category][Math.floor(Math.random() * types[category].length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      // Random upvotes between 1 and 50, with some reports having more upvotes
      const votes = Math.floor(Math.random() * 50) + 1;
      
      // Severity between 1-3
      const severity = Math.floor(Math.random() * 3) + 1;
      
      // Random date within last 30 days
      const daysAgo = Math.floor(Math.random() * 30);
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const data = {
        title: `${category} - ${type}`,
        description: faker.lorem.sentence(),
        type,
        category,
        location: {
          lat: centerLat + (Math.random() - 0.5) * 0.05,
          lng: centerLng + (Math.random() - 0.5) * 0.05,
          address: faker.address.streetAddress()
        },
        status,
        votes,
        createdAt
      };

      smartRouting(data);
      data.priorityScore = calculatePriority({ votes: data.votes, severity, createdAt: data.createdAt });

      reports.push(data);
    }

    await Report.insertMany(reports);
    console.log(`Inserted ${reports.length} dummy reports with varied upvotes`);
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
