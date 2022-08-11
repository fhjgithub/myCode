const oldArr = [4, 3, 5, 1, 2, 7, 8]

// 冒泡排序
function bubbleSort(arr){
  for(let i = 0;i<arr.length;i++){
    for(let j = 0;j<=arr.length-i-1;j++){
      if(arr[j]>arr[j+1]){
        let temp = arr[j]
        arr[j]=arr[j+1]
        arr[j+1] = temp
      }
    }
  }
  return arr
}

// 插入排序
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
