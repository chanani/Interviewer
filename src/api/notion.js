const BASE = '/api/notion';

function extractPlainText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map((block) => block.plain_text).join('');
}

function normalizePage(page) {
  const props = page.properties;
  return {
    id: page.id,
    title: extractPlainText(props['제목']?.title),
    answer: extractPlainText(props['면접 답변']?.rich_text),
    bookmarked: props['즐겨찾기']?.checkbox ?? false,
    category: props['카테고리']?.select?.name || '',
  };
}

async function queryDatabase(databaseId) {
  const res = await fetch(`${BASE}/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      page_size: 100,
      sorts: [{ timestamp: 'created_time', direction: 'ascending' }],
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }

  const data = await res.json();
  return data.results.map(normalizePage);
}

export function fetchQuestions() {
  return queryDatabase(import.meta.env.VITE_NOTION_DATABASE_ID);
}

export function fetchCultureFit() {
  return queryDatabase(import.meta.env.VITE_NOTION_CULTUREFIT_DB_ID);
}

export async function updateBookmark(pageId, checked) {
  const res = await fetch(`${BASE}/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: {
        '즐겨찾기': { checkbox: checked },
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }
}

const blocksCache = new Map();

export async function fetchPageBlocks(pageId) {
  if (blocksCache.has(pageId)) return blocksCache.get(pageId);

  const res = await fetch(`${BASE}/v1/blocks/${pageId}/children?page_size=100`);
  if (!res.ok) {
    throw new Error(`Notion API error: ${res.status}`);
  }

  const data = await res.json();
  blocksCache.set(pageId, data.results);
  return data.results;
}
