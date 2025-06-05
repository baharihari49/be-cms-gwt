// constants/project.ts
export const PROJECT_STATUS = {
  DEVELOPMENT: 'DEVELOPMENT',
  BETA: 'BETA',
  LIVE: 'LIVE',
  ARCHIVED: 'ARCHIVED',
  MAINTENANCE: 'MAINTENANCE'
} as const;

export const IMAGE_TYPES = {
  SCREENSHOT: 'SCREENSHOT',
  MOCKUP: 'MOCKUP',
  LOGO: 'LOGO',
  DIAGRAM: 'DIAGRAM',
  OTHER: 'OTHER'
} as const;

export const SORT_FIELDS = {
  CREATED_AT: 'createdAt',
  TITLE: 'title',
  YEAR: 'year'
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc'
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100
} as const;

export const PROJECT_INCLUDES = {
  BASIC: {
    category: true,
    technologies: {
      include: {
        technology: true
      }
    },
    features: {
      include: {
        feature: true
      }
    },
    metrics: true,
    links: true
  },
  FULL: {
    category: true,
    technologies: {
      include: {
        technology: true
      }
    },
    features: {
      include: {
        feature: true
      }
    },
    metrics: true,
    links: true,
    images: {
      orderBy: { order: 'asc' }
    },
    reviews: {
      orderBy: { createdAt: 'desc' }
    }
  }
} as const;

// Type definitions
export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];
export type ImageType = typeof IMAGE_TYPES[keyof typeof IMAGE_TYPES];
export type SortField = typeof SORT_FIELDS[keyof typeof SORT_FIELDS];
export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];