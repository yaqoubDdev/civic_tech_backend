const mongoose = require('mongoose');
const faker = require('faker');
require('dotenv').config();
const Report = require('./models/Report');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_tech';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB for seeding');
  await Report.deleteMany({});

  // Cluster around Freetown, Sierra Leone
  // Approx coordinates: 8.4657 N, -13.2317 W
  const center = { lat: 8.487454, lng: -13.227338 };
  const categories = ['Water', 'Roads', 'Power'];

  const docs = [];
  for (let i = 0; i < 50; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const offsetLat = (Math.random() - 0.5) * 0.02;
    const offsetLng = (Math.random() - 0.5) * 0.02;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30));
    const votes = Math.floor(Math.random() * 10) + 1;
    const severity = Math.floor(Math.random() * 5) + 1;
    const isHigh = i < 3;

    docs.push({
      location: { lat: center.lat + offsetLat, lng: center.lng + offsetLng, address: `${faker.address.streetAddress()}, Freetown` },
      category,
      image: '',
      status: isHigh ? 'Escalated' : 'Open',
      votes: isHigh ? votes + 20 : votes,
      priorityScore: 0,
      primaryOwner: '',
      createdAt,
      severity
    });
  }

  await Report.insertMany(docs.map(d => d));
  console.log('Inserted 50 dummy reports');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
