const obj1 = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
  { id: 4, name: 'd' },
  { id: 5, name: 'e' },
  { id: 6, name: 'f' }
]

const obj2 = [
  { id: 1, name: 'a' },
  { id: 2, name: 'b' },
  { id: 3, name: 'c' },
  { id: 100, name: '100' },
]

function diff(newObj, oldObj) {
  const newObjMap = {}
  const oldObjMap = {}
  const res = []
  let arr
  newObj.map((v) => {
    newObjMap[v.id] = v
  })
  oldObj.map((v) => {
    oldObjMap[v.id] = v
  })
  arr = [...new Set([...Object.keys(newObjMap), ...Object.keys(oldObjMap)])]
  arr.forEach((v) => {
    if (!newObjMap[v] && oldObjMap[v]) {
      res.push(oldObjMap[v])
    } else if (newObjMap[v] && !oldObjMap[v]) {
      res.push(newObjMap[v])
    }
  })
  return res
}

console.log(diff(obj1, obj2))