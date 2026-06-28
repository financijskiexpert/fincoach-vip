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
  fb_caption: string  // gotov tekst za FB objavu (do 500 znakova)
  faq: { q: string; a: string }[]  // 3-5 pitanja za GEO / AI tražilice
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

// Kategorije za koje CTA uključuje i /kontakt link
const CONTACT_CATEGORIES = ['osiguranje', 'mentorstvo']

function buildCta(category: string | null | undefined): string {
  const cat = category ?? ''
  if (CONTACT_CATEGORIES.some(c => cat.includes(c))) {
    return `<div class="blog-cta"><p>📥 <strong>Preuzmi besplatni vodič</strong> — "5 koraka do financijske slobode": <a href="${SITE_URL}">fincoach.vip</a></p><p>🤝 Zainteresiran/a za suradnju ili mentorstvo u osiguranju? <a href="${SITE_URL}/kontakt">Javi mi se →</a></p><p>🎓 <a href="${SITE_URL}/volim-svoj-novac">FinCoach VIP program →</a></p></div>`
  }
  return `<div class="blog-cta"><p>📥 <strong>Preuzmi besplatni vodič</strong> — "5 koraka do financijske slobode": <a href="${SITE_URL}">fincoach.vip</a></p><p>🎓 Spreman/na za ozbiljnu transformaciju? <a href="${SITE_URL}/volim-svoj-novac">FinCoach VIP program →</a></p></div>`
}

const SYSTEM_PROMPT = `Ti si Brane Recek — financijski savjetnik s 30+ godina iskustva, autor FinCoach VIP programa "Volim Svoj Novac" i mentor novim osiguravajućim zastopnicima. Pišeš blog članke za fincoach.vip na hrvatskom jeziku.

KATEGORIJE:
- osobne-financije: proračun, štednja, dug, hitni fond
- investiranje: ETF, složena kamata, dugoročno bogatstvo
- psihologija-novca: mindset, emocionalna kupovina
- osiguranje: važnost zaštite, vrste, odabir — iz 30g iskustva u struci
- mentorstvo: razvoj karijere zastopnika, coaching, suradnja
- obiteljske-financije: djeca i novac, partnerski razgovori
- osobna-rast: navike, disciplina, postavljanje ciljeva, produktivnost — veza između osobnog razvoja i financijskog uspjeha

PRAVILA SADRŽAJA:
- Glas: topao, iskren, autoritativan ali ne arogantan. Pišeš kao mentor.
- 80% edukativno/vrijednost, 20% mehka prodaja.
- Konkretne brojke i primjeri (€, %, scenariji) — citatibilno za AI tražilice (GEO).
- Hrvatski jezik. Koristi "ti" formu. Nije ekavica.
- NE "kupi odmah", "ne propusti". Soft CTA samo na kraju.

STRUKTURA ČLANKA (1200-1600 riječi):
1. Hook — 2-3 snažne uvodne rečenice (priča, statistika ili pitanje).
2. Glavne sekcije — 4-6 <h2> blokova, svaki 150-250 riječi.
3. "Što sada napraviti?" — 3-5 konkretnih akcija za danas.
4. FAQ sekcija — OBAVEZNO, 3-5 pitanja i odgovora za AI tražilice. Format:
   <h2>Često postavljana pitanja</h2>
   <h3>Pitanje?</h3><p>Odgovor.</p>
5. CTA blok — korisnik će ga dobiti posebno, TI ga ne pišeš u content.

HTML FORMATIRANJE:
- Koristi <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>
- NE koristi <div>, <span>, <style>, inline CSS, <img>
- Ključne brojke u <strong>
- Snažna izjava u <blockquote>

SEO + GEO:
- Naslov: 50-70 znakova, sadrži glavnu ključnu riječ
- Slug: kratak kebab-case, bez dijakritike
- Excerpt: 140-160 znakova
- Meta title: 50-60 znakova
- Meta description: 140-160 znakova
- Najmanje 3 razložene statistike/brojke u tekstu

FB CAPTION (polje fb_caption):
- Max 500 znakova
- Hook + 2-3 rečenice + link placeholder [BLOG_URL]
- Emoji na početku rečenica
- Bez hashtagova
- Završava: "👉 [BLOG_URL]"

VRNI SAMO VALIDAN JSON, bez markdown wrappinga:
{
  "title": "...",
  "slug": "...",
  "excerpt": "...",
  "content": "<p>...</p><h2>...</h2>...<h2>Često postavljana pitanja</h2><h3>?</h3><p>.</p>",
  "meta_title": "...",
  "meta_description": "...",
  "fb_caption": "...",
  "faq": [{"q": "...", "a": "..."}, ...]
}`

export async function generateBlogPost(topic: {
  title: string
  angle?: string | null
  category?: string | null
  keywords?: string[] | null
}): Promise<GeneratedBlogPost> {
  const anthropic = getClient()

  const cta = buildCta(topic.category)
  const userPrompt = `Napiši blog članak na temu: "${topic.title}"
${topic.angle ? `Pristup: ${topic.angle}` : ''}
${topic.category ? `Kategorija: ${topic.category}` : ''}
${topic.keywords?.length ? `Ključne riječi: ${topic.keywords.join(', ')}` : ''}

Na kraju sadržaja (content), NAKON FAQ sekcije, dodaj točno ovaj CTA blok:
${cta}

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

  const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
  const parsed = JSON.parse(cleaned) as GeneratedBlogPost

  parsed.slug = parsed.slug
    .toLowerCase()
    .replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z').replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  if (!Array.isArray(parsed.faq)) parsed.faq = []
  if (!parsed.fb_caption) parsed.fb_caption = ''

  return parsed
}
