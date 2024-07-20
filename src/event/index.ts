import { Event } from './event'

class Events {
  events: Event[] = []

  regsiter(event: Event) {
    this.events.push(event)
  }

  load(username: string) {
    for (let event of this.events) {
      event.load(username)
    }
  }
}

export { Events }

export { Event } from './event'
export { PullRequestEvent } from './pull_request'
