import { assert, test, testGroup } from "test/test_helper"
import EditorController from "trix/controllers/editor_controller"
import Middleware from "trix/core/middleware"

testGroup("EditorController extension middleware", () => {
  test("wraps the original render operation", () => {
    const controller = Object.create(EditorController.prototype)
    const calls = []

    controller.renderMiddleware = new Middleware()
    controller.compositionController = {
      render() {
        calls.push("original")
        return "result"
      },
    }

    controller.renderMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    const result = controller.render()

    assert.equal(result, "result")
    assert.deepEqual(calls, ["before", "original", "after"])
  })

  test("passes the controller as middleware context", () => {
    const controller = Object.create(EditorController.prototype)
    controller.renderMiddleware = new Middleware()
    controller.compositionController = { render() {} }

    let received
    controller.renderMiddleware.use((context, next) => {
      received = context
      return next()
    })

    controller.render()

    assert.strictEqual(received, controller)
  })
})