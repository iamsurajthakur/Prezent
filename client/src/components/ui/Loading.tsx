import { useEffect, useRef } from "react"
import gsap from "gsap"

interface LoadingProps {
  done: boolean
  onComplete: () => void
}

const Loading: React.FC<LoadingProps> = ({ done, onComplete }) => {
  const loaderRef = useRef<HTMLDivElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const path = pathRef.current
    if (!path) return

    const length = path.getTotalLength()

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    })

    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: "power2.out",
    })
  }, [])

  useEffect(() => {
    if (!done) return

    const tl = gsap.timeline({
      onComplete,
    })

    tl.to(leftRef.current, {
      x: "-100%",
      duration: 1,
      ease: "power4.inOut",
    }).to(
      rightRef.current,
      {
        x: "100%",
        duration: 1,
        ease: "power4.inOut",
      },
      "<"
    ).to(loaderRef.current,{
        opacity:0,
        duration:0.3
    })
  }, [done])

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 flex items-center justify-center bg-[#0e003d]"
    >

      {/* computer icon */}
      <svg
        viewBox="0 0 200 150"
        className="w-[120px] stroke-white stroke-[3] fill-none z-10"
      >
        <path
          ref={pathRef}
          d="M10 10 H190 V110 H10 Z M80 110 V135 H120 V110"
        />
      </svg>
    </div>
  )
}

export default Loading