const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const targetVersion = '20260607-dipti-chatbot-v8';

const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
};

const run = () => {
  const htmlFiles = walk(publicDir);
  console.log(`Found ${htmlFiles.length} HTML files to update.`);

  let updatedCount = 0;

  htmlFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace site.css version
    if (content.includes('site.css?v=20260607-dipti-chatbot-v7')) {
      content = content.replace('site.css?v=20260607-dipti-chatbot-v7', `site.css?v=${targetVersion}`);
      modified = true;
    }
    // Also handle other CSS versions if any
    if (content.includes('site.css?v=20260607-products-hub')) {
      content = content.replace('site.css?v=20260607-products-hub', `site.css?v=${targetVersion}`);
      modified = true;
    }
    if (content.includes('site.css?v=20260607-resources-hub')) {
      content = content.replace('site.css?v=20260607-resources-hub', `site.css?v=${targetVersion}`);
      modified = true;
    }

    // Replace site.js version
    if (content.includes('site.js?v=20260607-dipti-chatbot-v7')) {
      content = content.replace('site.js?v=20260607-dipti-chatbot-v7', `site.js?v=${targetVersion}`);
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
    }
  });

  console.log(`Updated cache version in ${updatedCount} files.`);
};

run();
