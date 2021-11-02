const SIGN = Date.now()
const LEFT_MARK = `__${SIGN}`
const RIGHT_MARK = `${SIGN}__`
const REGEXP = new RegExp(`"${LEFT_MARK}(.*?)${RIGHT_MARK}"`, 'g')

function mark(text) {
    return `${LEFT_MARK}${text}${RIGHT_MARK}`
}

function unmark(text) {
    return text.replace(REGEXP, '$1')
}

function jsReplacer(key, value) {
    switch (typeof value) {
        case 'undefined':
            return mark('undefined')
        case 'function':
            return mark('<Function>')
        case 'number':
            if (Number.isNaN(value)) return mark('NaN')
            if (value === Infinity) return mark('Infinity')
            if (value === -Infinity) return mark('-Infinity')
            return value
        case 'symbol':
            return mark(value.toString())
        case 'bigint':
            return mark(`${value}n`)
        default:
            return value
    }
}

function createCircularReplacer() {
    const stack = []
    const keys = []

    function circulerText(key, value) {
        const valueIndex = stack.indexOf(value)
        const path = keys.slice(0, valueIndex + 1)
        return mark(`<Circular ${path.join('.')}>`)
    }

    return function (key, value) {
        if (stack.length === 0) {
            stack.push(value)
            keys.push('~')
            return value
        }

        const thisIndex = stack.indexOf(this)
        if (~thisIndex) {
            stack.splice(thisIndex + 1)
            keys.splice(thisIndex + 1)
        } else {
            stack.push(this)
        }
        keys.push(key)

        const valueIndex = stack.indexOf(value)
        if (~valueIndex) return circulerText(key, value)

        return value
    }
}

function serializer(...replacers) {
    const _replacers = replacers.filter((replacer) => !!replacer)
    return function (key, value) {
        return _replacers.reduce((value, replacer) => {
            return replacer.call(this, key, value)
        }, value)
    }
}

function jsStringify(value, replacer, space) {
    const replacers = serializer(replacer, createCircularReplacer(), jsReplacer)
    const reuslt = JSON.stringify(value, replacers, space)
    return unmark(reuslt)
}

let JSStringify = function (JS) {
    let stringify = jsStringify(JS)
    let argumentType = typeof (JS)
    if (Array.isArray(JS)) {
        argumentType = "Array"
    } else if (JS instanceof Promise) {
        argumentType = "Promise"
    }

    let argumentPeek = "[unknow item]"
    try {
        let string = JS.toString()
        if (typeof (string) === "string") {
            argumentPeek = string
        }
        if (typeof (JS) == "object") {
            let json = JSON.stringify(JS)
            argumentPeek = json
        }
    } catch (error) { }
    argumentShadow = undefined
    switch (argumentType) {
        case "undefined":
            break;
        case "boolean":
        case "string":
        case "number":
            argumentShadow = JS
            break;
        case "bigint":
            argumentShadow = String(JS) + "n"
            break;
        default:
            argumentShadow = "untraceable"
            {
                let json = JSON.parse(JSON.stringify(JS))
                if (Object.keys(json) > 0) {
                    argumentShadow = json
                }
            }
            break;
    }
    return {
        stringify,
        argumentType,
        argumentPeek,
        argumentShadow,

    }
}
module.exports = JSStringify