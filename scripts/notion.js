const NOTION_VERSION = '2022-06-28';
const BASE = 'https://api.notion.com/v1';

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  };
}

async function notionRequest(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { ...options, headers: headers() });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Notion API ${res.status}: ${body}`);
  }
  return res.json();
}

function queryDatabase(databaseId, body = {}) {
  return notionRequest(`/databases/${databaseId}/query`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

function getPage(pageId) {
  return notionRequest(`/pages/${pageId}`);
}

function updatePage(pageId, properties) {
  return notionRequest(`/pages/${pageId}`, {
    method: 'PATCH',
    body: JSON.stringify({ properties }),
  });
}

// Достаёт значение title-свойства независимо от того, как оно называется
function getTitle(page) {
  const prop = Object.values(page.properties).find((p) => p.type === 'title');
  return prop?.title?.[0]?.plain_text || '';
}

function getPhone(page, propName) {
  return page.properties[propName]?.phone_number || null;
}

function getStatus(page, propName) {
  return page.properties[propName]?.status?.name || null;
}

function getCheckbox(page, propName) {
  return page.properties[propName]?.checkbox || false;
}

function getRelationIds(page, propName) {
  return (page.properties[propName]?.relation || []).map((r) => r.id);
}

module.exports = {
  queryDatabase,
  getPage,
  updatePage,
  getTitle,
  getPhone,
  getStatus,
  getCheckbox,
  getRelationIds,
};
