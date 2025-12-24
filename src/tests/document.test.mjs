import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { Component } from '@mlhaufe/comb-inheritance'

describe('Document/Chapter/Page Structure', () => {
    // Template classes (prototype chain)
    class DocTemplate extends Component {
        paperSize = 'standard'

        get fullConfig() {
            return `Paper: ${this.paperSize}`
        }
    }

    class SectionTemp extends Component {
        sides = null
    }

    class ChapTemplate extends Component {
        chapterNum = null
        header = true
    }

    class PageTemplate extends SectionTemp {
        topMargin = 1
        bottomMargin = 2
        leftMargin = 1.5
        rightMargin = 1.5
        sides = 'single'
    }

    // Create instances with parent chain
    const myDoc = new DocTemplate()
    myDoc.header = null
    myDoc.footer = 2

    const myChap = new ChapTemplate(myDoc)
    myChap.sides = 'double'
    myChap.chapNum = 2

    const myPage = new PageTemplate(myChap)
    myPage.leftMargin = 0.75

    describe('myDoc instance', () => {
        it('should have own footer property', () => {
            assert.equal(myDoc.footer, 2)
        })

        it('should inherit paperSize from DocTemplate class', () => {
            assert.equal(myDoc.paperSize, 'standard')
        })
    })

    describe('myChap instance', () => {
        it('should have own chapNum property', () => {
            assert.equal(myChap.chapNum, 2)
        })

        it('should inherit header from ChapTemplate class', () => {
            assert.equal(myChap.header, true)
        })

        it('should get footer from parent myDoc', () => {
            assert.equal(myChap.footer, 2)
        })

        it('should get paperSize from parent\'s class', () => {
            assert.equal(myChap.paperSize, 'standard')
        })
    })

    describe('myPage instance', () => {
        it('should have own leftMargin property', () => {
            assert.equal(myPage.leftMargin, 0.75)
        })

        it('should inherit topMargin from PageTemplate class', () => {
            assert.equal(myPage.topMargin, 1)
        })

        it('should inherit sides from PageTemplate (overrides parent)', () => {
            assert.equal(myPage.sides, 'single')
        })

        it('should get chapNum from parent myChap', () => {
            assert.equal(myPage.chapNum, 2)
        })

        it('should get footer from grandparent myDoc', () => {
            assert.equal(myPage.footer, 2)
        })

        it('should get paperSize from grandparent\'s class', () => {
            assert.equal(myPage.paperSize, 'standard')
        })
    })
})
