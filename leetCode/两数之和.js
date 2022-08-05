// 示例 1：
// 输入：nums = [2,7,11,15], target = 9
// 输出：[0,1]
// 解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

// 示例 2：
// 输入：nums = [3,2,4], target = 6
// 输出：[1,2]

// 示例 3：
// 输入：nums = [3,3], target = 6
// 输出：[0,1]

const nums = [2,7,11,15,5,6,3,8]
const target = 8

function getIndex(nums,target){
  const map = new Map()
  for(let i =0;i<nums.length;i++){
    if(!map.has(target-nums[i])){
      map.set(nums[i],i)
    }else{
      // console.log([map.get(target-nums[i]),i]);
      return [map.get(target-nums[i]),i]
    }
  }
}
getIndex(nums,target)