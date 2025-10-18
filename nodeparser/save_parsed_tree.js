// Usage: node save_parsed_tree.js < parsed.json
const fs = require('fs');
const path = require('path');
const out = path.resolve(__dirname, 'parsed_tree.json');
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => data += chunk);
process.stdin.on('end', () => {
  try {
    JSON.parse(data);
    fs.writeFileSync(out, data, 'utf8');
    console.log('Wrote', out);
  } catch (e) {
    console.error('Invalid JSON:', e.message);
    process.exit(1);
  }
});
