import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export async function POST(request: Request) {
  const requestHeaders = new Headers(request.headers);
  const seedEmail = requestHeaders.get('x-seed-email');

  if (seedEmail !== process.env.SEED_ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Initialize Firebase Admin SDK
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  }

  const db = admin.firestore();
  const batch = db.batch();

  // Season
  const seasonRef = db.collection('seasons').doc('2026');
  batch.set(seasonRef, { id: 2026, year: 2026 });

  // Rounds
  const rounds = [
    { season: 2026, round: 1, startTime: new Date('2026-03-19T19:20:00Z'), status: 'scheduled' },
    { season: 2026, round: 2, startTime: new Date('2026-03-26T19:20:00Z'), status: 'scheduled' },
  ];

  rounds.forEach(round => {
    const roundRef = db.collection('rounds').doc(`${round.season}-R${round.round}`);
    batch.set(roundRef, round);
  });

  // Games
  const games = [
    // Round 1
    { season: 2026, round: 1, match: 'Richmond vs Carlton', order: 1, gameId: '2026-R1-G1' },
    { season: 2026, round: 1, match: 'Collingwood vs Sydney', order: 2, gameId: '2026-R1-G2' },
    // Round 2
    { season: 2026, round: 2, match: 'Geelong vs Essendon', order: 1, gameId: '2026-R2-G1' },
    { season: 2026, round: 2, match: 'Hawthorn vs West Coast', order: 2, gameId: '2026-R2-G2' },
  ];

  games.forEach(game => {
    const gameRef = db.collection('games').doc(game.gameId);
    batch.set(gameRef, game);
  });

  // Questions
  const questions = [
    // Game 1 Questions
    { season: 2026, round: 1, gameId: '2026-R1-G1', quarter: 1, text: 'Will Richmond lead at quarter time?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G1', quarter: 2, text: 'Will Dusty have 15+ disposals at half time?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G1', quarter: 3, text: 'Will the total score be over 150.5 points?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G1', quarter: 4, text: 'Will Carlton win by more than 10 points?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    // Game 2 Questions
    { season: 2026, round: 1, gameId: '2026-R1-G2', quarter: 1, text: 'Will Collingwood score the first goal?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G2', quarter: 2, text: 'Will there be a lead change in the second quarter?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G2', quarter: 3, text: 'Will a player kick 3+ goals?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 1, gameId: '2026-R1-G2', quarter: 4, text: 'Will the final margin be under 6 points?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
     // Game 3 Questions
    { season: 2026, round: 2, gameId: '2026-R2-G1', quarter: 1, text: 'Will Geelong lead at quarter time?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G1', quarter: 2, text: 'Will the combined score be over 80.5 at half time?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G1', quarter: 3, text: 'Will a player from Essendon take 8+ marks?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G1', quarter: 4, text: 'Will Geelong win the game?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    // Game 4 Questions
    { season: 2026, round: 2, gameId: '2026-R2-G2', quarter: 1, text: 'Will West Coast kick the first behind?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G2', quarter: 2, text: 'Will there be more than 5 lead changes in the first half?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G2', quarter: 3, text: 'Will a Hawthorn player have 10+ contested possessions?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
    { season: 2026, round: 2, gameId: '2026-R2-G2', quarter: 4, text: 'Will the match be decided by a kick after the siren?', status: 'open', result: null, yesCount: 0, noCount: 0, commentCount: 0 },
  ];

  questions.forEach(question => {
    const questionRef = db.collection('questions').doc();
    batch.set(questionRef, question);
  });

  try {
    await batch.commit();
    return NextResponse.json({ message: 'Seed successful' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Seed failed' }, { status: 500 });
  }
}