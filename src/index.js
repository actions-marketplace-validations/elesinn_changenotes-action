const core = require('@actions/core')
const github = require('@actions/github')

async function run() {
  try {
    const apiKey = core.getInput('changenotes-api-key', { required: true })
    const githubToken = core.getInput('github-token', { required: true })
    const updateRelease = core.getInput('update-release') !== 'false'
    const apiUrl = core.getInput('api-url') || 'https://changenotes.app'

    const context = github.context
    const { owner, repo } = context.repo

    // Determine the tag from the event context
    let tag = null
    if (context.eventName === 'release') {
      tag = context.payload.release?.tag_name
    } else if (context.eventName === 'push' && context.ref?.startsWith('refs/tags/')) {
      tag = context.ref.replace('refs/tags/', '')
    } else if (context.eventName === 'create' && context.payload.ref_type === 'tag') {
      tag = context.payload.ref
    }

    if (!tag) {
      core.setFailed(
        'Could not determine tag name. Trigger this action on release, push (tags), or create (tag) events.'
      )
      return
    }

    core.info(`Generating changelog for ${owner}/${repo}@${tag}`)

    // Call Changenotes API
    const response = await fetch(`${apiUrl}/api/action/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        owner,
        repo,
        tag,
        githubToken,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }))
      if (response.status === 402) {
        core.setFailed(
          'Changenotes subscription required. Visit changenotes.app to upgrade.'
        )
      } else {
        core.setFailed(`Changenotes API error (${response.status}): ${error.error}`)
      }
      return
    }

    const result = await response.json()
    const { markdown, previousTag, commitCount, prCount } = result

    core.info(`Generated changelog from ${commitCount} commits and ${prCount} PRs`)
    core.info(`Comparing ${previousTag || '(initial release)'} → ${tag}`)

    // Set outputs
    core.setOutput('changelog', markdown)
    core.setOutput('tag', tag)
    core.setOutput('previous-tag', previousTag || '')

    // Update the GitHub release body if requested and we're on a release event
    if (updateRelease && context.eventName === 'release') {
      const octokit = github.getOctokit(githubToken)
      const releaseId = context.payload.release?.id

      if (releaseId) {
        await octokit.rest.repos.updateRelease({
          owner,
          repo,
          release_id: releaseId,
          body: markdown,
        })
        core.info('Release notes updated successfully')
      }
    }

    core.info('Changenotes: changelog generated successfully')
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
