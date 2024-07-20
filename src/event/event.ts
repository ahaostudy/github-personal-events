import { getTimeFromEventElement } from '../utils'

interface EventItem {
  start: Date
  end: Date
}

abstract class Events<T extends EventItem> {
  lastTime = new Date()
  listener = new EventsDOMListener()

  /**
   * Fetch the event list, returned in the format of a list of HTML elements
   * @param maxTime maximum time limit for event list
   */
  abstract fetch(username: string, maxTime: Date): Promise<T[]>

  /**
   * Build HTML node based on event information
   */
  abstract view(event: T): Element

  /**
   * Transforms or filters the list of fetched event elements
   */
  flatmap(events: T[], _: Date): T[] {
    return events
  }

  private _flatmap(events: T[]): T[] {
    const times = document
      .querySelector('turbo-frame')
      ?.querySelectorAll('relative-time')
    let minTime: Date
    if (times) {
      const lastTime = times[times.length - 1]
      minTime = new Date(lastTime.getAttribute('datetime') || '1970-01-01')
    } else {
      minTime = new Date('1970-01-01')
    }
    return this.flatmap(events, minTime)
  }

  /**
   * Load the user's event list to the homepage
   */
  async load(username: string) {
    try {
      let events = await this.fetch(username, this.lastTime)
      //   let elements = new Array()
      //   for (let event of events) elements.push(this.view(event))
      this.listener.listen(() => {
        const moreButton = document.querySelector(
          '#conduit-feed-frame > form > button'
        )
        events = this._flatmap(events)
        if (moreButton) {
          moreButton.addEventListener('click', () => {
            this.load(username)
          })
          this.render(events, false)
        } else this.render(events, true)
      })
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Render multiple PR nodes to the List on the homepage in chronological order
   */
  render(events: Array<T>, showMore: boolean) {
    const articles = document.querySelectorAll('article') || []
    let index = 0
    for (let article of articles) {
      if (!article?.parentNode) continue
      const articleTime = getTimeFromEventElement(article)
      if (articleTime !== null) {
        for (let i = index; i < events.length; i++) {
          const event = events[i]
          if (event.end.getTime() > articleTime.getTime()) {
            article.parentNode.insertBefore(this.view(event), article)
            index = i + 1
            if (this.lastTime.getTime() > event.start.getTime())
              this.lastTime = event.start
          } else break
        }
      }
    }
    if (showMore) {
      const parentNode = articles[articles.length - 1].parentNode
      if (!parentNode) return
      let minTime = new Date()
      minTime.setMonth(minTime.getMonth() - 3)
      for (let i = index; i < events.length; i++) {
        const event = events[i]
        if (event.end.getTime() > minTime.getTime()) {
          parentNode.appendChild(this.view(event))
          index = i + 1
          if (this.lastTime.getTime() > event.start.getTime())
            this.lastTime = event.start
        } else break
      }
    }
  }
}

class EventsDOMListener {
  count: number = 0

  /**
   * Listen PR list loading, execute handler when page loads new PR list (only execute once)
   */
  listen(handler: Function) {
    const interval = setInterval(() => {
      const cnt = document.querySelectorAll('turbo-frame').length
      if (this.count !== cnt) {
        this.count = cnt
        clearInterval(interval)
        handler()
      }
    }, 50)
  }
}

export { Events, type EventItem }
