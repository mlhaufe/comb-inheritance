import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Component } from '@mlhaufe/comb-inheritance'

describe('Event Propagation', () => {
    // Base component class with event handling via prototype
    class UIComponent extends Component {
        // Shared event handling method on prototype
        handleEvent(event) {
            const handler = this[`on${event.type}`]
            if (handler) {
                handler.call(this, event)
                if (event.stopped) return
            }

            // Bubble to parent if not stopped
            if (this.parent && !event.stopped)
                this.parent.handleEvent(event)
        }
    }

    class Button extends UIComponent {
        constructor(label, parent) {
            super(parent)
            this.label = label
        }

        onclick(event) {
            event.log = event.log || []
            event.log.push(`Button "${this.label}" clicked`)
        }
    }

    class Panel extends UIComponent {
        constructor(name, parent) {
            super(parent)
            this.name = name
        }

        onclick(event) {
            event.log = event.log || []
            event.log.push(`Panel "${this.name}" received click`)
        }
    }

    class Window extends UIComponent {
        constructor(title) {
            super(null)
            this.title = title
        }

        onclick(event) {
            event.log = event.log || []
            event.log.push(`Window "${this.title}" received click`)
            event.stopped = true
        }
    }

    it('should bubble through full hierarchy', () => {
        const mainWindow = new Window('App')
        const sidebar = new Panel('Sidebar', mainWindow)
        const saveButton = new Button('Save', sidebar)

        const event = { type: 'click', stopped: false, log: [] }
        saveButton.handleEvent(event)

        assert.equal(event.log.length, 3)
        assert.equal(event.log[0], 'Button "Save" clicked')
        assert.equal(event.log[1], 'Panel "Sidebar" received click')
        assert.equal(event.log[2], 'Window "App" received click')
    })

    it('should stop propagation at panel level', () => {
        const mainWindow = new Window('App')
        const sidebar = new Panel('Sidebar', mainWindow)
        const saveButton = new Button('Save', sidebar)

        // Override onclick to stop at panel
        sidebar.onclick = function (event) {
            event.log = event.log || []
            event.log.push(`Panel "${this.name}" stopped`)
            event.stopped = true
        }

        const event = { type: 'click', stopped: false, log: [] }
        saveButton.handleEvent(event)

        assert.equal(event.log.length, 2)
        assert.equal(event.log[0], 'Button "Save" clicked')
        assert.equal(event.log[1], 'Panel "Sidebar" stopped')
    })

    it('should verify handleEvent comes from prototype', () => {
        const mainWindow = new Window('App')
        const sidebar = new Panel('Sidebar', mainWindow)
        const saveButton = new Button('Save', sidebar)

        assert.equal(typeof saveButton.handleEvent, 'function')
        assert.equal(saveButton.handleEvent, sidebar.handleEvent)
        assert.equal(Object.hasOwn(saveButton, 'handleEvent'), false)
    })

    it('should verify parent chain provides propagation path', () => {
        const mainWindow = new Window('App')
        const sidebar = new Panel('Sidebar', mainWindow)
        const saveButton = new Button('Save', sidebar)

        assert.equal(saveButton.parent, sidebar)
        assert.equal(sidebar.parent, mainWindow)
        assert.equal(mainWindow.parent, null)
    })
})
