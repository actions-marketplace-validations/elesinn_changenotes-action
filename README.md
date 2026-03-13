<p align="center">
  <a href="https://changenotes.app">
    <img src="https://img.shields.io/badge/changenotes.app-Try%20Free-6B21A8?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTMgMiAzIDEzIDEyIDEzIDExIDIyIDIxIDExIDEyIDExIDEzIDIiLz48L3N2Zz4=" alt="Try Changenotes Free">
  </a>
  <a href="https://github.com/marketplace/actions/changenotes-changelog-generator">
    <img src="https://img.shields.io/badge/GitHub%20Marketplace-Changenotes-purple?style=for-the-badge&logo=github" alt="GitHub Marketplace">
  </a>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT License">
</p>

<h1 align="center">Changenotes — AI Changelog Generator</h1>

<p align="center">
  Stop writing release notes by hand.<br>
  Changenotes reads your commits and PRs, then generates a clean, categorized changelog using AI — automatically updating your GitHub release on every publish.
</p>

---

## What It Does

Every time you publish a release, Changenotes:

1. Reads all commits and merged PRs since your last tag
2. Sends them to Claude AI for categorization and rewriting
3. Posts a formatted changelog back to your GitHub release body

No config files. No templates. No manual work.

---

## Before & After

**Your raw commits:**
```
fix: prevent race condition in auth middleware
feat: add dark mode toggle to dashboard  
chore: update dependencies
fix: resolve memory leak in webhook handler
feat: export changelog as PDF
perf: cache database queries for 10x speed improvement
```

**Generated changelog (posted to your release automatically):**
```markdown
## 🚀 New Features

- **Dark mode** — Toggle between dark and light themes from the dashboard preferences
- **PDF export** — Download any changelog as a formatted, shareable PDF

## 🐛 Bug Fixes

- Fixed intermittent 401 errors caused by a race condition in the authentication middleware
- Resolved memory leak in the webhook handler that occurred under sustained load

## ⚡ Performance

- Database query caching now delivers up to 10x faster response times on repeated requests
```

---

## Quickstart

**Step 1** — Sign up at [changenotes.app](https://changenotes.app) and copy your API key from Settings.

**Step 2** — Add it to your repo: `Settings → Secrets and variables → Actions → New repository secret`
Name it `CHANGENOTES_API_KEY`.

**Step 3** — Create `.github/workflows/changelog.yml`:

```yaml
name: Generate Changelog

on:
  release:
    types: [published]

jobs:
  changelog:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: elesinn/changenotes-action@v1
        with:
          changenotes-api-key: ${{ secrets.CHANGENOTES_API_KEY }}
```

Push that file. Done. Your next release will have an AI-generated changelog automatically.

---

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `changenotes-api-key` | ✅ Yes | — | Your API key from [changenotes.app/settings](https://changenotes.app/settings) |
| `github-token` | No | `${{ github.token }}` | GitHub token for reading commits/PRs and updating the release |
| `update-release` | No | `true` | Set to `false` to skip auto-updating the release body |
| `api-url` | No | `https://changenotes.app` | Override for self-hosted instances |

## Outputs

| Output | Description |
|--------|-------------|
| `changelog` | Full generated changelog in Markdown |
| `tag` | The release tag that was processed |
| `previous-tag` | The previous tag used as the comparison base |

---

## Advanced: Use the Output

Capture the generated changelog to use elsewhere — post to Slack, commit to CHANGELOG.md, send in an email:

```yaml
jobs:
  changelog:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - id: notes
        uses: elesinn/changenotes-action@v1
        with:
          changenotes-api-key: ${{ secrets.CHANGENOTES_API_KEY }}

      - name: Post to Slack
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "New release ${{ github.ref_name }}:\n${{ steps.notes.outputs.changelog }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Supported Triggers

Works with any event that produces a tag or release:

```yaml
# Recommended: fires when you publish a release
on:
  release:
    types: [published]

# Alternative: fires when a tag is pushed
on:
  push:
    tags:
      - 'v*'
```

## Permissions

The action needs `contents: write` to update the release body:

```yaml
permissions:
  contents: write
```

If you set `update-release: false`, `contents: read` is sufficient.

---

## Pricing

Free trial at [changenotes.app](https://changenotes.app) — no credit card required.

| Plan | Price | Includes |
|------|-------|---------|
| Trial | Free (14 days) | Full access |
| Pro | $29/mo per workspace | Unlimited repos, unlimited changelogs |

---

## Links

- **Website**: [changenotes.app](https://changenotes.app)
- **Main repo**: [elesinn/shiplog](https://github.com/elesinn/shiplog)
- **Issues & feedback**: [github.com/elesinn/shiplog/issues](https://github.com/elesinn/shiplog/issues)

## License

MIT
