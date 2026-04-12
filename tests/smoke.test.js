const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

test('required files exist', () => {
  const files = [
    'README.md',
    'AGENTS.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'LICENSE',
    '.claude-plugin/plugin.json',
    '.codex-plugin/plugin.json',
    '.opencode/opencode.json',
    '.mcp.json'
  ];

  for (const file of files) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `${file} should exist`);
  }
});

test('plugin manifests are valid JSON', () => {
  for (const file of ['.claude-plugin/plugin.json', '.codex-plugin/plugin.json']) {
    const data = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotThrow(() => JSON.parse(data), `${file} should parse`);
  }
});
