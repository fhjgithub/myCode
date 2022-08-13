let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4}
]



// 递归查找
function getChildren(data,res=[],pid){
  for(const item of data){
    if(item.pid=== pid){
      const newItem= {...item,children:[]}
      res.push(newItem)
      getChildren(data,newItem.children,newItem.id)
    }
  }
  return res
}
// getChildren(arr,res=[],0)


// 优化性能
function arrayToTree(arr){
  const res = []
  const map = {}
 for(const item of arr){
  map[item.id]= {...item,children:[]}
 }
 for(const item of arr){
  const id = item.id
  const pid = item.pid
  const treeItem = map[id]
  if(item.pid === 0){
    res.push(treeItem)
  }else{
    if(!map[pid]){
      map[pid]= {children:[]}
    }
    map[pid].children.push(treeItem)
  }
 }
 return res
}
// arrayToTree(arr)


// 一次遍历
function arrayToTree2(arr){
  const res = []
  const map = {}
  for(const item of arr){
    const id = item.id
    const pid = item.pid
    if(!map[id]){
      map[id]={children:[]}
    }
    map[id]={...item,children:map[id].children}
    
    const treeItem = map[id]
    if(item.pid === 0){
      res.push(treeItem)
    }else{
      if(!map[pid]){
        map[pid]={children:[]}
      }
      map[pid].children.push(treeItem)
    }
  }
  return res
}
// arrayToTree2(arr)






// 输出结果
// [
//   {
//       "id": 1,
//       "name": "部门1",
//       "pid": 0,
//       "children": [
//           {
//               "id": 2,
//               "name": "部门2",
//               "pid": 1,
//               "children": []
//           },
//           {
//               "id": 3,
//               "name": "部门3",
//               "pid": 1,
//               "children": [
//                   // 结果 ,,,
//               ]
//           }
//       ]
//   }
// ]
