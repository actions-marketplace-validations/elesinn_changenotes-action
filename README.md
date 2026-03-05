# Changenotes GitHub Action

Generate AI-powered changelogs on every release — automatically update your GitHub release notes with a beautifully formatted changelog.

## Features

- Triggers on GitHub release events
- Reads commits and pull requests since the last tag
- Generates structured changelogs using AI
- Updates your GitHub release body automatically
- Enforces subscription limits from changenotes.app

## Quick Start

1. **Get an API key** at [changenotes.app/settings](https://changenotes.app/settings)
2. **Add the secret** to your repository: `Settings → Secrets → New repository secret` → name it `CHANGENOTES_API_KEY`
3. **Add the workflow** to your repository:

```yaml
# .github/workflows/changelog.yml
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

That's it. On every published release, Changenotes will generate a changelog and update the release body.

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `changenotes-api-key` | Yes | — | Your Changenotes API key |
| `github-token` | No | `${{ github.token }}` | GitHub token for reading commits and updating releases |
| `update-release` | No | `true` | Set to `false` to skip updating the release body |
| `api-url` | No | `https://changenotes.app` | Override for self-hosted instances |

## Outputs

| Output | Description |
|--------|-------------|
| `changelog` | The generated changelog in Markdown format |
| `tag` | The release tag that was processed |
| `previous-tag` | The previous tag used as the base for comparison |

## Using the Output

```yaml
- id: changelog
  uses: elesinn/changenotes-action@v1
  with:
    changenotes-api-key: ${{ secrets.CHANGENOTES_API_KEY }}

- name: Print changelog
  run: echo "${{ steps.changelog.outputs.changelog }}"
```

## Supported Triggers

The action works with these event types:

- `release` (recommended) — triggers when a release is published
- `push` on tag refs — triggers when a tag is pushed
- `create` on tag type — triggers when a tag is created

## Permissions

The action needs `contents: write` permission to update release notes.

```yaml
permissions:
  contents: write
```

If you set `update-release: false`, only `contents: read` is needed.

## License

MIT
