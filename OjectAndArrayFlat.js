//简单对象扁平化-------------------------------
const obj1 = { a: { b: { c: 1, d: 2 }, e: 3 }, f: { g: 2 } }

function easyObjFlat(item, preKey = '', res = {}) {
  for (let key in item) {
    if (item[key] instanceof Object) {
      easyObjFlat(item[key], preKey + key + '.', res)
    } else {
      res[preKey + key] = item[key]
    }
  }
  return res
}
console.log(easyObjFlat(obj1))

//简单对象扁平化-------------------------------

// 复杂对象扁平化-----------------------------------
const obj = {
  a: 1,
  b: [1, 2, { c: true }, [3]],
  d: { e: 2, f: 3 },
  g: null
}
function mflat(item, preKey = '', res = {}) {
  Object.entries(item).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      let temp = Array.isArray(item) ? `${preKey}[${key}]` : `${preKey}${key}`
      mflat(value, temp, res)
    } else if (value && value instanceof Object) {
      let temp = Array.isArray(item) ? `${preKey}[${key}].` : `${preKey}${key}.`
      mflat(value, temp, res)
    } else {
      let temp = Array.isArray(item) ? `${preKey}[${key}]` : `${preKey}${key}`
      res[temp] = value
    }
  })
  return res
}

console.log(mflat(obj))

// 复杂对象扁平化-----------------------------------
