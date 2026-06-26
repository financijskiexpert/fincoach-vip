// Kurirana kolekcija Unsplash fotografija po kategorijama
// Format: https://images.unsplash.com/photo-{ID}?w=1200&q=80&auto=format&fit=crop

const PHOTO_BASE = 'https://images.unsplash.com/photo-'

type PhotoEntry = { id: string; alt: string }

const PHOTOS: Record<string, PhotoEntry[]> = {
  'osobne-financije': [
    { id: '1554224155-6726b3ff858f', alt: 'Planiranje osobnog proračuna' },
    { id: '1579621970563-ebec7560ff3e', alt: 'Štednja i financijska sloboda' },
    { id: '1563013544-824ae1b704d3', alt: 'Novac i financijsko planiranje' },
    { id: '1611974789855-9c2a0a7236a3', alt: 'Upravljanje osobnim financijama' },
    { id: '1618044733300-9472054094ee', alt: 'Financijski ciljevi i planiranje' },
  ],
  'investiranje': [
    { id: '1590283603385-17ffb3a7f29f', alt: 'Ulaganje i rast kapitala' },
    { id: '1559526324-593bc073d938', alt: 'Dugoročno investiranje' },
    { id: '1642543492481-44e81e3914a7', alt: 'Financijski rast i investicije' },
    { id: '1611974789855-9c2a0a7236a3', alt: 'Investicijska strategija' },
    { id: '1460925895917-afdab827c52f', alt: 'Analiza tržišta i ulaganja' },
  ],
  'psihologija-novca': [
    { id: '1493612276216-ee3925520721', alt: 'Mindset i odnos prema novcu' },
    { id: '1516321318423-f06f85e504b3', alt: 'Psihologija financijskih odluka' },
    { id: '1434626881859-194d67b2b86f', alt: 'Mentalni pristup financijama' },
    { id: '1506784983877-45594efa4cbe', alt: 'Emocionalna inteligencija i novac' },
    { id: '1499750310107-5fef28a66936', alt: 'Razmišljanje o financijama' },
  ],
  'osiguranje': [
    { id: '1609220136736-443140ad8aee', alt: 'Obiteljska zaštita i osiguranje' },
    { id: '1450101499163-c8848c66ca85', alt: 'Financijska sigurnost i zaštita' },
    { id: '1582213782179-e0d53f98f2ca', alt: 'Osiguranje i planiranje budućnosti' },
    { id: '1521791055366-0d553872952f', alt: 'Zaštita obitelji i imovine' },
    { id: '1573496359142-b8d87734a5a2', alt: 'Profesionalni savjet o osiguranju' },
  ],
  'mentorstvo': [
    { id: '1552664730-d307ca884978', alt: 'Mentorstvo i profesionalni razvoj' },
    { id: '1559136555-9303baea8eae', alt: 'Coaching i karijerni razvoj' },
    { id: '1521737604082-b5dc6e5a9f79', alt: 'Timski rad i podrška' },
    { id: '1573497019940-1c28c88b4f3e', alt: 'Razvoj karijere u osiguranju' },
    { id: '1507003211169-0a1dd7228f2d', alt: 'Poslovni mentor i savjetnik' },
  ],
  'obiteljske-financije': [
    { id: '1511895426328-dc8714191011', alt: 'Obiteljske financije i planiranje' },
    { id: '1469571486292-0ba58a3f068b', alt: 'Obitelj i financijska sigurnost' },
    { id: '1590650153855-d9e808231d41', alt: 'Dom i obiteljski proračun' },
    { id: '1484480974693-6ca0a78fb36b', alt: 'Financijsko planiranje za obitelj' },
    { id: '1476703993599-0035a44b8ff5', alt: 'Budućnost obitelji i štednja' },
  ],
}

// Default fotografije ako kategorija nije prepoznata
const DEFAULT_PHOTOS: PhotoEntry[] = [
  { id: '1554224155-6726b3ff858f', alt: 'Financijsko planiranje' },
  { id: '1579621970563-ebec7560ff3e', alt: 'Štednja i ulaganje' },
  { id: '1590283603385-17ffb3a7f29f', alt: 'Financijska sloboda' },
  { id: '1460925895917-afdab827c52f', alt: 'Uspjeh i financije' },
  { id: '1573496359142-b8d87734a5a2', alt: 'Profesionalni savjet' },
]

function getPhotosForCategory(category: string | null | undefined): PhotoEntry[] {
  if (!category) return DEFAULT_PHOTOS
  for (const key of Object.keys(PHOTOS)) {
    if (category.includes(key) || key.includes(category)) {
      return PHOTOS[key]
    }
  }
  return DEFAULT_PHOTOS
}

function photoUrl(id: string): string {
  return `${PHOTO_BASE}${id}?w=1200&q=80&auto=format&fit=crop`
}

// Vraća 2-3 fotografije za kategoriju (deterministički — bez random, isti članak = iste slike)
export function selectPhotos(category: string | null | undefined, count: 2 | 3 = 2): PhotoEntry[] {
  const pool = getPhotosForCategory(category)
  return pool.slice(0, count).map(p => ({ ...p, url: photoUrl(p.id) })) as any
}

// Umeće slike u HTML sadržaj nakon 1. i 3. H2 sekcije (i opcionalno 5.)
export function injectImagesIntoContent(
  html: string,
  category: string | null | undefined
): string {
  const photos = selectPhotos(category, 2)
  const positions = [0, 2] // nakon 1. i 3. H2

  let h2Count = 0
  let result = html

  // Ubacujemo od kraja prema početku da indeksi ostanu točni
  const h2Regex = /<h2[^>]*>/g
  const matches: { index: number; fullMatch: string }[] = []
  let m: RegExpExecArray | null

  while ((m = h2Regex.exec(html)) !== null) {
    matches.push({ index: m.index, fullMatch: m[0] })
  }

  // Odaberi pozicije za umetanje (nakon 1. i 3. H2, ako postoje)
  const insertAfter: number[] = []
  positions.forEach((pos, i) => {
    if (matches[pos]) insertAfter.push({ matchIndex: matches[pos].index, photoIndex: i } as any)
  })

  // Umetni slike od kraja prema početku
  ;(insertAfter as any[]).reverse().forEach(({ matchIndex, photoIndex }: any) => {
    const photo = photos[photoIndex]
    if (!photo) return
    const imgHtml = `\n<figure class="blog-image"><img src="${(photo as any).url}" alt="${photo.alt}" loading="lazy" /><figcaption>${photo.alt}</figcaption></figure>\n`
    // Pronađi kraj tog H2 bloka (sljedeći <h2 ili kraj)
    const afterH2 = matchIndex
    result = result.slice(0, afterH2) + imgHtml + result.slice(afterH2)
  })

  return result
}
