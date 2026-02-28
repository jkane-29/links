const CATEGORY_RULES = [
  {
    name: 'Wikipedia',
    domains: ['wikipedia.org'],
    phrases: [],
    tokens: ['wikipedia'],
    stems: [],
  },
  {
    name: 'Music',
    domains: ['spotify.com', 'music.apple.com', 'itunes.apple.com', 'soundcloud.com', 'bandcamp.com', 'genius.com', 'last.fm'],
    phrases: ['music video', 'official audio', 'official music', 'apple music', 'listen on spotify'],
    tokens: [
      'music',
      'song',
      'songs',
      'album',
      'albums',
      'artist',
      'artists',
      'track',
      'tracks',
      'playlist',
      'discography',
      'musician',
      'band',
      'composer',
      'soundtrack',
      'lyrics',
      'record',
      'single',
      'mixtape',
      'ep',
    ],
    stems: [],
  },
  {
    name: 'Film',
    domains: ['imdb.com', 'letterboxd.com', 'criterion.com', 'mubi.com'],
    phrases: ['short film', 'feature film'],
    tokens: ['film', 'movie', 'cinema', 'documentary', 'screenplay', 'trailer'],
    stems: [],
  },
  {
    name: 'Media',
    domains: ['youtube.com', 'youtu.be', 'podcasts.apple.com'],
    phrases: ['video podcast', 'podcast episode', 'video interview'],
    tokens: ['podcast', 'video', 'interview', 'episode', 'talk'],
    stems: [],
  },
  {
    name: 'AI / ML',
    domains: [],
    phrases: ['machine learning', 'artificial intelligence', 'neural network'],
    tokens: ['ai', 'llm', 'rag', 'gpt', 'ml', 'model', 'models'],
    stems: [],
  },
  {
    name: 'Investing',
    domains: [],
    phrases: ['venture capital', 'capital markets'],
    tokens: ['invest', 'investing', 'venture', 'capital', 'vc', 'seed', 'market', 'alpha', 'fund'],
    stems: [],
  },
  {
    name: 'Product / Startup',
    domains: [],
    phrases: [],
    tokens: ['startup', 'product', 'founder', 'founders', 'company', 'builder', 'growth', 'saas'],
    stems: [],
  },
  {
    name: 'Tools',
    domains: ['github.com', 'gitlab.com'],
    phrases: ['open source'],
    tokens: ['tool', 'tools', 'app', 'apps', 'github', 'repo'],
    stems: [],
  },
  {
    name: 'Books',
    domains: ['goodreads.com', 'thestorygraph.com', 'bookshop.org'],
    phrases: [],
    tokens: ['book', 'books', 'novel', 'memoir', 'biography', 'author'],
    stems: [],
  },
  {
    name: 'Essay',
    domains: [
      'substack.com',
      'medium.com',
      'aeon.co',
      'lesswrong.com',
      'stephango.com',
      'henrikkarlsson.xyz',
      'alexdanco.com',
      'billyoppenheimer.com',
      'thesephist.com',
      'geoffreylitt.com',
      'ribbonfarm.com',
      'pmarchive.com',
      'experimental-history.com',
      'nabeelqu.co',
      'otherinter.net',
      'worrydream.com',
      'inkandswitch.com',
      'themarginalian.org',
      'ystrickler.com',
      'arenamag.com',
    ],
    phrases: ['long form', 'longform essay', 'blog post', 'blog posts'],
    tokens: [
      'essay',
      'essays',
      'article',
      'articles',
      'blog',
      'blogs',
      'writing',
      'post',
      'posts',
      'notes',
      'newsletter',
      'substack',
      'critique',
      'manifesto',
      'column',
      'columns',
    ],
    stems: [],
  },
  {
    name: 'Poems',
    domains: ['poetryfoundation.org', 'poets.org'],
    phrases: [],
    tokens: ['poem', 'poems', 'poetry', 'verse', 'haiku', 'sonnet'],
    stems: [],
  },
  {
    name: 'Writing',
    domains: [],
    phrases: [],
    tokens: ['archive', 'author', 'authors'],
    stems: [],
  },
  {
    name: 'Learning',
    domains: [],
    phrases: [],
    tokens: ['course', 'guide', 'playbook', 'lecture', 'paper', 'tutorial'],
    stems: [],
  },
  {
    name: 'Social',
    domains: ['x.com', 'twitter.com', 'linkedin.com', 'instagram.com', 'warpcast.com', 't.me', 'discord.gg'],
    phrases: [],
    tokens: ['twitter', 'linkedin', 'instagram', 'warpcast', 'telegram', 'discord'],
    stems: [],
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

const MIN_CATEGORY_SIZE = 12;
const FALLBACK_CATEGORY = 'Websites';

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
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const tokenize = (value) => {
  const normalized = normalizeText(value);
  if (!normalized) {
    return [];
  }

  return normalized.split(/\s+/);
};

const hasPhrase = (text, phrase) => {
  const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
  return pattern.test(text);
};

const isDomainMatch = (domain, ruleDomain) =>
  domain === ruleDomain || domain.endsWith(`.${ruleDomain}`);

const getUrlPathTokens = (url) => {
  try {
    const parsed = new URL(url);
    return tokenize(parsed.pathname);
  } catch (error) {
    return [];
  }
};

const scoreCategories = (row) => {
  const label = row.description || row.type || row.twitter || '';
  const labelText = normalizeText(label);
  const contextText = normalizeText([row.episode_title, row.guest].filter(Boolean).join(' '));
  const allText = normalizeText([label, row.episode_title, row.guest].filter(Boolean).join(' '));
  const labelTokens = new Set(tokenize(labelText));
  const contextTokens = new Set(tokenize(contextText));
  const urlPathTokens = new Set(getUrlPathTokens(row.url || ''));
  const domain = (row.domain || '').toLowerCase().trim().replace(/^www\./, '');

  return CATEGORY_RULES.map((rule) => {
    let score = 0;
    let labelTokenHits = 0;

    if (rule.domains.some((ruleDomain) => isDomainMatch(domain, ruleDomain))) {
      score += 5;
    }

    rule.phrases.forEach((phrase) => {
      const normalizedPhrase = normalizeText(phrase);
      if (hasPhrase(labelText, normalizedPhrase)) {
        score += 3;
      } else if (rule.name !== 'Tools' && hasPhrase(allText, normalizedPhrase)) {
        score += 2;
      }
    });

    rule.tokens.forEach((token) => {
      if (labelTokens.has(token)) {
        labelTokenHits += 1;
        score += 2;
      } else if (urlPathTokens.has(token)) {
        score += 1;
      } else if (rule.name !== 'Tools' && contextTokens.has(token)) {
        score += 1;
      }
    });

    rule.stems.forEach((stem) => {
      if (Array.from(labelTokens).some((token) => token.startsWith(stem))) {
        score += 1;
      } else if (rule.name !== 'Tools' && Array.from(contextTokens).some((token) => token.startsWith(stem))) {
        score += 1;
      }
    });

    if (rule.name === 'Tools') {
      const hasToolDomain = rule.domains.some((ruleDomain) => isDomainMatch(domain, ruleDomain));
      if (!hasToolDomain && labelTokenHits === 0 && !rule.phrases.some((phrase) => hasPhrase(labelText, normalizeText(phrase)))) {
        score = 0;
      }
    }

    return {name: rule.name, score};
  }).sort((a, b) => b.score - a.score);
};

const inferGeneralCategory = (row) => {
  const ranked = scoreCategories(row);
  if (!ranked[0] || ranked[0].score <= 0) {
    return FALLBACK_CATEGORY;
  }

  return ranked[0].name;
};

const inferTags = (row) => {
  const label = row.description || row.type || row.twitter || '';
  const raw = normalizeText([label, row.episode_title, row.guest, row.domain].filter(Boolean).join(' '));

  const parts = tokenize(raw)
    .filter((token) => token.length > 2 && !stopWords.has(token));

  const unique = new Set(parts);

  scoreCategories(row).forEach((candidate) => {
    if (candidate.score > 0) {
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
  return rows
    .filter((row) => {
      const domain = getDomain(row.url);
      const blockedDomains = ['x.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'joinhampton.com', 'dialectic.fm'];
      const isBlockedDomain = blockedDomains.some((blocked) => domain === blocked || domain.endsWith(`.${blocked}`));
      const isJoinDomain = domain.includes('join');
      return !isBlockedDomain && !isJoinDomain;
    })
    .filter((row) => {
      const label = (row.type || row.twitter || '').trim().toLowerCase();
      return !label.startsWith('join');
    })
    .map((row, index) => {
      const description = row.type;
      const domain = getDomain(row.url);
      const category = inferGeneralCategory({...row, description, domain});
      const tags = inferTags({...row, description, domain});

      return {
        id: `${row.episode_number || 'ep'}-${index}`,
        episode: row.episode_number,
        guest: row.guest,
        episodeTitle: row.episode_title,
        url: row.url,
        twitter: row.twitter,
        description,
        type: row.type,
        domain,
        category,
        tags,
        semanticText: [
          row.guest,
          row.episode_title,
          row.twitter,
          description,
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

  if (!grouped[FALLBACK_CATEGORY]) {
    grouped[FALLBACK_CATEGORY] = [];
  }

  Object.keys(grouped).forEach((key) => {
    if (key === FALLBACK_CATEGORY) {
      return;
    }

    if (grouped[key].length < MIN_CATEGORY_SIZE) {
      grouped[FALLBACK_CATEGORY].push(...grouped[key]);
      delete grouped[key];
    }
  });

  Object.keys(grouped).forEach((key) => {
    grouped[key].sort((a, b) => a.guest.localeCompare(b.guest));
  });

  return grouped;
};
