import { assert, test, testGroup } from "test/test_helper"
import Middleware from "trix/core/middleware"

testGroup("Middleware", () => {
  test("runs middleware in registration order", () => {
    const calls = []
    const middleware = new Middleware()

    middleware
      .use((context, next) => {
        calls.push("a:before")
        const result = next()
        calls.push("a:after")
        return result
      })
      .use((context, next) => {
        calls.push("b:before")
        const result = next()
        calls.push("b:after")
        return result
      })

    middleware.run({}, () => {
      calls.push("terminal")
      return "done"
    })

    assert.deepEqual(calls, [
      "a:before",
      "b:before",
      "terminal",
      "b:after",
      "a:after",
    ])
  })

  test("passes one shared context through the chain", () => {
    const context = { value: 0 }
    const middleware = new Middleware()

    middleware
      .use((context, next) => {
        context.value += 1
        return next()
      })
      .use((context, next) => {
        context.value += 2
        return next()
      })

    const result = middleware.run(context, (context) => context.value)

    assert.equal(result, 3)
    assert.equal(context.value, 3)
  })

  test("returns the terminal result", () => {
    const middleware = new Middleware()
    assert.equal(middleware.run({}, () => "result"), "result")
  })

  test("does not allow next to be called twice", () => {
    const middleware = new Middleware()

    assert.throws(() => {
      middleware.use((context, next) => {
        next()
        return next()
      })

      middleware.run({})
    })
  })

  test("rejects non-function middleware", () => {
    const middleware = new Middleware()
    assert.throws(() => middleware.use(null))
  })
})
