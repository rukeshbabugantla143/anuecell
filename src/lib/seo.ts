import type { Metadata } from 'next'

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://anuecell.com').replace(/\/$/, '')
export const SITE_NAME = 'ANU E-Cell NEC'
export const DEFAULT_TITLE = 'ANU E-Cell NEC | Empowering Innovators & Student Startups'
export const DEFAULT_DESCRIPTION =
  'Official Entrepreneurship Cell of Acharya Nagarjuna University (NEC). Fostering innovation, student-led startups, hackathons, incubations, and entrepreneurial leadership.'
export const DEFAULT_IMAGE = `${SITE_URL}/E-CELL.png`

/**
 * Ensures any image URL is converted into a fully qualified absolute HTTPS URL,
 * which is strictly required for WhatsApp, Facebook, LinkedIn and Twitter crawlers.
 */
export function getAbsoluteImageUrl(imagePath?: string | null): string {
  if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
    return DEFAULT_IMAGE
  }

  const trimmed = imagePath.trim()
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed
  }

  const cleanPath = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return `${SITE_URL}${cleanPath}`
}

/**
 * Ensures any canonical path is converted into an absolute URL.
 */
export function getAbsoluteUrl(path?: string): string {
  if (!path || path === '/') {
    return SITE_URL
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${SITE_URL}${cleanPath}`
}

export interface ConstructMetadataProps {
  title?: string
  description?: string
  image?: string | null
  imageAlt?: string
  canonicalPath?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  tags?: string[]
  noIndex?: boolean
}

/**
 * Reusable, type-safe metadata generator across all website pages.
 * Guarantees proper OpenGraph, Twitter Card (summary_large_image),
 * absolute image URLs, and canonical tags for social sharing platforms.
 */
export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image,
  imageAlt,
  canonicalPath = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  tags,
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
  const absoluteUrl = getAbsoluteUrl(canonicalPath)
  const absoluteImageUrl = getAbsoluteImageUrl(image)
  const altText = imageAlt || title || SITE_NAME

  return {
    title: title || DEFAULT_TITLE,
    description,
    alternates: {
      canonical: absoluteUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: absoluteUrl,
      siteName: SITE_NAME,
      locale: 'en_IN',
      type,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: altText,
          type: 'image/png',
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: authors && authors.length > 0 ? authors : ['ANU E-Cell Team'],
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [
        {
          url: absoluteImageUrl,
          alt: altText,
        },
      ],
      creator: '@anuecell',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}
