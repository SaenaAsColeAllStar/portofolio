import fs from 'fs';
import path from 'path';

const contentDir = './src/content';
const outputIndexFile = './public/search-index.json';

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { data: {}, body: content };
  const yaml = match[1];
  const body = content.slice(match[0].length);
  
  const data = {};
  yaml.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      data[key] = value;
    }
  });
  return { data, body };
}

function generateIndex() {
  const index = [];
  const collections = ['projects', 'case-studies', 'notes', 'certificates'];

  collections.forEach(col => {
    const colPath = path.join(contentDir, col);
    if (!fs.existsSync(colPath)) return;

    const locales = ['en', 'id'];
    locales.forEach(loc => {
      const locPath = path.join(colPath, loc);
      if (!fs.existsSync(locPath)) return;

      const files = fs.readdirSync(locPath);
      files.forEach(file => {
        if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;

        const filePath = path.join(locPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, body } = parseFrontmatter(fileContent);

        const slug = file.replace(/\.(md|mdx)$/, '');
        const localePrefix = loc === 'en' ? '' : '/id';
        
        let url = '';
        let type = '';
        
        switch (col) {
          case 'projects':
            url = `${localePrefix}/projects/${slug}`;
            type = loc === 'en' ? 'Project' : 'Proyek';
            break;
          case 'case-studies':
            url = `${localePrefix}/case-studies/${slug}`;
            type = loc === 'en' ? 'Case Study' : 'Studi Kasus';
            break;
          case 'notes':
            url = `${localePrefix}/notes/${slug}`;
            type = loc === 'en' ? 'Technical Note' : 'Catatan Teknis';
            break;
          case 'certificates':
            url = `${localePrefix}/certificates/${slug}`;
            type = loc === 'en' ? 'Certificate' : 'Sertifikat';
            break;
        }

        index.push({
          title: data.title || slug,
          excerpt: data.excerpt || data.summary || '',
          url,
          type,
          locale: loc,
          tags: Array.isArray(data.tags) ? data.tags : (Array.isArray(data.skills) ? data.skills : (Array.isArray(data.stack) ? data.stack : [])),
          category: data.category || ''
        });
      });
    });
  });

  fs.mkdirSync(path.dirname(outputIndexFile), { recursive: true });
  fs.writeFileSync(outputIndexFile, JSON.stringify(index, null, 2), 'utf-8');
  console.log(`Generated search index at ${outputIndexFile} containing ${index.length} entries.`);
}

generateIndex();
