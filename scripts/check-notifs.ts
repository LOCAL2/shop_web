import { createClient } from '@libsql/client'
import * as fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf-8')
for (const l of env.split('\n')) {
  const [k, ...v] = l.split('=')
  if (k && v.length) process.env[k.trim()] = v.join('=').trim()
}

const db = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN! })

async function run() {
  const r = await db.execute('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10')
  console.table(r.rows)
  process.exit(0)
}
run().catch(e => { console.error(e); process.exit(1) })
