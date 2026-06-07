const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const targetVersion = '20260607-dipti-chatbot-v14';

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
  const previousVersions = [
    '20260607-dipti-chatbot-v13',
    '20260607-dipti-chatbot-v12',
    '20260607-dipti-chatbot-v11',
    '20260607-dipti-chatbot-v10',
    '20260607-dipti-chatbot-v9',
    '20260607-dipti-chatbot-v8',
    '20260607-products-hub',
    '20260607-resources-hub'
  ];

  htmlFiles.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    previousVersions.forEach((prev) => {
      const cssTarget = `site.css?v=${prev}`;
      if (content.includes(cssTarget)) {
        content = content.split(cssTarget).join(`site.css?v=${targetVersion}`);
        modified = true;
      }
      const jsTarget = `site.js?v=${prev}`;
      if (content.includes(jsTarget)) {
        content = content.split(jsTarget).join(`site.js?v=${targetVersion}`);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      updatedCount++;
    }
  });

  console.log(`Updated cache version in ${updatedCount} files.`);
};

run();
