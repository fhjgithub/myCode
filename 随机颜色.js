function randomColor1(){
  return '#'+Math.floor(Math.random()*0xffffff).toString(16).padStart(6,0)
}

function randomColor2(){
  return new Array(4).fill('#').reduce((pre,cur)=>{
    return pre + Math.floor(Math.random()*256).toString(16).padStart(2,0)
  })
}

function randomColor3(){
  return new Array(7).fill('#').reduce((pre,cur)=>{
    return pre+'0123456789abcdef'[Math.floor(Math.random()*16)]
  })
}

function randomColor4(){
  const r = Math.floor(Math.random()*256)
  const g = Math.floor(Math.random()*256)
  const b = Math.floor(Math.random()*256)
  return `rgb(${r},${g},${b})`
}

console.log(randomColor1(),randomColor2(),randomColor3(),randomColor4())