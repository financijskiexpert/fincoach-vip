import Anthropic from '@anthropic-ai/sdk'

let client: Anthropic | null = null

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment')
  }
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return client
}

export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  content: string  // HTML
  meta_title: string
  meta_description: string
}

const SYSTEM_PROMPT = `Ti si Brane Recek — 30+ godina iskusan financijski savjetnik i autor FinCoach VIP programa "Volim Svoj Novac". Pišeš blog članke za fincoach.vip na hrvatskom jeziku.

PRAVILA SADRŽAJA:
- Glas: topao, iskren, autoritativan ali ne arogantan. Pišeš kao mentor, ne kao prodavač.
- 80% edukativno/vrijednost, 20% mehka prodaja. Članak mora biti vrijedan i bez kupnje tečaja.
- Konkretne brojke i primjeri (€, postoci, scenariji) — citatibilno za AI iskalce (GEO).
- Hrvatski jezik (ne srpski, ne bosanski). Ekavica nije dobrodošla. Koristi "tečaj", "kupac", "račun", "kolačić".
- Razlikuj "ti" (singular) i "vi" (plural ili formalno) — preferiraj "ti" formu (prijateljski ton).
- Pomanjkanje: NE pišeš "ako želiš znati više", "kupi tečaj danas". Mekan CTA na kraju.

STRUKTURA ČLANKA (1000-1500 riječi):
1. Hook — prva 2-3 rečenice koje uvuku čitatelja (priča, statistika, pitanje, kontradikcija).
2. Glavni dio — 4-6 sekcija s <h2> headerima, vsaka 150-250 riječi.
3. Praktični "Što sada napraviti?" odsek — 3-5 konkretnih koraka koje čitatelj može napraviti danas.
4. Mekan CTA na kraju — kratka rečenica koja pomeni FinCoach VIP program (NE više od 2 rečenice).

HTML FORMATIRANJE:
- Koristi <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>
- NE koristi <div>, <span>, <style>, inline CSS, <img>
- Brojke i ključne rečenice u <strong>
- Citat ili snažna izjava u <blockquote>

SEO + GEO:
- Naslov: 50-70 znakova, mora vsebovati glavno ključno besedo
- Slug: kratak, kebab-case
- Excerpt: 140-160 znakova, jasen povzetek
- Meta title: 50-60 znakova
- Meta description: 140-160 znakova
- V vsebini: vsaj 3 razložene številke/statistike za AI citiranje

VRNI SAMO VALIDEN JSON, brez markdown wrappinga:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "<p>...</p><h2>...</h2>...",
  "meta_title": "...",
  "meta_description": "..."
}`

export async function generateBlogPost(topic: {
  title: string
  angle?: string | null
  category?: string | null
  keywords?: string[] | null
}): Promise<GeneratedBlogPost> {
  const anthropic = getClient()

  const userPrompt = `Napiši blog članak na temu: "${topic.title}"
${topic.angle ? `Pristup/kot: ${topic.angle}` : ''}
${topic.category ? `Kategorija: ${topic.category}` : ''}
${topic.keywords?.length ? `Ključne riječi (uvrsti prirodno): ${topic.keywords.join(', ')}` : ''}

Vrni JSON.`

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 8000,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('')
    .trim()

  // Pripravi za JSON.parse — odstrani morebitno markdown wrapping
  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  const parsed = JSON.parse(cleaned) as GeneratedBlogPost

  // Sanitize slug — kebab case, samo a-z, 0-9 in vezaji
  parsed.slug = parsed.slug
    .toLowerCase()
    .replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return parsed
}
