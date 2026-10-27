import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const root = fileURLToPath(new URL('../', import.meta.url));
const skillRoot = path.join(root, 'skills');
const directories = (await readdir(skillRoot, { withFileTypes: true })).filter(d => d.isDirectory());
assert(directories.length, 'No skills found');
const names = new Set();
for (const directory of directories) {
  const folder = path.join(skillRoot, directory.name);
  const source = await readFile(path.join(folder, 'SKILL.md'), 'utf8');
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]+)$/);
  assert(match, `${directory.name}: missing frontmatter or body`);
  const document = parseDocument(match[1], { uniqueKeys: true });
  assert.equal(document.errors.length, 0, document.errors.map(e => e.message).join('\n'));
  const metadata = document.toJS();
  assert(metadata && typeof metadata === 'object' && !Array.isArray(metadata));
  const allowed = new Set(['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools']);
  for (const key of Object.keys(metadata)) assert(allowed.has(key), `Unknown field: ${key}`);
  assert.equal(metadata.name, directory.name);
  assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.name) && metadata.name.length <= 64);
  assert(!names.has(metadata.name), 'Duplicate skill name');
  names.add(metadata.name);
  assert(typeof metadata.description === 'string' && metadata.description.trim().length > 0 && metadata.description.length <= 1024);
  if (metadata.compatibility !== undefined) assert(typeof metadata.compatibility === 'string' && metadata.compatibility.length > 0 && metadata.compatibility.length <= 500);
  if (metadata.metadata !== undefined) {
    assert(metadata.metadata && typeof metadata.metadata === 'object' && !Array.isArray(metadata.metadata));
    for (const value of Object.values(metadata.metadata)) assert.equal(typeof value, 'string');
  }
  assert.equal(metadata.license, 'MIT');
  assert.equal(await readFile(path.join(folder, 'LICENSE'), 'utf8'), await readFile(path.join(root, 'LICENSE'), 'utf8'));
  assert(source.split('\n').length < 500, 'Move lengthy instructions into references');
  const markdown = [path.join(folder, 'SKILL.md')];
  const references = path.join(folder, 'references');
  for (const entry of await readdir(references)) if (entry.endsWith('.md')) markdown.push(path.join(references, entry));
  for (const file of markdown) {
    const body = await readFile(file, 'utf8');
    assert(!body.includes('[TODO:'), `${file}: unfinished scaffold`);
    for (const [, target] of body.matchAll(/\]\(([^\s)]+)\)/g)) {
      if (/^(https?:|#)/.test(target)) continue;
      const resolved = path.resolve(path.dirname(file), target.split('#')[0]);
      assert(resolved.startsWith(folder + path.sep), `Reference escapes skill package: ${target}`);
      assert((await stat(resolved)).isFile(), `Missing reference: ${target}`);
    }
  }
  console.log(`Validated ${metadata.name}: YAML, metadata, bundled license, and references`);
}
