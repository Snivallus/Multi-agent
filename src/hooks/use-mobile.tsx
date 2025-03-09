import * as React from "react"

// 定义移动端的屏幕宽度阈值
const MOBILE_BREAKPOINT = 768

// 自定义 Hook：用于检测当前窗口是否处于移动端尺寸
export function useIsMobile() {
  // 定义一个状态变量 isMobile，表示是否处于移动端视图
  // 初始状态为 undefined，避免在服务器端渲染时访问 window 对象
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // 创建媒体查询对象，匹配窗口宽度小于 MOBILE_BREAKPOINT
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // 定义回调函数，每当窗口大小变化时，更新 isMobile 状态
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // 监听媒体查询的变化事件
    mql.addEventListener("change", onChange)

    // 初始化 isMobile 状态，确保组件挂载后立即获取正确的窗口大小
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // 在组件卸载时移除事件监听，防止内存泄漏
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // 返回 isMobile 状态，确保返回布尔值
  return !!isMobile
}