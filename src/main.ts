import axios from 'axios'
import { marked } from 'marked'
;(function () {
  'use strict'

  window.onload = () => {
    init()
  }
})()

async function init() {
  const username: string | undefined = document
    .querySelector(
      '#switch_dashboard_context_left_column-button > span.Button-content > span > span:nth-child(2)'
    )
    ?.innerHTML.trim()

  GM_addStyle(`
    .color-fg-todo {
      fill: white;
      background-color: var(--fgColor-open);
    }
    
    .color-fg-push {
      fill: white;
      background-color: var(--fgColor-accent);
    }
  `)

  if (username) {
    new PullRequestEvent(username).load()
  }
}

let conduitFeedFrameCount: number = 0

/**
 * Listen PR list loading, execute handler when page loads new PR list (only execute once)
 * @param {Function} handler
 */
function listenConduitTurboFrame(handler: Function) {
  const interval = setInterval(() => {
    const len = document.querySelectorAll('turbo-frame').length
    if (conduitFeedFrameCount !== len) {
      clearInterval(interval)
      conduitFeedFrameCount = len
      handler()
    }
  }, 50)
}

abstract class Event {
  lastDateTime = new Date().toISOString()

  abstract load(): Promise<void>
  abstract fetch(): Promise<any[]>

  /**
   * Render multiple PR nodes to the List on the homepage in chronological order
   * @param {Array<Element>} elements
   * @param {boolean} showMore
   */
  render(elements: Array<Element>, showMore: boolean) {
    const conduitFeedFrame = document.querySelector('#conduit-feed-frame')
    const articles = conduitFeedFrame?.querySelectorAll('article')
    if (!articles) return
    let index = 0
    for (let children of articles) {
      if (!children?.parentNode) continue
      const dateTime = getDateTimeFromElement(children)
      if (dateTime !== null) {
        for (let i = index; i < elements.length; i++) {
          const element = elements[i]
          const prDateTime = getDateTimeFromElement(element)
          if (prDateTime && prDateTime.getTime() > dateTime.getTime()) {
            children.parentNode.insertBefore(element, children)
            this.lastDateTime = prDateTime.toISOString()
            index = i + 1
          } else break
        }
      }
    }
    if (showMore) {
      const parentNode = articles[articles.length - 1].parentNode
      if (!parentNode) return
      let earlierDateTime = new Date()
      earlierDateTime.setMonth(earlierDateTime.getMonth() - 3)
      for (let i = index; i < elements.length; i++) {
        const element = elements[i]
        const prDateTime = getDateTimeFromElement(element)
        if (prDateTime && prDateTime.getTime() > earlierDateTime.getTime()) {
          parentNode.appendChild(element)
          this.lastDateTime = prDateTime.toISOString()
          index = i + 1
        } else break
      }
    }
  }
}

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
  username: string
  lastDateTime = new Date().toISOString()

  constructor(username: string) {
    super()
    this.username = username
  }

  /**
   * Load the user's PR list to the homepage
   */
  async load() {
    const pullRequests = await this.fetch()
    listenConduitTurboFrame(() => {
      const moreButton = document.querySelector(
        '#conduit-feed-frame > form > button'
      )
      if (moreButton) {
        moreButton.addEventListener('click', () => {
          this.load()
        })
        this.render(pullRequests, false)
      } else this.render(pullRequests, true)
    })
  }

  /**
   * Fetch the PRs of the specified user and construct HTML elements, return the list of constructed HTML elements
   */
  async fetch() {
    try {
      const apiURL = `https://api.github.com/search/issues?q=is:pr+author:${this.username}+created:<${this.lastDateTime}&sort=created&order=desc`
      console.log('Fetch', apiURL)
      const response = await axios.get(apiURL, {
        headers: {
          Accept: 'application/vnd.github.v3+json'
          // TODO: how to get user token dynamically
          // Authorization: "Bearer xxx",
        }
      })
      if (response.status === 200) {
        const prs: Array<PullRequest> = response.data.items
        console.log(prs)
        let pullRequestElements = new Array()
        for (let pr of prs) {
          pullRequestElements.push(this.createElement(pr))
        }
        return pullRequestElements
      } else {
        throw new Error(`Failed to fetch PullRequests: ${response.statusText}`)
      }
    } catch (error) {
      if (error instanceof Error)
        throw new Error(`Failed to fetch PullRequests: ${error.message}`)
      else throw error
    }
  }

  /**
   * Build HTML node based on PR information
   * @param {PullRequest} pr
   * @returns Element
   */
  createElement(pr: PullRequest) {
    const merged = pr.state == 'closed'
    const stateSvg = merged
      ? `<svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-feed-merged circle feed-item-heading-icon feed-next color-fg-done position-absolute"> <path d="M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm.25-11.25A1.75 1.75 0 1 0 6 6.428v3.144a1.75 1.75 0 1 0 1 0V8.236A2.99 2.99 0 0 0 9 9h.571a1.75 1.75 0 1 0 0-1H9a2 2 0 0 1-1.957-1.586A1.75 1.75 0 0 0 8.25 4.75Z"></path> </svg>`
      : `<svg height="16" class="octicon octicon-feed-open circle feed-item-heading-icon feed-next color-fg-todo position-absolute" viewBox="-3 -3 22 22" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`
    let body = pr.body || ''
    if (body.length >= 1410) {
      body = body.substring(0, 1410) + '...'
    }

    const avatar = new Image(pr.user.avatar_url, pr.user.login)
    const userLink = new Link(pr.user.login, pr.user.html_url, undefined)
    const joinText = 'contributed to'
    const repoLink = new Link(
      pr.repository_url.replace(`https://api.github.com/repos/`, ''),
      pr.repository_url,
      undefined
    )
    const cardHeader = new CardHeader(
      avatar,
      stateSvg,
      pr.created_at,
      userLink,
      joinText,
      repoLink
    )

    const title = new Link(pr.title, pr.html_url, pr.number)
    const stateGap = new CardPullRequestGap(merged)
    const cardBody = new CardBody(title, body, stateGap)

    const card = new Card(cardHeader, cardBody)
    return createElementFromHTML(card.html())
  }
}

