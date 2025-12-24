import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Component } from '@mlhaufe/comb-inheritance'

describe('Logger Chain - Super Delegation', () => {
    class InfoLogger extends Component {
        log(request) {
            if (request.level === 1) {
                return `Info: ${request.message}`
            }
            // Check if parent exists before delegating
            if (this.parent && typeof this.parent.log === 'function') {
                return super.log(request)
            }
            return undefined
        }
    }

    class WarningLogger extends Component {
        log(request) {
            if (request.level === 2) {
                return `Warning: ${request.message}`
            }
            // Check if parent exists before delegating
            if (this.parent && typeof this.parent.log === 'function') {
                return super.log(request)
            }
            return undefined
        }
    }

    class ErrorLogger extends Component {
        log(request) {
            if (request.level === 3) {
                return `Error: ${request.message}`
            }
            // Check if parent exists before delegating
            if (this.parent && typeof this.parent.log === 'function') {
                return super.log(request)
            }
            return undefined
        }
    }

    const error = new ErrorLogger()
    const warning = new WarningLogger(error)
    const info = new InfoLogger(warning)

    it('should handle info level messages', () => {
        const result = info.log({ level: 1, message: 'This is an informational message.' })
        assert.equal(result, 'Info: This is an informational message.')
    })

    it('should delegate warning messages to parent', () => {
        const result = info.log({ level: 2, message: 'This is a warning message.' })
        assert.equal(result, 'Warning: This is a warning message.')
    })

    it('should delegate error messages through chain', () => {
        const result = info.log({ level: 3, message: 'This is an error message.' })
        assert.equal(result, 'Error: This is an error message.')
    })

    it('should return undefined for unknown level', () => {
        // Create a standalone error logger with no parent for this test
        const standaloneError = new ErrorLogger()
        const result = standaloneError.log({ level: 99, message: 'Unknown level.' })
        assert.equal(result, undefined)
    })
})
