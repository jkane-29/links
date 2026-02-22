const CATEGORY_HINTS = [
  {
    name: 'Social',
    keywords: ['x.com', 'twitter', 'linkedin', 'instagram', 'youtube', 'warpcast'],
  },
  {
    name: 'Writing',
    keywords: ['blog', 'writing', 'essay', 'substack', 'newsletter', 'archive', 'notes'],
  },
  {
    name: 'Investing',
    keywords: ['invest', 'venture', 'capital', 'vc', 'seed', 'market', 'alpha'],
  },
  {
    name: 'AI / ML',
    keywords: ['ai', 'llm', 'rag', 'machine learning', 'gpt', 'model'],
  },
  {
    name: 'Product / Startup',
    keywords: ['startup', 'product', 'founder', 'company', 'builder', 'growth'],
  },
  {
    name: 'Crypto / Web3',
    keywords: ['crypto', 'web3', 'farcaster', 'protocol', 'eth', 'blockchain', 'defi'],
  },
  {
    name: 'Learning',
    keywords: ['course', 'guide', 'playbook', 'lecture', 'paper', 'book'],
  },
  {
    name: 'Tools',
    keywords: ['github', 'tool', 'app', 'software', 'platform'],
  },
  {
    name: 'Media',
    keywords: ['podcast', 'video', 'interview', 'episode', 'talk'],
  },
];

const stopWords = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'by',
  'for',
  'from',
  'in',
  'is',
  'it',
  'of',
  'on',
  'or',
  'the',
  'to',
  'vs',
  'with',
]);

const parseCsvLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  values.push(current.trim());
  return values;
};

const getDomain = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch (error) {
    return '';
  }
};

const normalizeText = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const inferGeneralCategory = (row) => {
  const combined = normalizeText(
    [row.type, row.episode_title, row.guest, row.domain, row.url].filter(Boolean).join(' ')
  );

  const match = CATEGORY_HINTS.find((candidate) =>
    candidate.keywords.some((keyword) => combined.includes(keyword))
  );

  return match ? match.name : 'General';
};

const inferTags = (row) => {
  const raw = normalizeText(
    [row.type, row.episode_title, row.guest, row.domain].filter(Boolean).join(' ')
  );

  const parts = raw
    .split(/\s+/)
    .filter((token) => token.length > 2 && !stopWords.has(token));

  const unique = new Set(parts);

  CATEGORY_HINTS.forEach((candidate) => {
    if (candidate.keywords.some((keyword) => raw.includes(keyword))) {
      unique.add(candidate.name.toLowerCase());
    }
  });

  return Array.from(unique).slice(0, 18);
};

export const parseCsv = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [];
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.replace(/^\uFEFF/, ''));

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const row = {};

    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });

    return row;
  });
};

export const buildLinkEntries = (rows) => {
  return rows.map((row, index) => {
    const domain = getDomain(row.url);
    const category = inferGeneralCategory({...row, domain});
    const tags = inferTags({...row, domain});

    return {
      id: `${row.episode_number || 'ep'}-${index}`,
      episode: row.episode_number,
      guest: row.guest,
      episodeTitle: row.episode_title,
      url: row.url,
      type: row.type,
      domain,
      category,
      tags,
      semanticText: [
        row.guest,
        row.episode_title,
        row.type,
        category,
        domain,
        tags.join(' '),
      ]
        .filter(Boolean)
        .join(' '),
    };
  });
};

export const groupEntriesByCategory = (entries) => {
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.category]) {
      acc[entry.category] = [];
    }

    acc[entry.category].push(entry);
    return acc;
  }, {});

  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => a.guest.localeCompare(b.guest));
  });

  return grouped;
};
