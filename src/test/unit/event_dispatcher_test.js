import { assert, test, testGroup } from "test/test_helper"
import EventDispatcher from "trix/core/event_dispatcher"

testGroup("EventDispatcher", () => {
  test("dispatches an event to its listener", () => {
    const dispatcher = new EventDispatcher()
    let called = false

    dispatcher.on("test", () => {
      called = true
    })

    dispatcher.dispatch("test")

    assert.ok(called)
  })

  test("dispatches to multiple listeners in registration order", () => {
    const dispatcher = new EventDispatcher()
    const calls = []

    dispatcher
      .on("test", () => calls.push("a"))
      .on("test", () => calls.push("b"))

    dispatcher.dispatch("test")

    assert.deepEqual(calls, ["a", "b"])
  })

  test("passes the payload to listeners", () => {
    const dispatcher = new EventDispatcher()
    const payload = { value: 42 }
    let received

    dispatcher.on("test", (value) => {
      received = value
    })

    dispatcher.dispatch("test", payload)

    assert.strictEqual(received, payload)
  })

  test("off removes a listener", () => {
    const dispatcher = new EventDispatcher()
    let calls = 0
    const listener = () => calls++

    dispatcher.on("test", listener)
    dispatcher.off("test", listener)
    dispatcher.dispatch("test")

    assert.equal(calls, 0)
  })

  test("dispatching an unknown event is a no-op", () => {
    const dispatcher = new EventDispatcher()

    assert.strictEqual(dispatcher.dispatch("unknown"), undefined)
  })

  test("dispatch uses a snapshot of listeners", () => {
    const dispatcher = new EventDispatcher()
    const calls = []
    const listenerB = () => calls.push("b")

    dispatcher.on("test", () => {
      calls.push("a")
      dispatcher.off("test", listenerB)
    })
    dispatcher.on("test", listenerB)

    dispatcher.dispatch("test")

    assert.deepEqual(calls, ["a", "b"])
  })

  test("rejects non-function listeners", () => {
    const dispatcher = new EventDispatcher()

    assert.throws(() => dispatcher.on("test", null))
  })
})
