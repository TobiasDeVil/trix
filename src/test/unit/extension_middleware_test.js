import { assert, test, testGroup } from "test/test_helper"
import TrixEditorElement from "trix/elements/trix_editor_element"

testGroup("TrixEditorElement extension middleware", () => {
  test("wraps the original connectedCallback", () => {
    const element = new TrixEditorElement()
    const calls = []

    element.connectedCallbackOriginal = () => {
      calls.push("original")
    }

    element.extensionMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    element.connectedCallback()

    assert.deepEqual(calls, ["before", "original", "after"])
  })

  test("passes the editor element as middleware context", () => {
    const element = new TrixEditorElement()
    let received

    element.connectedCallbackOriginal = () => {}

    element.extensionMiddleware.use((context, next) => {
      received = context
      return next()
    })

    element.connectedCallback()

    assert.strictEqual(received, element)
  })
})
