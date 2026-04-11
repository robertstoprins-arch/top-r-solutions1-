import { useState, useEffect } from 'react'

export default function CursorDot() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY })
      if (!visible) setVisible(true)
    }

    const onOver = (e) => {
      const t = e.target
      if (t.closest('a, button, [role="button"], .bento-card-wrap')) {
        setHovered(true)
      }
    }

    const onOut = (e) => {
      const t = e.target
      if (t.closest('a, button, [role="button"], .bento-card-wrap')) {
        setHovered(false)
      }
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [visible])

  if (!visible) return null

  const size = hovered ? 32 : 8

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        background: hovered ? 'transparent' : '#111111',
        border: hovered ? '1.5px solid rgba(0,0,0,0.35)' : 'none',
        transform: `translate(${pos.x - size / 2}px, ${pos.y - size / 2}px)`,
        transition: 'width 0.18s ease, height 0.18s ease, background 0.18s ease, border 0.18s ease',
        pointerEvents: 'none',
        zIndex: 99999,
        mixBlendMode: 'multiply',
      }}
    />
  )
}
