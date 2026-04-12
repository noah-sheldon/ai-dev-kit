# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- 55 skills across Python, TypeScript, ML, infrastructure, and web workflows
- 19 specialized agents with model selection and fallback support
- 40 workflow commands and shims
- Multi-platform support: Claude Code, Codex, OpenCode, Gemini CLI
- MCP server configurations (GitHub, Context7, Exa, Memory, Playwright, Sequential Thinking)
- Lifecycle automation hooks
- Language-specific rules (common, Python, TypeScript, web)
- Install scripts (bash + PowerShell)
- Smoke tests and surface validation
- OpenCode TypeScript plugin with custom tools and event hooks
- Marketplace catalogs for Claude Code and Codex
- Gemini CLI extension

---

## [1.0.0] — 2026-04-12

### Added
- Initial production scaffold
- Plugin manifests for Claude Code (`.claude-plugin/plugin.json`) and marketplace (`.claude-plugin/marketplace.json`)
- Plugin manifest for Codex (`.codex-plugin/plugin.json`) and marketplace (`.agents/plugins/marketplace.json`)
- Gemini CLI extension (`.gemini/gemini-extension.json`)
- OpenCode plugin (`.opencode/plugins/`) with TypeScript entry point
- Core content directories: `agents/`, `skills/`, `commands/`, `hooks/`, `rules/`
- Install tooling (`install.sh`, `install.ps1`)
- Validation scripts (`scripts/validate-surface.js`, `tests/`)
- Documentation: README, AGENTS, CONTRIBUTING, SECURITY, CHANGELOG
- MCP configuration files
