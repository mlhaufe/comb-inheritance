/**
 * Comb-Inheritance: A form of multiple inheritance with two paths:
 * 1. Native JavaScript prototype chain (replaces NewtonScript's _proto)
 * 2. Parent instance chain via _parent (NewtonScript's _parent)
 *
 * Lookup order:
 * 1. Own properties
 * 2. Prototype chain (JavaScript's native mechanism)
 * 3. Parent instance chain (custom via Proxy)
 *
 * Usage:
 *   class MyClass extends Component { ... }
 *   const child = new MyClass(parentInstance)
 *   // Native prototype chain handles _proto via extends
 *   // parent argument handles _parent chain
 *
 * Note: super.method() will delegate to the parent instance's method
 */

// WeakMap to store parent references outside of the proxy system
const parentMap = new WeakMap()

function Component(parent = null) {
    parentMap.set(this, parent)
}

Object.defineProperty(Component.prototype, 'parent', {
    get() {
        return parentMap.get(this)
    }
})

// Create the proxied prototype
Component.prototype = new Proxy(Component.prototype, {
    get(target, prop, receiver) {
        // Symbols: preserve JS invariants
        if (typeof prop === 'symbol')
            return Reflect.get(target, prop, receiver)

        // 1. Check own properties and native prototype chain FIRST
        // This includes inherited methods from class hierarchy
        if (prop in target) {
            const value = Reflect.get(target, prop, receiver)
            return typeof value === 'function' ? value.bind(receiver) : value
        }

        // 2. Delegate to parent instance chain (dynamic, instance-specific)
        const parent = parentMap.get(receiver)
        if (parent) {
            const value = parent[prop] // Re-enters proxy for recursive lookup
            if (value !== undefined) {
                // Bind functions to parent instance for proper super.method() calls
                return typeof value === 'function' ? value.bind(parent) : value
            }
        }

        return undefined
    }
})

export { Component }
