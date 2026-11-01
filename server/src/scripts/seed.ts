import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Listing } from '../models/Listing.js';
import { Report } from '../models/Report.js';
import { ENV } from '../config/env.js';

const bcryptLib: any = (bcrypt as any).default || bcrypt;

const DEMO_USERS = [
  {
    name: 'Aravind Sharma',
    email: 'aravind@campus.edu',
    password: 'campuspassword123',
    hostelArea: 'Hostel 4 (C-Block)',
    roomNumber: '312',
    phone: '+91 98765 43210',
    whatsappNumber: '+91 98765 43210',
    preferredContactMethod: 'whatsapp' as const,
  },
  {
    name: 'Ananya Rao',
    email: 'ananya.r@campus.edu',
    password: 'campuspassword123',
    hostelArea: 'Sarojini Bhawan (Block B)',
    roomNumber: '204',
    phone: '+91 98123 45678',
    whatsappNumber: '+91 98123 45678',
    preferredContactMethod: 'whatsapp' as const,
  },
  {
    name: 'Kabir Mehta',
    email: 'kabir.m@campus.edu',
    password: 'campuspassword123',
    hostelArea: 'Hostel 9 (Mess Side)',
    roomNumber: '115',
    phone: '+91 99887 76655',
    whatsappNumber: '+91 99887 76655',
    preferredContactMethod: 'phone' as const,
  },
];

