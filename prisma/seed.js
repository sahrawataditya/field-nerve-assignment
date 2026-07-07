import { PrismaClient } from '../generated/prisma/client.ts'
import { PrismaPg } from '@prisma/adapter-pg'

const NAMES = [
  'Acme Corp', 'GlobalTech', 'NexGen Solutions', 'Pinnacle Systems',
  'Vertex Dynamics', 'Apex Innovations', 'CoreLogic Inc', 'FusionWorks',
  'Stratus Group', 'Meridian Enterprises', 'Orion Technologies',
  'Crestline Analytics', 'Zenith Digital', 'Pulse Networks',
  'Titan Manufacturing', 'Quantum Labs', 'Vanguard Services',
  'Sparrow Logistics', 'Atlas Commerce', 'Civic Builders',
  'Driftwood Media', 'Ironclad Security', 'Pegasus Health',
  'Praxis Education', 'Summit Retail'
]

const DOMAINS = ['example.com', 'mail.com', 'corp.net', 'business.io', 'services.co']
const VENDOR_TYPES = ['individual', 'company', 'startup', 'enterprise']
const CATEGORIES = ['technology', 'healthcare', 'education', 'finance', 'retail', 'logistics']
const LOCATIONS = ['New York', 'London', 'Tokyo', 'Berlin', 'Singapore', 'Mumbai', 'Sydney', 'Toronto', 'Dubai', 'Sao Paulo']

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function pickWeighted(statuses) {
  const r = Math.random()
  let cumulative = 0
  for (const { value, weight } of statuses) {
    cumulative += weight
    if (r < cumulative) return value
  }
  return statuses[statuses.length - 1].value
}

function generateVendors(count) {
  const usedEmails = new Set()
  const vendors = []

  for (let i = 0; i < count; i++) {
    const name = NAMES[i]
    const slug = name.toLowerCase().replace(/\s/g, '')
    let email = `${slug}@${pick(DOMAINS)}`
    let attempt = 0
    while (usedEmails.has(email)) {
      attempt++
      email = `${slug}${attempt}@${pick(DOMAINS)}`
    }
    usedEmails.add(email)

    vendors.push({
      name,
      email,
      vendor_type: pick(VENDOR_TYPES),
      category: pick(CATEGORIES),
      operating_location: pick(LOCATIONS),
      status: pickWeighted([
        { value: 'free', weight: 0.7 },
        { value: 'premium', weight: 0.2 },
        { value: 'verified', weight: 0.1 },
      ]),
      rating: Math.floor(Math.random() * 6),
    })
  }

  return vendors
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

try {
  const vendors = generateVendors(25)
  const result = await prisma.vendor.createMany({
    data: vendors,
    skipDuplicates: true,
  })
  console.log(`Seeded ${result.count} vendors`)
} catch (err) {
  console.error('Seed failed:', err)
  process.exit(1)
} finally {
  await prisma.$disconnect()
}
