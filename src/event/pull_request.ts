import axios from 'axios'
import { Event } from '.'
import { createElementFromHTML } from '../utils'
import { Card, CardBody, CardHeader, Image, Link } from '../view/card'
import { CardCenterPullRequest } from '../view/pull_request'

interface PullRequest {
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

class PullRequestEvent extends Event {
  async fetch(username: string, lastDateTime: string) {
    const apiURL = `https://api.github.com/search/issues?q=is:pr+author:${username}+created:<${lastDateTime}&sort=created&order=desc`
    console.log('Fetch', apiURL)
    const response = await axios.get(apiURL, {
      headers: {
        Accept: 'application/vnd.github.v3+json'
        // TODO: how to get user token dynamically
        // Authorization: "Bearer xxx",
      }
    })
    if (response.status === 200) {
      const pullRequests: Array<PullRequest> = response.data.items
      console.log(pullRequests)
      let pullRequestElements = new Array()
      for (let pullRequest of pullRequests) {
        pullRequestElements.push(this.createElement(pullRequest))
      }
      return pullRequestElements
    } else {
      throw new Error(`Failed to fetch PullRequests: ${response.statusText}`)
    }
  }

  /**
   * Build HTML node based on PR information
   */
  createElement(pullRequest: PullRequest) {
    const merged = pullRequest.state == 'closed'
    const stateSvg = merged
      ? `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-feed-merged circle feed-item-heading-icon feed-next color-fg-done position-absolute"> <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.25-11.25A1.75 1.75 0 1 0 6 6.428v3.144a1.75 1.75 0 1 0 1 0V8.236A2.99 2.99 0 0 0 9 9h.571a1.75 1.75 0 1 0 0-1H9a2 2 0 0 1-1.957-1.586A1.75 1.75 0 0 0 8.25 4.75Z"></path> </svg>`
      : `<svg height="16" class="octicon octicon-feed-open circle feed-item-heading-icon feed-next color-fg-todo position-absolute" viewBox="-3 -3 22 22" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`
    let body = pullRequest.body || ''
    if (body.length >= 1410) {
      body = body.substring(0, 1410) + '...'
    }

    const avatar = new Image(
      pullRequest.user.avatar_url,
      pullRequest.user.login
    )
    const userLink = new Link(pullRequest.user.login, pullRequest.user.html_url)
    const joinText = 'contributed to'
    const repoLink = new Link(
      pullRequest.repository_url.replace(`https://api.github.com/repos/`, ''),
      pullRequest.repository_url
    )
    const cardHeader = new CardHeader(
      avatar,
      stateSvg,
      pullRequest.created_at,
      userLink,
      joinText,
      repoLink
    )

    const title = new Link(
      pullRequest.title,
      pullRequest.html_url,
      pullRequest.number
    )
    const center = new CardCenterPullRequest(merged)
    const cardBody = new CardBody(title, body, center)

    const card = new Card(cardHeader, cardBody)
    return createElementFromHTML(card.html())
  }
}

export { PullRequestEvent }
