export default class EventDispatcher {
  constructor() {
    this.listeners = new Map()
  }

  on(event, listener) {
    if (typeof listener !== "function") {
      throw new TypeError("Event listener must be a function")
    }

    let listeners = this.listeners.get(event)

    if (!listeners) {
      listeners = []
      this.listeners.set(event, listeners)
    }

    listeners.push(listener)
    return this
  }

  off(event, listener) {
    const listeners = this.listeners.get(event)

    if (!listeners) {
      return this
    }

    const index = listeners.indexOf(listener)

    if (index !== -1) {
      listeners.splice(index, 1)
    }

    if (listeners.length === 0) {
      this.listeners.delete(event)
    }

    return this
  }

  dispatch(event, payload) {
    const listeners = this.listeners.get(event)

    if (!listeners) {
      return
    }

    for (const listener of [...listeners]) {
      listener(payload)
    }
  }
}
