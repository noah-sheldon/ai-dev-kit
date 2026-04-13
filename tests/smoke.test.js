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
    'VERSION',
    '.claude-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.codex-plugin/plugin.json',
    '.gemini/gemini-extension.json',
    '.opencode/opencode.json',
    '.github-copilot/plugin.json',
    '.github-copilot/marketplace.json',
    'qwen-extension.json'
  ];

  for (const file of files) {
    assert.equal(fs.existsSync(path.join(root, file)), true, `${file} should exist`);
  }
});

test('plugin manifests are valid JSON', () => {
  const manifests = [
    '.claude-plugin/plugin.json',
    '.claude-plugin/marketplace.json',
    '.codex-plugin/plugin.json',
    '.agents/plugins/marketplace.json',
    '.gemini/gemini-extension.json',
    '.opencode/opencode.json',
    '.github-copilot/plugin.json',
    '.github-copilot/marketplace.json',
    'qwen-extension.json',
    '.qwen/marketplace.json'
  ];
  for (const file of manifests) {
    const data = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotThrow(() => JSON.parse(data), `${file} should parse`);
  }
});
