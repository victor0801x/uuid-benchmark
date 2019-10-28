'use strict'

module.exports = function (suite) {
  {
    const uuid = require('uuid-1345').v1
    const name = 'uuid-1345/v1'

    suite.add(name, function () {
      uuid()
    }, {
      leaky: true,
      random: false,
      format: 'uuid'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
      buf.toString('hex')
    }, {
      leaky: true,
      random: false,
      format: 'hex'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
    }, {
      leaky: true,
      random: false,
      format: 'buffer'
    })
  }

  {
    const uuid = require('uuid-1345').v4
    const name = 'uuid-1345/v4'

    suite.add(name, function () {
      uuid()
    }, {
      format: 'uuid'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
      buf.toString('hex')
    }, {
      format: 'hex'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
    }, {
      format: 'buffer'
    })
  }
    
  {
    const uuid = require('uuid-1345').v4fast
    const name = 'uuid-1345/v4fast'

    suite.add(name, function () {
      uuid()
    }, {
      random: false,
      format: 'uuid'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
      buf.toString('hex')
    }, {
      random: false,
      format: 'hex'
    })

    suite.add(name, function () {
      const buf = uuid({ encoding: 'buffer' })
    }, {
      random: false,
      format: 'buffer'
    })
  }
}
