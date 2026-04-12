const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

test('package manifest exists', () => {
  assert.ok(fs.existsSync(path.join(__dirname, '..', 'package.json')));
});
