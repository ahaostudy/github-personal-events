import { marked } from 'marked'

class Link {
  text: string
  href: string
  patch: any

  constructor(text: string, href: string, patch: any = undefined) {
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

interface HTML {
  html(): string
}

class EmptyHTML implements HTML {
  html(): string {
    return ''
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
    link2: Link = new Link('', '')
  ) {
    this.avatar = avatar
    this.icon = icon
    this.time = time
    this.link1 = link1
    this.joinText = joinText
    this.link2 = link2
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
  center: HTML

  constructor(
    title: Link = new Link('', ''),
    markdown: string = '',
    center: HTML = new EmptyHTML()
  ) {
    this.title = title
    this.markdown = markdown
    this.center = center
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
            ${this.center.html()}
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

export { Link, Image, CardHeader, CardBody, Card, type HTML }