/**
 * Build HTML node from HTML string
 * @param {string} html
 * @returns HTML element
 */
function createElementFromHTML(html: string) {
  const container = document.createElement('div')
  container.innerHTML = html
  return container.firstElementChild
}

/**
 * Extract time information from PR node
 * @param {Element} element
 * @returns Date
 */
function getDateTimeFromElement(element: Element): Date | null {
  const relativeTimeElement = element.querySelector('relative-time')
  if (!relativeTimeElement) return null
  return new Date(relativeTimeElement.getAttribute('datetime') || '')
}

/**
 * Card types
 */

class Link {
  text: string
  href: string
  patch: any

  constructor(text: string, href: string, patch: any) {
    this.text = text
    this.href = href
    this.patch = patch
  }
}

class Image {
  src: string
  alt: string
  constructor(src: string, alt: string) {
    this.src = src
    this.alt = alt
  }
}

class CardHeader {
  avatar: Image
  icon: string
  time: string
  link1: Link
  joinText: string
  link2: Link

  constructor(
    avatar: Image,
    icon: string,
    time: string,
    link1: Link,
    joinText: string,
    link2: Link | undefined
  ) {
    this.avatar = avatar
    this.icon = icon
    this.time = time
    this.link1 = link1
    this.joinText = joinText
    if (link2) {
      this.link2 = link2
    } else {
      this.link2 = new Link('', '', undefined)
    }
  }

