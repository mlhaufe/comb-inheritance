# comb-inheritance

A JavaScript implementation of Comb Inheritance inspired by NewtonScript.

## Overview

Comb-Inheritance provides a form of multiple inheritance with two paths:

1. **Native JavaScript prototype chain** - Replaces NewtonScript's `_proto`
2. **Parent instance chain via `_parent`** - NewtonScript's `_parent` concept

### Lookup Order

When accessing a property, the lookup follows this order:

1. Own properties
2. Prototype chain (JavaScript's native mechanism via `extends`)
3. Parent instance chain (custom via Proxy)

## Installation

```bash
npm install @mlhaufe/comb-inheritance
```

## Usage

```javascript
import { Component } from '@mlhaufe/comb-inheritance'

class MyClass extends Component {
    // Your class implementation
}

// Create an instance with a parent
const parentInstance = new MyClass()
const childInstance = new MyClass(parentInstance)

// The child can access properties from:
// 1. Its own properties
// 2. MyClass.prototype chain (via extends)
// 3. The parent instance (via parent parameter)
```

### Example: Logger Chain with Super Delegation

```javascript
import { Component } from '@mlhaufe/comb-inheritance'

class InfoLogger extends Component {
    log(request) {
        return request.level === 1
            ? `Info: ${request.message}`
            : super.log(request) // Delegates to parent instance
    }
}

class WarningLogger extends Component {
    log(request) {
        return request.level === 2
            ? `Warning: ${request.message}`
            : super.log(request)
    }
}

class ErrorLogger extends Component {
    log(request) {
        return request.level === 3
            ? `Error: ${request.message}`
            : super.log(request)
    }
}

// Build the chain
const error = new ErrorLogger()
const warning = new WarningLogger(error)
const info = new InfoLogger(warning)

// Messages bubble through the chain
info.log({ level: 1, message: 'Info message' })
info.log({ level: 2, message: 'Warning message' })
info.log({ level: 3, message: 'Error message' })
```

### Example: Document Hierarchy

```javascript
import { Component } from '@mlhaufe/comb-inheritance'

class DocTemplate extends Component {
    paperSize = 'standard'
}

class PageTemplate extends DocTemplate {
    topMargin = 1
    bottomMargin = 2
}

// Create a document hierarchy
const myDoc = new DocTemplate()
myDoc.footer = 2

const myPage = new PageTemplate(myDoc)
myPage.leftMargin = 0.75

// Access properties from multiple sources:
console.log(myPage.leftMargin)   // 0.75 (own property)
console.log(myPage.topMargin)    // 1 (from PageTemplate prototype)
console.log(myPage.footer)       // 2 (from parent myDoc instance)
console.log(myPage.paperSize)    // 'standard' (from DocTemplate prototype)
```

## How It Works

- **Prototype Chain** (horizontal): Inherited class members and methods via standard JavaScript `extends`
- **Parent Chain** (vertical): Instance-specific properties and behaviors via the constructor's parent parameter

This creates a "comb" structure where:

- The teeth of the comb are the prototype chains (class hierarchies)
- The spine of the comb is the parent instance chain (runtime composition)

## API

### `Component`

The base class for comb inheritance.

**Constructor:**

- `new Component(parent = null)` - Creates a new component with an optional parent instance

**Properties:**

- `parent` - Getter that returns the parent instance (read-only)

## Development

### Running Tests

```bash
npm test
```

### Requirements

- Node.js >= 18.0.0

## License

AGPL-3.0-only

## Author

Michael L Haufe <tno@thenewobjective.com> (<https://thenewobjective.com>)

## Links

- [GitHub Repository](https://github.com/mlhaufe/comb-inheritance)
- [Issues](https://github.com/mlhaufe/comb-inheritance/issues)
