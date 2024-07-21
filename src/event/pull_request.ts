import { fetchWithCache } from '../cache'
import { createElementFromHTML } from '../utils'
import { Card, CardBody, CardHeader, Image, Link } from '../view/card'
import { CardCenterPullRequest } from '../view/pull_request'
import { EventItem, Events } from './event'

interface PullRequest extends EventItem {
  state: string
  body: string
  user: {
    login: string
    avatar_url: string
    html_url: string
  }
  repository_url: string
  created_at: string
  title: string
  html_url: string
  number: number
}

class PullRequestEvents extends Events<PullRequest> {
  async fetch(username: string, maxTime: Date): Promise<PullRequest[]> {
    const apiURL = `https://api.github.com/search/issues?q=is:pr+author:${username}+created:<${maxTime.toISOString()}&sort=created&order=desc`
    const response = await fetchWithCache(apiURL, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
        // TODO: how to get user token dynamically
        // Authorization: "Bearer xxx",
      }
    })
    if (response.status === 200) {
      let pullRequests: PullRequest[] = response.data.items
      pullRequests = pullRequests.map((v) => {
        v.start = new Date(v.created_at)
        v.end = v.start
        return v
      })
      console.log(pullRequests)
      return pullRequests
    } else {
      throw new Error(`Failed to fetch PullRequests: ${response.statusText}`)
    }
  }

  view(event: PullRequest): Element {
    const merged = event.state == 'closed'
    const stateSvg = merged
      ? `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-feed-merged circle feed-item-heading-icon feed-next color-fg-done position-absolute"> <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.25-11.25A1.75 1.75 0 1 0 6 6.428v3.144a1.75 1.75 0 1 0 1 0V8.236A2.99 2.99 0 0 0 9 9h.571a1.75 1.75 0 1 0 0-1H9a2 2 0 0 1-1.957-1.586A1.75 1.75 0 0 0 8.25 4.75Z"></path> </svg>`
      : `<svg height="16" class="octicon octicon-feed-open circle feed-item-heading-icon feed-next color-fg-todo position-absolute" viewBox="-3 -3 22 22" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`
    let body = event.body || ''
    if (body.length >= 1410) {
      body = body.substring(0, 1410) + '...'
    }

    const avatar = new Image(event.user.avatar_url, event.user.login)
    const userLink = new Link(event.user.login, event.user.html_url)
    const joinText = 'contributed to'
    const repoLink = new Link(
      event.repository_url.replace(`https://api.github.com/repos/`, ''),
      event.repository_url
    )
    const cardHeader = new CardHeader(
      avatar,
      stateSvg,
      event.created_at,
      userLink,
      joinText,
      repoLink
    )

    const title = new Link(event.title, event.html_url, event.number)
    const center = new CardCenterPullRequest(merged)
    const cardBody = new CardBody(title, body, center)

    const card = new Card(cardHeader, cardBody)
    return createElementFromHTML(card.html())
  }
}

export { PullRequestEvents }
