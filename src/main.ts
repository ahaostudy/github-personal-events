import { Events, PullRequestEvent } from './event'
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
    const events = new Events()
    events.regsiter(new PullRequestEvent())
    events.load(username)
  }
}
