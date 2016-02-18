'use strict'

const { TermBase } = require('./ast')
const Rx = require('rx')

class Aggregate extends TermBase {
  constructor(sendRequest, spec) {
    super(sendRequest, {}, [])
    this._args = aggregate.call(this, spec)
  }

  watch() {
    const args = this._args.map(arg => {
      if (arg.v instanceof TermBase) {
        return arg.v.watch()
      } else {
        return arg.v
      }
    })
    Rx.Observable.combineLatest.apply(null, args, congregate.bind(this))
  }

  fetch() {
    const args = this._args.map(arg => {
      if (arg.v instanceof TermBase) {
        return arg.v.fetch({ asCursor: false })
      } else {
        return arg.v
      }
    })
    Rx.Observable.combineLatest.apply(null, args, congregate.bind(this))
  }
}

/** @this Aggregate */
function congregate(...args) {
  const result = {}
  args.forEach((val, i) => {
    result[this._args[i].k] = val
  })
  return result
}

function aggregate(spec) {
  const args = []
  Object.keys(spec).forEach(key => {
    if (typeof spec[key] !== 'object') {
      throw new Error(`Received an unexpected object: ${spec[key]}`)
    } else if (spec[key] instanceof TermBase) {
      args.push({ k: key, v: spec[key] })
    } else {
      args.push({ k: key, v: aggregate(spec[key]) })
    }
  })
}

module.exports = {
  Aggregate,
}
