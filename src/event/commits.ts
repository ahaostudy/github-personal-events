import { fetchWithCache } from '../cache'
import { createElementFromHTML } from '../utils'
import { Card, CardBody, CardHeader, Image, Link } from '../view/card'
import { EventItem, Events } from './event'

interface Commit extends EventItem {
  commit: {
    message: string
    committer: {
      date: string
    }
  }
  author: {
    login: string
    avatar_url: string
    html_url: string
  }
  repository: {
    full_name: string
    html_url: string
  }
  sha: string
  html_url: string
  parents: { sha: string }[]

  commits: Commit[]
}

class CommitEvents extends Events<Commit> {
  async fetch(username: string, maxTime: Date): Promise<Commit[]> {
    const apiURL = `https://api.github.com/search/commits?q=author:${username}+committer-date:<${maxTime.toISOString()}&sort=committer-date&order=desc`
    const response = await fetchWithCache(apiURL, {
      headers: { Accept: 'application/vnd.github.v3+json' }
    })
    if (response.status === 200) {
      let commits: Array<Commit> = response.data.items
      commits = commits.map((v) => {
        v.start = new Date(v.commit.committer.date)
        v.end = v.start
        v.commits = [v]
        return v
      })
      console.log(commits)
      return commits
    } else {
      throw new Error(`Failed to fetch PullRequests: ${response.statusText}`)
    }
  }

  flatmap(events: Commit[], minTime: Date): Commit[] {
    let result = new Array()
    let repoMap = new Map<string, Commit>()
    for (let event of events) {
      if (event.start.getTime() < minTime.getTime()) break
      const key = event.repository.full_name
      if (repoMap.has(key)) {
        // @ts-ignore
        let commit: Commit = repoMap.get(key)
        commit.start = event.start
        commit.commits.push(event)
        repoMap.set(key, commit)
      } else {
        repoMap.set(key, event)
        result.push(event)
      }
    }
    return result
  }

  view(event: Commit): Element {
    const stateIcon = `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-feed-merged circle feed-item-heading-icon feed-next color-fg-commits position-absolute"> <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.25-11.25A1.75 1.75 0 1 0 6 6.428v3.144a1.75 1.75 0 1 0 1 0V8.236A2.99 2.99 0 0 0 9 9h.571a1.75 1.75 0 1 0 0-1H9a2 2 0 0 1-1.957-1.586A1.75 1.75 0 0 0 8.25 4.75Z"></path> </svg>`
    let body = `# What's Changed\n\n`
    for (let commit of event.commits) {
      body += `- ${commit.commit.message} by [@${commit.author.login}](${
        commit.author.html_url
      }) in [#${commit.sha.substring(0, 6)}](${commit.html_url})\n`
    }
    let startSha = event.commits[event.commits.length - 1].parents[0]?.sha
    let endSha = event.sha

    const avatar = new Image(event.author.avatar_url, event.author.login)
    const userLink = new Link(event.author.login, event.author.html_url)
    const joinText = 'contributed to'
    const repoLink = new Link(
      event.repository.full_name,
      event.repository.html_url
    )
    const cardHeader = new CardHeader(
      avatar,
      stateIcon,
      event.end.toISOString(),
      userLink,
      joinText,
      repoLink
    )

    const title = new Link(
      `Commits from ${event.start.toLocaleDateString()} to ${event.end.toLocaleDateString()}`,
      startSha
        ? `https://github.com/${event.repository.full_name}/compare/${startSha}...${endSha}`
        : `https://github.com/${event.repository.full_name}/tree/${endSha}`
    )
    const cardBody = new CardBody(title, body)

    const card = new Card(cardHeader, cardBody)
    return createElementFromHTML(card.html())
  }
}

export { CommitEvents }
