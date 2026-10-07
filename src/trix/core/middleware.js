export default class Middleware {
  constructor() {
    this.middlewares = []
  }

  use(middleware) {
    if (typeof middleware !== "function") {
      throw new TypeError("Middleware must be a function")
    }

    this.middlewares.push(middleware)
    return this
  }

  run(context, terminal = () => context) {
    const dispatch = (index) => {
      const middleware = this.middlewares[index]
      if (!middleware) {
        return terminal(context)
      }

      let called = false
      const next = () => {
        if (called) {
          throw new Error("next() called multiple times")
        }

        called = true
        return dispatch(index + 1)
      }

      return middleware(context, next)
    }

    return dispatch(0)
  }
}
