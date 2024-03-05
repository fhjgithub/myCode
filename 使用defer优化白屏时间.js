// vue3示例
import { ref, onUnmounted } from 'vue'

export function useDefer(maxCount = 100) {
    const frameCount = ref(1)
    let rafId
    function updateFrameCount() {
        rafId = requestAnimationFrame(() => {
            frameCount.value++
            if (frameCount.value >= maxCount) return
            updateFrameCount()
        })
    }
    updateFrameCount()
    onUnmounted(() => {
        //取消监听
        cancelAnimationFrame(rafId)
    })
    return function (n) {
        return frameCount.value >= n
    }
}
// 逐帧渲染
//组件使用
//maxCount组件数量
// const defer = useDefer(maxCount)
{/* <Component v-if="defer(n)" /> */ }