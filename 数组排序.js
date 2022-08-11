// 插入排序
const oldArr = [4, 3, 5, 1, 2, 7, 8]

function insertionSort(arr){
  for(let i =0;i<arr.length;i++){
    let j = i
    const temp = arr[i]
    while(j>0&&arr[j-1]>temp){
      arr[j] = arr[j-1]
      j--
    }
    arr[j]= temp
  }
  return arr
}

console.log(insertionSort(oldArr))