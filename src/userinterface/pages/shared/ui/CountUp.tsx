import { useEffect, useState } from 'react'

interface CountUpProps {
  value: number
  duration?: number
  suffix?: string
}

export const CountUp = ({ value, duration = 1800, suffix = '' }: CountUpProps) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (value <= 0) return
    let startTime: number | null = null
    let rafId: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setCount(Math.floor(eased * value))
      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      } else {
        setCount(value)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [value, duration])

  return <>{count}{suffix}</>
}
