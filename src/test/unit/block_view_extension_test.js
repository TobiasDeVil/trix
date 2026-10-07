import { assert, test, testGroup } from "test/test_helper"
import BlockView from "trix/views/block_view"
import Middleware from "trix/core/middleware"

testGroup("BlockView extension middleware", () => {
  test("wraps the original createNodes operation", () => {
    const view = Object.create(BlockView.prototype)
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

  test("passes the BlockView as middleware context", () => {
    const view = Object.create(BlockView.prototype)

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

  test("preserves the original result", () => {
    const view = Object.create(BlockView.prototype)
    const originalResult = ["block", "nodes"]

    view.renderMiddleware = new Middleware()
    view.createNodesOriginal = () => originalResult

    const result = view.createNodes()

    assert.strictEqual(result, originalResult)
  })
})