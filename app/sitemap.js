import { promises as fs } from 'fs';
import path from 'path';

const CATEGORIES = [
  { name: 'Airdrops', key: 'airdrops', itemKey: 'slug', linkPrefix: '/airdrops/' },
  { name: 'Games', key: 'games', itemKey: 'slug', linkPrefix: '/games/' },
  { name: 'Farming', key: 'farm-tokens', itemKey: 'slug', linkPrefix: '/farm-tokens/' },
  { name: 'Platforms', key: 'reward-tasks', itemKey: '_id', linkPrefix: '/reward-tasks/'},
  { name: 'Academy', key: 'academy', itemKey: 'slug', linkPrefix: '/academy/' },
];

const STATIC_ROUTES = ['', '/about', '/risks', '/contact'];

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.web3fruity.com';
  
  const staticRoutes = generateStaticRoutes(baseUrl);
  const dynamicRoutes = await generateDynamicRoutes(baseUrl);
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  if (allRoutes.length > 50000) {
    return splitSitemaps(allRoutes, baseUrl);
  }

  return allRoutes;
}

async function fetchCategoryData(category) {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/${category.key}`;
    console.log(`Fetching data from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status} for category: ${category.key}`);
    }

    let data = await response.json();
    if (!Array.isArray(data)) {
        console.warn(`Data for ${category.key} is not an array, attempting to parse as object`);
        data = Object.values(data);
     }

    return data.filter(item => item);
  } catch (error) {
    console.error(`Error fetching/processing data for ${category.key}:`, error);
    return [];
  }
}

function generateStaticRoutes(baseUrl) {
  return [...STATIC_ROUTES, ...CATEGORIES.map(cat => cat.linkPrefix.slice(0, -1))]
    .map(route => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: route === '' ? 1 : 0.9,
    }));
}

async function generateDynamicRoutes(baseUrl) {
  const routes = await Promise.all(CATEGORIES.map(async (category) => {
    const items = await fetchCategoryData(category);
    return items.map(item => ({
      url: `${baseUrl}${category.linkPrefix}${item.slug}`,
      lastModified: item.updatedAt || item.createdAt || new Date().toISOString(),
      changeFrequency: getCategoryChangeFreq(category.key),
      priority: getCategoryPriority(category.key),
      images: item.image ? [{ loc: item.image, title: item.imageAlt || item[category.itemKey] }] : undefined,
    }));
  }));
  return routes.flat();
}

function getCategoryChangeFreq(categoryKey) {
  const freqMap = { airdrops: 'hourly', games: 'daily', 'farm-tokens': 'daily', academy: 'weekly' };
  return freqMap[categoryKey] || 'weekly';
}

function getCategoryPriority(categoryKey) {
  const priorities = { airdrops: 0.9, games: 0.8, 'farm-tokens': 0.8, academy: 0.7 };
  return priorities[categoryKey] || 0.5;
}

async function splitSitemaps(entries, baseUrl) {
  const chunks = chunk(entries, 45000);
  await Promise.all(chunks.map(async (chunk, i) => {
    await writeSitemapFile(chunk, `sitemap-${i + 1}.xml`);
  }));
  const indexEntries = chunks.map((_, i) => ({
    url: `${baseUrl}/sitemap-${i + 1}.xml`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.9,
  }));
  await writeSitemapFile(indexEntries, 'sitemap-index.xml');
  return indexEntries;
}

async function writeSitemapFile(entries, fileName) {
  const filePath = path.join(process.cwd(), 'public', fileName);
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    const xml = fileName.includes('sitemap-index') ? generateSitemapIndex(entries) : generateSitemapXml(entries);
    await fs.writeFile(filePath, xml, 'utf8');
    console.log(`Successfully wrote ${fileName}`);
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
}

function chunk(array, size) {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) => array.slice(i * size, i * size + size));
}

function generateSitemapXml(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.map(entry => `  <url>\n    <loc>${entry.url}</loc>\n    <lastmod>${entry.lastModified}</lastmod>\n    <changefreq>${entry.changeFrequency}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>`).join('\n')}\n</urlset>`;
}

function generateSitemapIndex(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps.map(sitemap => `  <sitemap>\n    <loc>${sitemap.url}</loc>\n    <lastmod>${sitemap.lastModified}</lastmod>\n  </sitemap>`).join('\n')}\n</sitemapindex>`;
}
