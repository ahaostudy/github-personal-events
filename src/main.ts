import { EventsGroup, CommitEvents, PullRequestEvents } from './event'

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
    
    .color-fg-commits {
      color: var(--fgColor-accent);
    }
  `)

  if (username) {
    const eventsGroup = new EventsGroup()
    eventsGroup.regsiter(new CommitEvents())
    eventsGroup.regsiter(new PullRequestEvents())
    eventsGroup.load(username)
  }
}
