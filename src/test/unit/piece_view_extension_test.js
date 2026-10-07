import { assert, test, testGroup } from "test/test_helper"
import Middleware from "trix/core/middleware"
import PieceView from "trix/views/piece_view"

testGroup("PieceView extension middleware", () => {
  test("wraps the original createNodes operation", () => {
    const view = Object.create(PieceView.prototype)
    const calls = []

    view.renderMiddleware = new Middleware()
    view.createNodesOriginal = () => {
      calls.push("original")
      return ["result"]
    }

    view.renderMiddleware.use((context, next) => {
      calls.push("before")
      const result = next()
      calls.push("after")
      return result
    })

    const result = view.createNodes()

    assert.deepEqual(result, ["result"])
    assert.deepEqual(calls, ["before", "original", "after"])
  })

  test("passes the PieceView as middleware context", () => {
    const view = Object.create(PieceView.prototype)
    view.renderMiddleware = new Middleware()
    view.createNodesOriginal = () => []

    let received
    view.renderMiddleware.use((context, next) => {
      received = context
      return next()
    })

    view.createNodes()

    assert.strictEqual(received, view)
  })

  test("preserves the original result without middleware", () => {
    const view = Object.create(PieceView.prototype)
    view.renderMiddleware = new Middleware()
    view.createNodesOriginal = () => ["original"]

    const result = view.createNodes()

    assert.deepEqual(result, ["original"])
  })
})
