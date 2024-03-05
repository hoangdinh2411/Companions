import dayjs from 'dayjs';
import UserModel from '../models/User.model';
import { generateSlugFrom } from '../../lib/utils/generate-slug';
import JourneyModel from '../models/Journey.model';

const titles = [
  'Whispers of the Mystic Moonlight',
  'Journey Through the Enchanted Forest',
  'Echoes of the Celestial Symphony',
  'Serenity Found in Tranquil Meadows',
  'Dance with the Shadows of Eternity',
  'Ephemeral Melodies in Azure Skies',
  'Mystical Reverie: Secrets of the Cosmos',
  'Harmony Amidst Whispers of the Breeze',
  'Crimson Horizon: A Tale of Endless Sunset',
  'Lullaby of the Silent Stardust',
];

const starting_points = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'Banff National Park, Canada',
  'Marrakech, Morocco',
  'Queenstown, New Zealand',
  'Machu Picchu, Peru',
  'Sydney, Australia',
  'Reykjavik, Iceland',
  'Cape Town, South Africa',
  'Sedona, Arizona, USA',
];
const destinations = [
  'Santorini, Greece',
  'Kyoto, Japan',
  'Banff National Park, Canada',
  'Grand Canyon, Arizona, USA',
  'Barcelona, Spain',
  'Cappadocia, Turkey',
  'Rio de Janeiro, Brazil',
  'Aoraki / Mount Cook National Park, New Zealand',
  'The Maldives',
  'Bangkok, Thailand',
];
const messages = [
  'Embark on a journey of a lifetime, where every destination becomes a chapter in your own unique story.',
  'Wander through the tapestry of cultures, savor the flavors of diverse landscapes, and let the symphony of adventures unfold in every step you take.',
  'In the dance of exploration, find the rhythm of your heart echoing in the beauty of undiscovered places. Let the world be your canvas, and travel be your masterpiece.',
  "Travel is not just about places; it's about the moments that take your breath away. Create a treasury of memories as you traverse the scenic routes and hidden alleys of the world.",
  'Venture into the unknown, where the unfamiliar becomes a canvas for self-discovery. Travel is the art of revealing the extraordinary in the ordinary, one destination at a time.',
  'Discover the poetry of distant lands, where each city is a verse and every landscape a stanza. Let your journey be a sonnet of exploration, with each page telling a tale of wonder.',
  'Roam the globe with an open heart, and let the tales of faraway lands be the soundtrack to your adventures. Every step is a note, every destination a symphony, and you are the composer.',
  "Unleash the wanderlust within, as you traverse the world's tapestry. Through mountains and valleys, across oceans and deserts, find the magic that resides in the journey itself.",
  'Travel not only opens new horizons but also reveals the limitless possibilities within yourself. Let the landscapes you explore be the mirror reflecting the untapped wonders of your soul.',
  'Embark on a pilgrimage of the soul through the vast landscapes of the world. In every footprint left on foreign soil, find a piece of yourself that was waiting to be discovered.',
];

const identifiers = [
  {
    _id: '65e48061019853cce57ca236',
    id_number: '189001019802',
    phone: '+461234567890',
    full_name: 'Alice Johnson',
    email: 'alice_johnson@example.com',
  },
  {
    _id: '65e48061019853cce57ca238',
    id_number: '189001019830',
    phone: '+46987654321',
    full_name: 'Bob Smith',
    email: 'bob_smith@example.com',
  },
  {
    _id: '65e48061019853cce57ca23a',
    id_number: '189001019803',
    phone: '+463456789012',
    full_name: 'Charlie Brown',
    email: 'charlie_brown@example.com',
  },
  {
    _id: '65e48061019853cce57ca23c',
    id_number: '189001019804',
    phone: '+464567890123',
    full_name: 'Diana Martinez',
    email: 'diana_martinez@example.com',
  },
  {
    _id: '65e48061019853cce57ca23e',
    id_number: '189001019820',
    phone: '+465678901234',
    full_name: 'Ethan Davis',
    email: 'ethan_davis@example.com',
  },
  {
    _id: '65e48061019853cce57ca240',
    id_number: '189001019808',
    phone: '+466789012345',
    full_name: 'Fiona Miller',
    email: 'fiona_miller@example.com',
  },
  {
    _id: '65e48061019853cce57ca242',
    id_number: '189001019809',
    phone: '+467890123456',
    full_name: 'George White',
    email: 'george_white@example.com',
  },
  {
    _id: '65e48061019853cce57ca244',
    id_number: '189001019811',
    phone: '+468901234567',
    full_name: 'Haley Taylor',
    email: 'haley_taylor@example.com',
  },
  {
    _id: '65e48062019853cce57ca246',
    id_number: '189001019810',
    phone: '+469012345',
    full_name: 'Ian Clark',
    email: 'ian_clark@example.com',
  },
];

const max_documents_for_one_DB_operation = 1000;
const number_of_documents = 20000;

export async function generateDocuments() {
  let documents = [];
  for (let i = 0; i < identifiers.length; i++) {
    const person = identifiers[i];
    for (let j = 0; j < max_documents_for_one_DB_operation; j++) {
      const positiveOrNegative = Math.round(Math.random()) * 2 - 1;
      const randomDaysForStartDate =
        Math.round(Math.random() * 60) * positiveOrNegative;
      const randomDaysForEndDate =
        randomDaysForStartDate + Math.round(Math.random() * 60);
      const start_date = dayjs()
        .day(randomDaysForStartDate)
        .format('YYYY-MM-DD');
      const end_date = dayjs().day(randomDaysForEndDate).format('YYYY-MM-DD');
      const title = titles[Math.floor(Math.random() * titles.length)];
      const from =
        starting_points[Math.floor(Math.random() * starting_points.length)];
      const to = destinations[Math.floor(Math.random() * destinations.length)];
      const randomHour = Math.floor(Math.random() * 24); // 0 to 23
      const randomMinute = Math.floor(Math.random() * 60); // 0 to 59

      const randomTime = dayjs()
        .set('hour', randomHour)
        .set('minute', randomMinute);

      const time = randomTime.format('HH:mm');
      const document = {
        title,
        from,
        to,
        start_date,
        end_date,
        message: messages[Math.floor(Math.random() * messages.length)],
        created_by: {
          _id: person._id,
          id_number: person.id_number,
          phone: person.phone,
          full_name: person.full_name,
          email: person.email,
        },
        seats: Math.floor(Math.random() * 3) + 1,
        price: Math.floor(Math.random() * 1000) + 1,
        slug: generateSlugFrom(title, from, to, start_date, end_date),
        time,
      };
      documents.push(document);
      if (documents.length === max_documents_for_one_DB_operation) {
        const journeys = await JourneyModel.insertMany(documents);
        await UserModel.findByIdAndUpdate(
          {
            _id: person._id,
          },
          {
            $push: {
              journeys_shared: {
                $each: journeys.map((journey) => journey._id),
              },
            },
          }
        );
        documents = [];
      }
    }
  }
}
