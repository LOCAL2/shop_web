import { createClient } from '@libsql/client'
import * as fs from 'fs'

const env = fs.readFileSync('.env.local', 'utf-8')
for (const l of env.split('\n')) {
  const [k, ...v] = l.split('=')
  if (k && v.length) process.env[k.trim()] = v.join('=').trim()
}

const db = createClient({ url: process.env.TURSO_URL!, authToken: process.env.TURSO_TOKEN! })

db.execute("SELECT name FROM sqlite_master WHERE type='table'")
  .then(r => { console.log(r.rows.map((x: any) => x.name)); process.exit(0) })
  .catch(e => { console.error(e); process.exit(1) })
