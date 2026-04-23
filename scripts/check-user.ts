import { createClient } from '@libsql/client'
import * as fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
for (const line of envContent.split('\n')) {
  const [key, ...rest] = line.split('=')
  if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
}

const db = createClient({
  url: process.env.TURSO_URL!,
  authToken: process.env.TURSO_TOKEN!,
})

async function run() {
  const result = await db.execute('SELECT id, username, email, is_admin, admin_pin FROM users')
  console.table(result.rows)
  process.exit(0)
}

run().catch((e) => { console.error(e); process.exit(1) })