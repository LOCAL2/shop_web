import { createClient } from '@libsql/client'
import * as fs from 'fs'
import { createHash } from 'crypto'

const envContent = fs.readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
})

const username = process.argv[2]
const pin = process.argv[3]

if (!username || !pin) {
  console.error('Usage: npx tsx scripts/set-admin-pin.ts <username> <pin>')
  process.exit(1)
}

async function run() {
  const hashed = createHash('sha256').update(pin).digest('hex')
  await db.execute({
    sql: 'UPDATE users SET admin_pin = ? WHERE username = ?',
    args: [hashed, username],
  })
  console.log(`PIN set for ${username}`)
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })
