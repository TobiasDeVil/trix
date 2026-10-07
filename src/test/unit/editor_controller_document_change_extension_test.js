import { assert, test, testGroup } from "test/test_helper"
import EditorController from "trix/controllers/editor_controller"
import Middleware from "trix/core/middleware"

testGroup("EditorController document change extension middleware", () => {
  test("wraps the original document change operation", () => {
    const controller = Object.create(EditorController.prototype)
    const calls = []

    controller.documentChangeMiddleware = new Middleware()
    controller.compositionDidChangeDocumentOriginal = () => {
      calls.push("original")
      return "result"
    }

    controller.documentChangeMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    const result = controller.compositionDidChangeDocument("document")

    assert.equal(result, "result")
    assert.deepEqual(calls, ["before", "original", "after"])
  })

  test("passes the controller as middleware context", () => {
    const controller = Object.create(EditorController.prototype)
    controller.documentChangeMiddleware = new Middleware()
    controller.compositionDidChangeDocumentOriginal = () => {}

    let received
    controller.documentChangeMiddleware.use((context, next) => {
      received = context
      return next()
    })

    controller.compositionDidChangeDocument("document")

    assert.strictEqual(received, controller)
  })
})
