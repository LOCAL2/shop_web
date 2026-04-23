'use server'

import { db } from '@/lib/db'
import { StoreSettings, DEFAULT_SETTINGS } from '@/lib/types'
import { revalidatePath } from 'next/cache'

function rowToSettings(row: Record<string, unknown>): StoreSettings {
  let partnerApps: Array<{ name: string; logo: string }> = []
  try { partnerApps = JSON.parse(String(row.app_name ?? '[]')) } catch {}

  return {
    storeName:      String(row.store_name   ?? DEFAULT_SETTINGS.storeName),
    tagline:        String(row.tagline       ?? DEFAULT_SETTINGS.tagline),
    logoText:       String(row.logo_text     ?? DEFAULT_SETTINGS.logoText),
    primaryColor:   String(row.primary_color ?? DEFAULT_SETTINGS.primaryColor),
    accentColor:    String(row.accent_color  ?? DEFAULT_SETTINGS.accentColor),
    heroTitle:      String(row.hero_title    ?? DEFAULT_SETTINGS.heroTitle),
    heroSubtitle:   String(row.hero_subtitle ?? DEFAULT_SETTINGS.heroSubtitle),
    heroImage:      String(row.hero_image    ?? DEFAULT_SETTINGS.heroImage),
    currency:       String(row.currency      ?? DEFAULT_SETTINGS.currency),
    currencySymbol: String(row.currency_symbol ?? DEFAULT_SETTINGS.currencySymbol),
    showHero:       Number(row.show_hero ?? 1) === 1,
    footerText:     String(row.footer_text   ?? DEFAULT_SETTINGS.footerText),
    partnerApps,
    socialLinks: {
      facebook:  String(row.social_facebook  ?? ''),
      instagram: String(row.social_instagram ?? ''),
      line:      String(row.social_line      ?? ''),
    },
  }
}

export async function getSettings(): Promise<StoreSettings> {
  'use cache'
  const result = await db.execute('SELECT * FROM settings WHERE id = 1')
  if (result.rows.length === 0) return DEFAULT_SETTINGS
  return rowToSettings(result.rows[0] as Record<string, unknown>)
}

export async function saveSettings(s: StoreSettings): Promise<void> {
  await db.execute({
    sql: `UPDATE settings SET
      store_name = ?, tagline = ?, logo_text = ?,
      primary_color = ?, accent_color = ?,
      hero_title = ?, hero_subtitle = ?, hero_image = ?,
      currency = ?, currency_symbol = ?, show_hero = ?,
      footer_text = ?, app_name = ?, app_logo = ?,
      social_facebook = ?, social_instagram = ?, social_line = ?
    WHERE id = 1`,
    args: [
      s.storeName, s.tagline, s.logoText,
      s.primaryColor, s.accentColor,
      s.heroTitle, s.heroSubtitle, s.heroImage,
      s.currency, s.currencySymbol, s.showHero ? 1 : 0,
      s.footerText,
      JSON.stringify(s.partnerApps),
      '',
      s.socialLinks.facebook, s.socialLinks.instagram, s.socialLinks.line,
    ],
  })
  revalidatePath('/', 'layout')
}
