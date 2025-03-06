
import { useState, useEffect } from 'react';

// 自定义 Hook 用于跟踪元素是否在视口内
export function useInView(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [isInView, setIsInView] = useState(false); // 定义一个状态来存储元素是否在视口内

  useEffect(() => {
    if (!ref.current) return; // 如果 ref 没有指向任何元素，则不做处理

    // 创建一个 IntersectionObserver 实例，监听元素是否进入视口
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting); // 更新状态为元素是否在视口内
    }, options);

    observer.observe(ref.current); // 开始观察 ref 指向的元素

    // 清理函数，在组件卸载时停止观察
    return () => {
      observer.disconnect(); // 断开与元素的观察
    };
  }, [ref, options]); // 依赖项为 ref 和 options，当它们变化时重新执行副作用

  return isInView; // 返回元素是否在视口内的状态
}

// 自定义 Hook 用于为一组元素应用错开的动画延迟
export function useStaggeredAnimation(
  totalItems: number,
  baseDelay: number = 100 // 每个元素的基本延迟，默认 100ms
): number[] {
  const [delays, setDelays] = useState<number[]>([]); // 存储每个元素的延迟时间

  useEffect(() => {
    // 根据 totalItems 和 baseDelay 生成每个元素的延迟时间
    const newDelays = Array.from({ length: totalItems }, (_, i) => i * baseDelay);
    setDelays(newDelays); // 更新延迟时间数组
  }, [totalItems, baseDelay]); // 当 totalItems 或 baseDelay 改变时，重新计算延迟时间

  return delays; // 返回每个元素的延迟时间数组
}

// 函数用于实现打字效果
export function typeText(
  text: string,
  duration: number = 1000, // 打字效果的总时长，默认为 1000ms
  callback?: () => void // 可选的回调函数，在打字完成后调用
): { text: string; done: boolean } {
  const [displayText, setDisplayText] = useState(''); // 用于显示的文本
  const [isDone, setIsDone] = useState(false); // 标记打字效果是否完成

  useEffect(() => {
    let timeoutId: number;
    const charDelay = duration / text.length; // 计算每个字符的显示延迟时间
    
    // 遍历文本中的每个字符，逐个显示
    for (let i = 0; i <= text.length; i++) {
      timeoutId = window.setTimeout(() => {
        setDisplayText(text.slice(0, i)); // 更新显示的文本
        if (i === text.length) {
          setIsDone(true); // 标记打字效果完成
          if (callback) callback(); // 如果有回调函数，调用它
        }
      }, i * charDelay); // 根据字符索引控制每个字符的显示延迟
    }

    // 清理函数，在组件卸载时清除定时器
    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [text, duration, callback]); // 当 text、duration 或 callback 改变时，重新启动打字效果

  return { text: displayText, done: isDone }; // 返回当前显示的文本和打字是否完成的状态
}
