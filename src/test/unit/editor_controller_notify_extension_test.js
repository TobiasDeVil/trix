import { assert, test, testGroup } from "test/test_helper"
import EditorController from "trix/controllers/editor_controller"
import Middleware from "trix/core/middleware"

testGroup("EditorController notify extension middleware", () => {
  test("wraps the original notify operation", () => {
    const controller = Object.create(EditorController.prototype)
    const calls = []

    controller.notifyMiddleware = new Middleware()
    controller.editorElement = {
      notify(message, data) {
        calls.push([ message, data ])
        return "result"
      },
    }

    controller.notifyMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    const data = { value: 1 }
    const result = controller.notifyEditorElement("test", data)

    assert.equal(result, "result")
    assert.deepEqual(calls, [ "before", [ "test", data ], "after" ])
  })

  test("passes the controller as middleware context", () => {
    const controller = Object.create(EditorController.prototype)
    controller.notifyMiddleware = new Middleware()
    controller.editorElement = { notify() {} }

    let received
    controller.notifyMiddleware.use((context, next) => {
      received = context
      return next()
    })

    controller.notifyEditorElement("test")

    assert.strictEqual(received, controller)
  })
})
