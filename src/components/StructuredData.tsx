/**
 * JSON-LD structured data komponente za SEO/GEO.
 * Vstavi <CourseSchema /> na /volim-svoj-novac, <FAQSchema /> kjer so FAQ-i, itd.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fincoach.vip'

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'FinCoach VIP',
        url: SITE_URL,
        logo: `${SITE_URL}/logo/fincoach-logo-horizontal.svg`,
        description: '90-dnevni online program financijske transformacije i edukacije o osobnim financijama.',
        founder: {
          '@type': 'Person',
          name: 'Brane Recek',
          jobTitle: 'Financijski savjetnik',
        },
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Kidričeva 2',
          postalCode: '2000',
          addressLocality: 'Maribor',
          addressCountry: 'SI',
        },
        email: 'brane@fincoach.vip',
        sameAs: [],
      }}
    />
  )
}

export function CourseSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: 'Volim Svoj Novac — 90-dnevni financijski program',
        description: '90 video lekcija koje mijenjaju vaš odnos prema novcu — od mindset-a do praktičnih sustava štednje i investiranja.',
        provider: {
          '@type': 'Organization',
          name: 'FinCoach VIP',
          sameAs: SITE_URL,
        },
        instructor: {
          '@type': 'Person',
          name: 'Brane Recek',
        },
        url: `${SITE_URL}/volim-svoj-novac`,
        inLanguage: 'hr',
        educationalLevel: 'Beginner',
        timeRequired: 'P90D',
        offers: {
          '@type': 'Offer',
          price: '397',
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `${SITE_URL}/volim-svoj-novac`,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '500',
          bestRating: '5',
          worstRating: '1',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: 'PT5M',
        },
      }}
    />
  )
}

export function FAQSchema({ faqs }: { faqs: { q: string; a: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(f => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      }}
    />
  )
}

export function BlogPostingSchema({
  title,
  excerpt,
  slug,
  publishedAt,
  image,
}: {
  title: string
  excerpt: string
  slug: string
  publishedAt?: string | null
  image?: string | null
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: excerpt,
        image: image ?? `${SITE_URL}/og-image.jpg`,
        datePublished: publishedAt,
        dateModified: publishedAt,
        author: {
          '@type': 'Person',
          name: 'Brane Recek',
        },
        publisher: {
          '@type': 'Organization',
          name: 'FinCoach VIP',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/logo/fincoach-logo-horizontal.svg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/blog/${slug}`,
        },
        inLanguage: 'hr',
      }}
    />
  )
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: item.name,
          item: item.url,
        })),
      }}
    />
  )
}
