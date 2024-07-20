import { getTimeFromEventElement } from '../utils'

export abstract class Event {
  lastDateTime = new Date().toISOString()
  listener = new EventsDOMListener()

  /**
   * Fetch the event list, returned in the format of a list of HTML elements
   * @param lastTime maximum time limit for event list
   */
  abstract fetch(username: string, lastTime: string): Promise<any[]>

  /**
   * Transforms or filters the list of fetched event elements
   */
  flatmap(elements: any[]): any[] {
    return elements
  }

  /**
   * Load the user's event list to the homepage
   */
  async load(username: string) {
    try {
      let elements = await this.fetch(username, this.lastDateTime)
      elements = this.flatmap(elements)
      this.listener.listen(() => {
        const moreButton = document.querySelector(
          '#conduit-feed-frame > form > button'
        )
        if (moreButton) {
          moreButton.addEventListener('click', () => {
            this.load(username)
          })
          this.render(elements, false)
        } else this.render(elements, true)
      })
    } catch (error) {
      console.error(error)
    }
  }

  /**
   * Render multiple PR nodes to the List on the homepage in chronological order
   */
  render(elements: Array<Element>, showMore: boolean) {
    const articles = document.querySelectorAll('article') || []
    let index = 0
    for (let children of articles) {
      if (!children?.parentNode) continue
      const dateTime = getTimeFromEventElement(children)
      if (dateTime !== null) {
        for (let i = index; i < elements.length; i++) {
          const element = elements[i]
          const prDateTime = getTimeFromEventElement(element)
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
        const prDateTime = getTimeFromEventElement(element)
        if (prDateTime && prDateTime.getTime() > earlierDateTime.getTime()) {
          parentNode.appendChild(element)
          this.lastDateTime = prDateTime.toISOString()
          index = i + 1
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
