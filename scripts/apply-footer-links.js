const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const snippet = fs.readFileSync(path.join(root, 'snippets', 'footer-links.html'), 'utf8').trimEnd();
const pattern = /        <!-- Links -->\r?\n        <div class="footer-links">[\s\S]*?<\/div>\r?\n      <\/div>\r?\n\r?\n      <!-- Bottom bar -->/;
const replacement = `${snippet}\n      </div>\n\n      <!-- Bottom bar -->`;

let count = 0;
for (const file of fs.readdirSync(root)) {
  if (!file.endsWith('.html')) continue;
  const filePath = path.join(root, file);
  const content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('class="footer-links"')) continue;
  const updated = content.replace(pattern, replacement);
  if (updated !== content) {
    fs.writeFileSync(filePath, updated);
    count += 1;
  }
}

console.log(`Updated ${count} files`);
