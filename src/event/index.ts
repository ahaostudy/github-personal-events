import { EventItem, Events } from './event'

class EventsGroup {
  events: Events<any>[] = []

  regsiter<T extends EventItem>(event: Events<T>) {
    this.events.push(event)
  }

  load(username: string) {
    for (let event of this.events) {
      event.load(username)
    }
  }
}

export { EventsGroup }

export { CommitEvents } from './commits'
export { Events } from './event'
export { PullRequestEvents } from './pull_request'
