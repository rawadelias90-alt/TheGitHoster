const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const themePath = path.join(root, 'approved-theme.css');

function assertIncludes(haystack, needle, message) {
  if (!haystack.includes(needle)) throw new Error(message + ` (missing: ${needle})`);
}

assertIncludes(html, './approved-theme.css', 'Approved theme stylesheet must load after the base stylesheet');
assertIncludes(html, 'UAE New Hire', 'Approved header brand must be present');
assertIncludes(html, 'Government Relation Team', 'Approved desktop header team label must be present');
assertIncludes(html, 'header-region-pill', 'Approved UAE region pill must be present');
assertIncludes(html, 'mobile-menu-icon', 'Approved mobile header menu marker must be present');
assertIncludes(html, 'hero-editorial', 'Approved Welcome Screen editorial layout must be present');
if (!fs.existsSync(themePath)) throw new Error('approved-theme.css must exist');
const css = fs.readFileSync(themePath, 'utf8');
assertIncludes(css, '.readiness-sticky', 'Readiness panel styling must be overridden');
assertIncludes(css, 'backdrop-filter:blur(', 'Desktop information panel must use subtle glass treatment');
assertIncludes(css, '.progress-track', 'Approved stepper treatment must be defined');
assertIncludes(css, '@media (max-width:760px)', 'Responsive mobile interpretation must be defined');
assertIncludes(css, '.mobile-menu-icon', 'Approved mobile header menu marker styling must be defined');
const forbidden = ['#00ab61', '#00AB61', 'rgb(0,171,97)', 'rgba(0,171,97'];
for (const token of forbidden) {
  if (css.includes(token)) throw new Error(`Approved theme must not use green token ${token}`);
}
console.log('approved-theme static contract: PASS');
