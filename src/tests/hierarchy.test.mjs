import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Component } from '@mlhaufe/comb-inheritance'

describe('Document Hierarchy - Real-World Application', () => {
    // Template classes define shared defaults via prototype chain
    class DocTemplate extends Component {
        paperSize = 'letter'

        // Shared method on prototype
        getMargins() {
            return `Top: ${this.topMargin || 'default'}, Bottom: ${this.bottomMargin || 'default'}`
        }
    }

    class PageTemplate extends DocTemplate {
        topMargin = 1.0
        bottomMargin = 1.0
        leftMargin = 1.25
        rightMargin = 1.25
    }

    // Create document instances with parent chain
    const techManual = new DocTemplate()
    techManual.paperSize = 'legal'
    techManual.footerText = 'Confidential'

    const chapter3 = new DocTemplate(techManual)
    chapter3.headerText = 'Chapter 3: Safety'

    const page42 = new PageTemplate(chapter3)
    page42.topMargin = 1.5

    it('should access own property', () => {
        assert.equal(page42.topMargin, 1.5)
    })

    describe('prototype chain lookup', () => {
        it('should get leftMargin from PageTemplate prototype', () => {
            assert.equal(page42.leftMargin, 1.25)
        })

        it('should get rightMargin from PageTemplate prototype', () => {
            assert.equal(page42.rightMargin, 1.25)
        })

        it('should get bottomMargin from PageTemplate prototype', () => {
            assert.equal(page42.bottomMargin, 1.0)
        })
    })

    describe('parent chain lookup', () => {
        it('should get headerText from parent chapter3', () => {
            assert.equal(page42.headerText, 'Chapter 3: Safety')
        })

        it('should get footerText from grandparent techManual', () => {
            assert.equal(page42.footerText, 'Confidential')
        })
    })

    describe('prototype vs parent chain', () => {
        it('should get paperSize from prototype (not parent override)', () => {
            assert.equal(page42.paperSize, 'letter')
        })
    })

    describe('method inheritance', () => {
        it('should call method from prototype using instance properties', () => {
            const margins = page42.getMargins()
            assert.equal(margins, 'Top: 1.5, Bottom: 1')
        })
    })
})
