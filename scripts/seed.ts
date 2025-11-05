const { adminDb } = require('../lib/firebaseAdmin');

(async () => {
  console.log('Seeding Firestore...');

  const picks = [
    {
      round: 1,
      season: 2026,
      match: 'Richmond vs. Carlton',
      quarter: 1,
      question: 'Will Dustin Martin kick a goal in the first quarter?',
      status: 'open',
      result: '',
      createdAt: new Date(),
    },
    {
      round: 1,
      season: 2026,
      match: 'Geelong vs. Collingwood',
      quarter: 2,
      question: 'Will Jeremy Cameron take 3+ marks in the second quarter?',
      status: 'scheduled',
      result: '',
      createdAt: new Date(),
    },
  ];

  for (const pick of picks) {
    await adminDb.collection('picks').add(pick);
  }

  console.log('Seeded picks');
})();
