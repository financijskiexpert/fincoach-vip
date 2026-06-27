// Slike za blog članke — Lorem Picsum (uvijek radi, besplatno, konzistentno po seedu)
// https://picsum.photos/seed/{seed}/1200/630

type PhotoEntry = { seed: string; alt: string }

const PHOTOS: Record<string, PhotoEntry[]> = {
  'osobne-financije': [
    { seed: 'budget-plan', alt: 'Planiranje osobnog proračuna' },
    { seed: 'savings-jar', alt: 'Štednja i financijska sloboda' },
    { seed: 'finance-desk', alt: 'Upravljanje osobnim financijama' },
  ],
  'investiranje': [
    { seed: 'investment-growth', alt: 'Ulaganje i rast kapitala' },
    { seed: 'stock-market', alt: 'Dugoročno investiranje' },
    { seed: 'wealth-building', alt: 'Izgradnja bogatstva' },
  ],
  'psihologija-novca': [
    { seed: 'mindset-money', alt: 'Mindset i odnos prema novcu' },
    { seed: 'financial-mindset', alt: 'Psihologija financijskih odluka' },
    { seed: 'decision-making', alt: 'Emocionalna inteligencija i novac' },
  ],
  'osiguranje': [
    { seed: 'family-protection', alt: 'Obiteljska zaštita i sigurnost' },
    { seed: 'insurance-plan', alt: 'Financijska sigurnost i osiguranje' },
    { seed: 'life-insurance', alt: 'Planiranje budućnosti s osiguranjem' },
  ],
  'mentorstvo': [
    { seed: 'mentor-coach', alt: 'Mentorstvo i profesionalni razvoj' },
    { seed: 'career-growth', alt: 'Razvoj karijere u osiguranju' },
    { seed: 'business-mentor', alt: 'Poslovni mentor i savjetnik' },
  ],
  'obiteljske-financije': [
    { seed: 'family-finance', alt: 'Obiteljske financije i planiranje' },
    { seed: 'home-budget', alt: 'Dom i obiteljski proračun' },
    { seed: 'family-savings', alt: 'Budućnost obitelji i štednja' },
  ],
}

const DEFAULT_PHOTOS: PhotoEntry[] = [
  { seed: 'financial-freedom', alt: 'Financijsko planiranje' },
  { seed: 'money-management', alt: 'Upravljanje novcem' },
  { seed: 'personal-finance', alt: 'Osobne financije' },
]

function getPhotosForCategory(category: string | null | undefined): PhotoEntry[] {
  if (!category) return DEFAULT_PHOTOS
  for (const key of Object.keys(PHOTOS)) {
    if (category.includes(key) || key.includes(category)) return PHOTOS[key]
  }
  return DEFAULT_PHOTOS
}

function photoUrl(seed: string): string {
  return `https://picsum.photos/seed/${seed}/1200/630`
}

export function getCoverImageUrl(category: string | null | undefined, slug: string): string {
  const pool = getPhotosForCategory(category)
  const seed = pool[0]?.seed ?? 'financial-freedom'
  return `https://picsum.photos/seed/${seed}-${slug.slice(0, 12)}/800/450`
}

// Umeće slike u HTML sadržaj — ispred 1. i 3. naslova H2
export function injectImagesIntoContent(
  html: string,
  category: string | null | undefined
): string {
  const pool = getPhotosForCategory(category)
  const photos = pool.slice(0, 2)

  // Pronađi sve H2 pozicije
  const h2Regex = /<h2[^>]*>/g
  const matches: number[] = []
  let m: RegExpExecArray | null
  while ((m = h2Regex.exec(html)) !== null) {
    matches.push(m.index)
  }

  if (matches.length === 0) return html

  // Ubaci sliku ispred 1. H2 i ispred 3. H2 (ako postoji), od kraja prema početku
  const insertPositions: { pos: number; photo: PhotoEntry }[] = []
  if (matches[0] !== undefined) insertPositions.push({ pos: matches[0], photo: photos[0] })
  if (matches[2] !== undefined && photos[1]) insertPositions.push({ pos: matches[2], photo: photos[1] })

  // Sortiraj od kraja prema početku
  insertPositions.sort((a, b) => b.pos - a.pos)

  let result = html
  for (const { pos, photo } of insertPositions) {
    const imgHtml = `\n<figure class="blog-image"><img src="${photoUrl(photo.seed)}" alt="${photo.alt}" loading="lazy" width="1200" height="630" /><figcaption>${photo.alt}</figcaption></figure>\n`
    result = result.slice(0, pos) + imgHtml + result.slice(pos)
  }

  return result
}
