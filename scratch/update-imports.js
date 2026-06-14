import fs from 'fs';
import path from 'path';

const srcDir = './src';

const replacements = [
  { from: 'components/BaseHead', to: 'components/layout/BaseHead' },
  { from: 'components/Footer', to: 'components/layout/Footer' },
  { from: 'components/Container', to: 'components/layout/Container' },
  { from: 'components/Section', to: 'components/layout/Section' },
  { from: 'components/PageWrapper', to: 'components/layout/PageWrapper' },
  { from: 'components/HeaderLink', to: 'components/navigation/HeaderLink' },
  { from: 'components/Header', to: 'components/navigation/Header' },
  { from: 'components/LanguageSwitcher', to: 'components/navigation/LanguageSwitcher' },
  { from: 'components/MobileNav', to: 'components/navigation/MobileNav' },
  { from: 'components/ThemeSwitcher', to: 'components/navigation/ThemeSwitcher' },
  { from: 'components/FormattedDate', to: 'components/ui/FormattedDate' },
  { from: 'components/Logo', to: 'components/ui/Logo' },
  { from: 'components/Icon', to: 'components/ui/Icon' },
  { from: 'components/PageView', to: 'components/analytics/PageView' },
  { from: 'components/SplashScreen', to: 'components/animation/SplashScreen' },
  { from: 'components/ChatWidget', to: 'components/contact/ChatWidget' }
];

function updateFileImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let original = content;

  replacements.forEach(({ from, to }) => {
    // Escape string for regex
    const escapedFrom = from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(['"])([^'"]*?)${escapedFrom}(\\.[a-zA-Z0-9]+)?(['"])`, 'g');
    
    content = content.replace(regex, (match, quoteBefore, pathPrefix, ext, quoteAfter) => {
      // Ensure we don't double replace if it already contains the target subdirectory
      const targetSubDir = to.split('/')[1]; // e.g. 'layout', 'navigation', etc.
      if (pathPrefix.endsWith(targetSubDir + '/') || pathPrefix.includes('/' + targetSubDir + '/')) {
        return match;
      }
      const extension = ext || '';
      return `${quoteBefore}${pathPrefix}${to}${extension}${quoteAfter}`;
    });
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated imports in: ${filePath}`);
  }
}

function traverse(dir) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      traverse(fullPath);
    } else if (file.endsWith('.astro') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.mdx')) {
      updateFileImports(fullPath);
    }
  });
}

traverse(srcDir);
console.log('Finished updating imports.');