  html() {
    const template = `
      <div class="px-3">
        <header class="mt-1 mb-2 width-full d-flex flex-justify-between">
          <!-- avatar -->
          <div class="mr-2">
            <div class="position-relative">
              <a class="Link d-block">
                <img
                  src="${this.avatar.src}"
                  alt="${this.avatar.alt} profile"
                  size="40"
                  height="40"
                  width="40"
                  class="feed-item-user-avatar avatar circle box-shadow-none"
                />
              </a>
              ${this.icon}
            </div>
          </div>

          <!-- title -->
          <div class="flex-1 ml-1 mb-1">
            <h5
              class="text-normal color-fg-muted d-flex flex-items-center flex-row flex-nowrap width-fit"
            >
              <span class="flex-1">
                <span class="flex-shrink-0">
                  <a
                    href="${this.link1.href}"
                    class="Link--primary Link text-bold"
                    >${this.link1.text}</a
                  >
                  ${this.joinText}
                </span>
                <span class="overflow-auto">
                  <span class="Truncate">
                    <span class="Truncate-text">
                      <a
                        href="${this.link2.href}"
                        class="Link--primary Link text-bold"
                        >${this.link2.text}</a
                      >
                    </span>
                  </span>
                </span>
              </span>
            </h5>
            <div class="d-flex">
              <h6
                style="margin-top: 0rem"
                class="text-small text-normal color-fg-muted"
              >
                <relative-time
                  tense="past"
                  datetime="${this.time}"
                  title="${this.time}"
                  >${this.time}</relative-time
                >
              </h6>
            </div>
          </div>
        </header>
      </div>
    `
    return template
  }
}

class CardBody {
  title: Link
  markdown: string
  gap: CardGap

  constructor(title: Link | undefined, markdown: string, gap: CardGap) {
    this.title = title || new Link('', '', undefined)
    this.markdown = markdown || ''
    this.gap = gap
  }

  html() {
    const titleTemplate = `
      <h3 class="lh-condensed mt-2 mb-2">
        <a
          href="${this.title?.href}"
          class="Link--primary Link text-bold"
        >
          ${this.title.text}
          <span class="f3-light color-fg-muted"
            >${this.title.patch ? '#' + this.title.patch : ''}</span
          >
        </a>
      </h3>
    `
    const markdownTempalte = this.markdown
      ? `
        <section class="dashboard-break-word comment-body markdown-body m-0 p-3 color-bg-subtle mb-0 rounded-1">
          ${marked.parse(this.markdown)}
        </section>`
      : ''
    const template = `
      <div class="mt-1 mb-1">
        <div class="px-3">
          <div>
            ${titleTemplate}
            ${this.gap ? this.gap.html() : ''}
            ${markdownTempalte}
          </div>
        </div>
      </div>
    `
    return template
  }
}

class Card {
  header: CardHeader
  body: CardBody

  constructor(header: CardHeader, body: CardBody) {
    this.header = header
    this.body = body
  }

  html() {
    const template = `
      <article class="js-feed-item-component js-feed-item-view js-feed-item-next-component d-flex flex-column width-full flex-items-baseline pt-2 pb-2">
        <div class="feed-item-content d-flex flex-column pt-2 pb-2 border color-border-default rounded-2 color-shadow-small width-full height-fit">
          <div class="rounded-2 py-1">
            ${this.header.html()}
            ${this.body.html()}
          </div>
        </div>
      </article>
    `
    return template
  }
}

interface CardGap {
  html(): string
}

class CardPullRequestGap {
  state: boolean

  constructor(state: boolean) {
    this.state = state
  }

  html() {
    const icon = this.state
      ? `<svg height="14" class="octicon octicon-git-merge" viewBox="0 0 16 16" version="1.1" width="14" aria-hidden="true"><path d="M5.45 5.154A4.25 4.25 0 0 0 9.25 7.5h1.378a2.251 2.251 0 1 1 0 1.5H9.25A5.734 5.734 0 0 1 5 7.123v3.505a2.25 2.25 0 1 1-1.5 0V5.372a2.25 2.25 0 1 1 1.95-.218ZM4.25 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm8.5-4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 3.25a.75.75 0 1 0 0 .005V3.25Z"></path></svg>`
      : `<svg height="16" class="octicon octicon-git-pull-request" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"></path></svg>`
    const template = `
      <section width="full" class="f6 color-fg-muted mt-2 mb-2">
        <span class="State State--${
          this.state ? 'merged' : 'open'
        } State--small mr-2">
          ${icon}
          ${this.state ? 'Merged' : 'Open'}
        </span>
      </section>
    `
    return template
  }
}
