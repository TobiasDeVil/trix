import { assert, test, testGroup } from "test/test_helper"
import EditorController from "trix/controllers/editor_controller"
import Middleware from "trix/core/middleware"

testGroup("EditorController document view sync extension middleware", () => {
  test("wraps the original document view sync operation", () => {
    const controller = Object.create(EditorController.prototype)
    const calls = []

    controller.documentViewSyncMiddleware = new Middleware()
    controller.compositionControllerDidSyncDocumentViewOriginal = () => {
      calls.push("original")
      return "result"
    }

    controller.documentViewSyncMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    const result = controller.compositionControllerDidSyncDocumentView()

    assert.equal(result, "result")
    assert.deepEqual(calls, ["before", "original", "after"])
  })

  test("passes the controller as middleware context", () => {
    const controller = Object.create(EditorController.prototype)
    controller.documentViewSyncMiddleware = new Middleware()
    controller.compositionControllerDidSyncDocumentViewOriginal = () => {}

    let received
    controller.documentViewSyncMiddleware.use((context, next) => {
      received = context
      return next()
    })

    controller.compositionControllerDidSyncDocumentView()

    assert.strictEqual(received, controller)
  })
})