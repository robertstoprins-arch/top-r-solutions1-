import { useState } from 'react'
import { Link } from 'react-router-dom'
import { C, T } from '../tokens'

const ACCORDION_ITEMS = [
  {
    id: 1,
    title: 'BIM Services',
    to: '/services',
    imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Process Automation',
    to: '/tools',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'App Development',
    to: '/tools/apps',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'Scan to BIM',
    to: '/surveys/scan-to-bim',
    imageUrl: 'https://images.unsplash.com/photo-1581092334218-cf9e5b8a5cfc?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'Surveys',
    to: '/surveys',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop',
  },
]

function AccordionItem({ item, isActive, onMouseEnter }) {
  return (
    <Link
      to={item.to}
      onMouseEnter={onMouseEnter}
      style={{
        position: 'relative',
        height: '420px',
        width: isActive ? '380px' : '58px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        flexShrink: 0,
        transition: 'width 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
        textDecoration: 'none',
        display: 'block',
      }}
    >
      {/* Background image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={e => {
          e.currentTarget.style.display = 'none'
          e.currentTarget.parentElement.style.background = C.border
        }}
      />

      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.42)',
      }} />

      {/* Label */}
      <span style={{
        position: 'absolute',
        color: '#fff',
        fontSize: '0.9rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        letterSpacing: '-0.01em',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), bottom 0.35s, left 0.35s',
        ...(isActive
          ? {
              bottom: '1.5rem',
              left: '50%',
              transform: 'translateX(-50%) rotate(0deg)',
            }
          : {
              bottom: '5.5rem',
              left: '50%',
              transform: 'translateX(-50%) rotate(90deg)',
            }),
      }}>
        {item.title}
      </span>
    </Link>
  )
}

export default function ImageAccordion() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: '10px',
        overflowX: 'auto',
        paddingBottom: '4px', // prevents clipping of border-radius shadows
      }}
      onMouseLeave={() => setActiveIndex(0)}
    >
      {ACCORDION_ITEMS.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
}
