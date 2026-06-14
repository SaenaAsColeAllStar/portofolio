import Fuse from 'fuse.js';

export interface SearchItem {
  title: string;
  excerpt: string;
  url: string;
  type: string;
  locale: string;
  tags: string[];
  category: string;
}

let fuseInstance: Fuse<SearchItem> | null = null;
let indexData: SearchItem[] = [];

export async function initSearchEngine(): Promise<Fuse<SearchItem>> {
  if (fuseInstance) return fuseInstance;

  try {
    const res = await fetch('/search-index.json');
    if (!res.ok) throw new Error('Failed to fetch search index');
    indexData = await res.json();
    
    fuseInstance = new Fuse<SearchItem>(indexData, {
      keys: ['title', 'excerpt', 'tags', 'category', 'type'],
      threshold: 0.3,
      ignoreLocation: true,
    });
    
    return fuseInstance;
  } catch (err) {
    console.error('Failed to initialize search engine:', err);
    throw err;
  }
}

export async function search(query: string, locale: 'en' | 'id'): Promise<SearchItem[]> {
  if (indexData.length === 0) {
    try {
      await initSearchEngine();
    } catch {
      return [];
    }
  }

  const filteredIndex = indexData.filter(item => item.locale === locale);

  if (!query.trim()) {
    return filteredIndex;
  }

  if (!fuseInstance) return filteredIndex;

  const results = fuseInstance.search(query);
  return results
    .map(r => r.item)
    .filter(item => item.locale === locale);
}
