export const GITHUB_USERNAME = 'sulaiman-nsl-founder';
export const FEATURED_TOPIC = 'portfolio-featured';
export const FALLBACK_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600"%3E%3Crect width="900" height="600" fill="%23171717"/%3E%3Cpath d="M80 460h740M220 460V180h460v280M300 180v-70h300v70M390 250h120v90H390z" fill="none" stroke="%23fff" stroke-width="4"/%3E%3Ctext x="80" y="530" fill="%23fff" font-family="Arial" font-size="24" letter-spacing="4"%3EENGINEERING PROJECT%3C/text%3E%3C/svg%3E';

const imagePattern = /\.(jpe?g|png|webp|gif)$/i;

export function readableTopic(topic) {
  return topic.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function decodeBase64(value) {
  try {
    return atob(value.replace(/\n/g, ''));
  } catch {
    return '';
  }
}

function parseReadme(readme) {
  if (!readme) return [];
  return readme
    .split(/^##?\s+/m)
    .map((section) => {
      const [heading, ...body] = section.split('\n');
      return { heading: heading?.replace(/[#*_]/g, '').trim(), body: body.join('\n').trim() };
    })
    .filter((section) => section.heading && section.body)
    .slice(0, 12);
}

function hasPortfolioMarker(readme) {
  return /\\?<!--\s*portfolio:\s*true\s*-->|(?:^|\n)\\?portfolio:\s*true(?:\n|$)/i.test(readme);
}

function resolveReadmeImage(image, repo) {
  const githubBlob = image.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i);
  if (githubBlob) {
    return `https://raw.githubusercontent.com/${githubBlob[1]}/${githubBlob[2]}/${githubBlob[3]}/${githubBlob[4]}`;
  }
  if (/^https?:\/\//i.test(image)) return image;
  const cleanImage = image.replace(/^\.\//, '');
  return `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${repo.name}/${repo.default_branch}/${cleanImage}`;
}

function readmeImages(readme, repo) {
  const matches = [...readme.matchAll(/!\[[^\]]*\]\(([^)\s]+)(?:\s+[^)]*)?\)/g)];
  return matches.map((match) => match[1]).filter(Boolean).map((image) => resolveReadmeImage(image, repo));
}

async function githubJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) {
    const error = new Error(`GitHub request failed: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function fetchReadme(repo) {
  try {
    const response = await githubJson(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`);
    return response.content ? decodeBase64(response.content) : '';
  } catch {
    return '';
  }
}

async function fetchPortfolio(repo) {
  try {
    const contents = await githubJson(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents/portfolio`);
    return {
      exists: Array.isArray(contents),
      images: Array.isArray(contents)
        ? contents.filter((item) => item.type === 'file' && imagePattern.test(item.name)).map((item) => item.download_url).filter(Boolean)
        : [],
    };
  } catch {
    return { exists: false, images: [] };
  }
}

function normalizeRepository(repo, readme, gallery) {
  const topics = Array.isArray(repo.topics) ? repo.topics : [];
  const heroImage = gallery.find((image) => /hero\.(jpe?g|png|webp|gif)$/i.test(image)) || gallery[0] || FALLBACK_IMAGE;
  const linkedinUrl = /^https?:\/\/(www\.)?linkedin\.com\//i.test(repo.homepage || '') ? repo.homepage : undefined;
  return {
    id: repo.id,
    slug: repo.name.toLowerCase(),
    title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase()),
    description: repo.description || 'A hardware and product development project.',
    topics: topics.filter((topic) => topic !== FEATURED_TOPIC),
    categories: topics.filter((topic) => topic !== FEATURED_TOPIC).slice(0, 3).map(readableTopic),
    technologies: topics.filter((topic) => topic !== FEATURED_TOPIC).map(readableTopic),
    year: repo.created_at ? new Date(repo.created_at).getFullYear() : undefined,
    status: repo.archived ? 'Archived' : 'Active development',
    featured: topics.includes(FEATURED_TOPIC),
    updatedAt: repo.updated_at,
    githubUrl: repo.html_url,
    linkedinUrl,
    hasImage: gallery.length > 0,
    heroImage,
    gallery: gallery.length ? gallery : [heroImage],
    readme,
    sections: parseReadme(readme),
  };
}

export async function discoverProjects() {
  const repositories = await githubJson(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`);
  if (!Array.isArray(repositories)) return [];
  const publicRepos = repositories.filter((repo) => !repo.fork && !repo.archived);
  const projects = await Promise.all(publicRepos.map(async (repo) => {
    const [readme, portfolio] = await Promise.all([fetchReadme(repo), fetchPortfolio(repo)]);
    if (!portfolio.exists && !hasPortfolioMarker(readme)) return null;
    const images = portfolio.exists ? portfolio.images : readmeImages(readme, repo);
    return normalizeRepository(repo, readme, images);
  }));
  return projects.filter(Boolean).sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.updatedAt) - new Date(a.updatedAt));
}