const SEED_LISTINGS = [
  // Books
  {
    title: 'Cormen CLRS Introduction to Algorithms 3rd Ed., highlighted',
    description:
      'Standard textbook for DSA and competitive programming. Neatly highlighted in chapters 1-15, remainder untouched. Paging is crisp with binding in great shape. Can deliver to Hostel 4 or 7 mess.',
    price: 650,
    category: 'Books',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Halliday & Resnick Fundamentals of Physics 10th Ed.',
    description:
      'Used for 1st-year physics course. Pristine condition with no markings or torn corners. Includes the access code sheet (unscratched). Pickup from Sarojini Bhawan.',
    price: 520,
    category: 'Books',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Operating System Concepts (Silberschatz Dinosaur Book)',
    description:
      'Classic OS textbook. Invaluable for semester end-sems and placement prep. Minor edge wear on cover, all internal pages intact.',
    price: 400,
    category: 'Books',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'sold', // Showcase rubber stamp
  },
  {
    title: 'Higher Engineering Mathematics by B.S. Grewal 44th Edition',
    description:
      'Saved my math grades in 2nd semester. Contains solved step-by-step papers from previous 5 years. A must-have for all engineering branches.',
    price: 450,
    category: 'Books',
    condition: 'Fair',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Atomic Habits by James Clear (Hostel shelf clearout)',
    description:
      'Read once during mid-term break. Clean copy without any dog-ears. Perfect read to build good campus routines. Price firm.',
    price: 190,
    category: 'Books',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'GATE CSE Made Easy handwritten notes complete set',
    description:
      'Full 12 subject spiral notebooks compiled by AIR 84 batch senior. Includes short notes formula booklet and previous 10 year solved test booklet.',
    price: 1400,
    category: 'Books',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },

  // Cycles
  {
    title: 'Hero Sprint 21-speed MTB, 1 yr old with wire lock',
    description:
      'Hero Sprint 26T cycle with Shimano Tourney gears. Smooth shifting, recently greased chain and new brake pads. Comes with heavy duty spiral number lock and bell.',
    price: 3600,
    category: 'Cycles',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Firefox Target 26T Hardtail Cycle - recently tuned',
    description:
      'Alloy frame, front suspension that actually works. Dual disc brakes. Super light for riding between academic block and hostels. Graduating next month so selling early.',
    price: 5800,
    category: 'Cycles',
    condition: 'Like new',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'BSA Roadster Single Speed with front steel basket',
    description:
      'Sturdy campus commuter. Steel basket easily holds 2 heavy textbooks and laptop backpack. Fresh tube in rear tyre. Low maintenance, zero fuss.',
    price: 1850,
    category: 'Cycles',
    condition: 'Fair',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Decathlon Rockrider ST30 Mountain Bike (Leaving campus)',
    description:
      'Purchased 8 months ago from Decathlon store. Invoice available. Original Btwin tyres with 85% tread left. Mudguards attached.',
    price: 4400,
    category: 'Cycles',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'sold', // Showcase rubber stamp
  },

  // Gadgets
  {
    title: 'Casio fx-991EX Classwiz Scientific Calculator (Allowed in exams)',
    description:
      'The gold standard calculator for engineering examinations. High-resolution spreadsheet view, matrix & vector calculations. Battery recently changed. Original slide cover included.',
    price: 850,
    category: 'Gadgets',
    condition: 'Like new',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Logitech MK270 Wireless Keyboard and Mouse combo',
    description:
      'Compact wireless keyboard with nano USB receiver. 2.4GHz connection without lag. Used with external monitor in hostel room for coding.',
    price: 900,
    category: 'Gadgets',
    condition: 'Good',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Mi 20000mAh Power Bank 3i 18W Fast Charging',
    description:
      'Triple output ports, two-way fast charging. Essential during electricity cuts or long study sessions in the central library. Holds charge for 4 full phone cycles.',
    price: 750,
    category: 'Gadgets',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1609592424300-e740d96d296c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'boAt Stone 650 10W Bluetooth Speaker - deep bass',
    description:
      'IPX5 water-resistant, 7 hours battery backup. Perfect sound for wing celebrations, cricket match screenings, or evening tea sessions.',
    price: 990,
    category: 'Gadgets',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Sony WH-CH520 Wireless Bluetooth Headphones (6 months used)',
    description:
      'Up to 50 hours battery life with quick charge. DSEE sound enhancement. Multipoint connection connects laptop & phone simultaneously. Black color, cushions sanitized.',
    price: 2100,
    category: 'Gadgets',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'TP-Link N300 Wi-Fi Router + 5m Cat6 LAN cable',
    description:
      'Converts hostel LAN wall port into personal high-speed room Wi-Fi. Pre-configured, just plug and browse. Comes with 12V adapter and long ethernet cable.',
    price: 600,
    category: 'Gadgets',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },

  // Hostel Essentials
  {
    title: 'Bajaj 1000W Immersion Water Heater Rod (Winter lifesaver)',
    description:
      'Waterproof immersion rod with hanging bucket hook. Heats a full bucket of water in 8 minutes flat. Safe bakelite handle, completely shockproof.',
    price: 280,
    category: 'Hostel Essentials',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Prestige 1.5L Stainless Steel Electric Kettle with auto-cut',
    description:
      'Late-night Maggi, tea, boiling eggs or warm water. 1500W rapid boiling, 360-degree swivel base. Auto cut-off prevents dry boiling. Sparkling clean interior.',
    price: 520,
    category: 'Hostel Essentials',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Milton 20L Insulated Cool Water Camper / Dispenser',
    description:
      'High insulation foam keeps water cool for 24+ hours in the summer. Sturdy tap with zero leaks. Wide mouth for easy cleaning and filling at the water cooler.',
    price: 360,
    category: 'Hostel Essentials',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Usha 400mm High-Speed Pedestal Table Fan with 3 speeds',
    description:
      'Essential for humid months when hostel ceiling fans fail to reach the corner bed. Smooth oscillation, aerodynamically designed blades with safety grill.',
    price: 1100,
    category: 'Hostel Essentials',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1618941716939-553df3c6c278?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Surge Protector 6-Socket Extension Board with 4m cable',
    description:
      'Goldmedal spike guard with master switch, surge suppression indicator, and individual international sockets. Easily charges laptop, phone, lamp, and kettle together.',
    price: 320,
    category: 'Hostel Essentials',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Foldable Metal Clothes Drying Rack (Balcony friendly)',
    description:
      'Rust-proof powder coated drying stand. Expands to hold 18 clothes at once, folds flat against the wall behind the door. Sturdy even during windy evenings.',
    price: 450,
    category: 'Hostel Essentials',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Rechargeable Mosquito Swatter Bat with LED Torch',
    description:
      'High-voltage electric mesh bat with inbuilt USB charging port. Handy built-in LED flashlight for night sweeps. Battery holds charge for over 2 weeks.',
    price: 170,
    category: 'Hostel Essentials',
    condition: 'Fair',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'sold', // Showcase rubber stamp
  },

  // Furniture
  {
    title: 'Solid Sheesham Wood Study Chair with soft cushion',
    description:
      'Extremely comfortable ergonomic wooden back support for late-night study marathons. Better than the plastic college chairs. Dense foam padded seat.',
    price: 850,
    category: 'Furniture',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Foldable Bed Study Table with iPad & cup holder slot',
    description:
      'Engineered wood surface with curved ergonomic edge and non-slip sponge legs. Great for attending online lectures or watching movies from bed.',
    price: 320,
    category: 'Furniture',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Nilkamal 3-tier Plastic Modular Storage Drawer Organizer',
    description:
      'Smooth rolling drawers for toiletries, stationary, notebooks, and snacks. Compact footprint that slides right beside the hostel wardrobe.',
    price: 600,
    category: 'Furniture',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Full Length Door Hanging Mirror 4ft x 1.5ft with wood border',
    description:
      'Clear, distortion-free reflection with hooks that slip over standard hostel room doors. No drilling needed. Wood grain finish border.',
    price: 380,
    category: 'Furniture',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Coir & High Density Foam Single Mattress 72x36 inches',
    description:
      'Firm orthopedic back support with breathable cotton zipper cover. Sanitized and bagged. Much thicker than standard hostel cot mattresses.',
    price: 1250,
    category: 'Furniture',
    condition: 'Good',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },

  // Other
  {
    title: 'Yonex Nanoray 7000 Badminton Racket with thermal bag',
    description:
      'Graphite composite frame with BG65 titanium stringing at 24lbs tension. Perfect for evening games at the campus sports complex. Grip newly re-taped.',
    price: 750,
    category: 'Other',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Nivia Storm Football Size 5 + Air Pump with brass needle',
    description:
      'Hand-stitched synthetic rubber 32-panel ball suitable for grass and synthetic turf. Holds air pressure consistently. Comes with dual-action pump.',
    price: 380,
    category: 'Other',
    condition: 'Like new',
    hostelArea: 'Hostel 4 (C-Block)',
    userIndex: 0,
    images: [
      'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Philips 1000W Dry Iron with Linished American Heritage Soleplate',
    description:
      'Lightweight iron with 1.8m swivel cord and temperature knob for silk, cotton, wool. Uniform heating ensures crisp presentation for viva and interviews.',
    price: 440,
    category: 'Other',
    condition: 'Like new',
    hostelArea: 'Sarojini Bhawan (Block B)',
    userIndex: 1,
    images: [
      'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
  {
    title: 'Granada Acoustic Guitar 38" with padded bag, tuner & capo',
    description:
      'Spruce top acoustic guitar with rich resonant tone. Low string action makes it easy on beginner fingertips. Comes with digital clip-on tuner, capo, and 3 plectrums.',
    price: 3100,
    category: 'Other',
    condition: 'Good',
    hostelArea: 'Hostel 9 (Mess Side)',
    userIndex: 2,
    images: [
      'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'active',
  },
];

async function seedDatabase() {
  console.log('📌 Connecting to MongoDB for seeding...');
  await mongoose.connect(ENV.MONGODB_URI);

  console.log('🧹 Clearing existing collections...');
  await Promise.all([
    User.deleteMany({}),
    Listing.deleteMany({}),
    Report.deleteMany({}),
  ]);

  console.log('👤 Creating 3 demo campus users...');
  const salt = await bcryptLib.genSalt(10);
  const createdUsers = [];

  for (const u of DEMO_USERS) {
    const passwordHash = await bcryptLib.hash(u.password, salt);
    const user = await User.create({
      name: u.name,
      email: u.email,
      passwordHash,
      hostelArea: u.hostelArea,
      roomNumber: u.roomNumber,
      phone: u.phone,
      whatsappNumber: u.whatsappNumber,
      preferredContactMethod: u.preferredContactMethod,
      savedListings: [],
    });
    createdUsers.push(user);
    console.log(`   ✓ Created ${user.name} (${user.email}) - pass: ${u.password}`);
  }

  console.log(`📋 Seeding ${SEED_LISTINGS.length} realistic campus listings...`);
  const createdListings = [];

  for (const item of SEED_LISTINGS) {
    const seller = createdUsers[item.userIndex];
    const contactInfo =
      seller.preferredContactMethod === 'whatsapp'
        ? seller.whatsappNumber || seller.phone
        : seller.preferredContactMethod === 'phone'
        ? seller.phone
        : seller.email;

    const listing = await Listing.create({
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      condition: item.condition,
      hostelArea: item.hostelArea,
      images: item.images,
      sellerId: seller._id,
      sellerName: seller.name,
      contactMethod: seller.preferredContactMethod,
      contactInfo: contactInfo || seller.email,
      status: item.status,
      viewsCount: Math.floor(Math.random() * 45) + 3,
    });
    createdListings.push(listing);
  }

  // Pre-seed some saved items for user 0
  createdUsers[0].savedListings = [
    createdListings[1]._id,
    createdListings[7]._id,
    createdListings[14]._id,
  ];
  await createdUsers[0].save();

  console.log(`✅ Database seeding completed successfully!`);
  console.log(`   - 3 Users created`);
  console.log(`   - ${createdListings.length} Realistic Listings created across 6 categories`);
  console.log(`   - Demo login credentials:`);
  console.log(`     Email: aravind@campus.edu  | Password: campuspassword123`);
  console.log(`     Email: ananya.r@campus.edu | Password: campuspassword123`);
  console.log(`     Email: kabir.m@campus.edu   | Password: campuspassword123`);

  await mongoose.disconnect();
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
