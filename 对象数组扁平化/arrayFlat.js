// 数组扁平化
const arr = [1,2,3,[4,[5,[6,[7,[8,{a:1}]]]],9],10]

function arrFlat(arr){
  let res = []
  for(let i = 0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
      res = res.concat(arrFlat(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res 
}
console.log(arrFlat(arr))