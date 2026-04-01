import { useState, useRef } from 'react'

// ─── Design tokens (mirrors App.jsx) ─────────────────────────────────────────
const C = {
  bg: '#ffffff',
  surface: '#FAFAFA',
  border: '#E4E4E7',
  borderLight: '#F4F4F5',
  text: '#09090B',
  muted: '#71717A',
  subtle: '#A1A1AA',
  accent: '#2563EB',
  accentBg: '#EFF6FF',
  green: '#059669',
  greenBg: '#F0FDF4',
  greenBorder: '#86EFAC',
  greenLight: '#ECFDF5',
  amber: '#B45309',
  amberBg: '#FFF7ED',
  red: '#DC2626',
  redBg: '#FEF2F2',
}

const T = {
  label: { fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3F3F46' },
  h1: { fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.025em', color: C.text, lineHeight: 1.2 },
  h2: { fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em', color: C.text },
  h3: { fontSize: '0.875rem', fontWeight: 600, color: C.text },
  body: { fontSize: '0.775rem', color: C.muted, lineHeight: 1.75 },
  small: { fontSize: '0.7rem', color: C.subtle, lineHeight: 1.6 },
}

const SUPPLIERS = ['Screwfix', 'Toolstation', 'Travis Perkins', 'Wickes']
const UNITS = ['units', 'm²', 'm', 'kg', 'litres']
const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i

let nextId = 1
const makeItem = () => ({ id: nextId++, description: '', quantity: 1, unit: 'units' })

// ─── Helpers ──────────────────────────────────────────────────────────────────
function cheapestSupplier(row) {
  let min = Infinity
  let winner = null
  for (const s of SUPPLIERS) {
    const p = row.results?.[s]?.price_per_unit
    if (p != null && p < min) { min = p; winner = s }
  }
  return winner
}

function basketTotals(results) {
  return SUPPLIERS.map(s => {
    let total = 0
    let complete = true
    for (const row of results) {
      const r = row.results?.[s]
      if (r?.total_price != null) {
        total += r.total_price
      } else {
        complete = false
      }
    }
    return { supplier: s, total: parseFloat(total.toFixed(2)), complete }
  })
}

function cheapestBasket(totals) {
  const candidates = totals.filter(t => t.complete)
  if (!candidates.length) return null
  return candidates.reduce((a, b) => a.total <= b.total ? a : b)
}

function fmt(n) {
  if (n == null) return '—'
  return `£${n.toFixed(2)}`
}

function AvailBadge({ text }) {
  if (!text || text === 'unknown') return <span style={{ color: C.subtle, fontSize: '0.62rem' }}>—</span>
  const isGood = text === 'in stock'
  const isLow = text === 'limited'
  const isOut = text === 'out of stock'
  const isReq = text === 'price on request'
  const bg = isGood ? C.greenBg : isLow ? '#FFFBEB' : isOut ? C.redBg : C.surface
  const color = isGood ? C.green : isLow ? '#92400E' : isOut ? C.red : C.muted
  return (
    <span style={{
      background: bg, color, fontSize: '0.6rem', fontWeight: 600,
      padding: '0.15rem 0.4rem', borderRadius: '3px',
      textTransform: 'capitalize', whiteSpace: 'nowrap',
    }}>
      {isReq ? 'Price on request' : text}
    </span>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MaterialChecker() {
  const [postcode, setPostcode] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [items, setItems] = useState([makeItem()])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [warnings, setWarnings] = useState([])
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  function validatePostcode(val) {
    if (!UK_POSTCODE_RE.test(val.trim())) {
      setPostcodeError('Enter a valid UK postcode, e.g. SW1A 1AA')
      return false
    }
    setPostcodeError('')
    return true
  }

  function addItem() {
    if (items.length >= 10) return
    setItems(prev => [...prev, makeItem()])
  }

  function removeItem(id) {
    if (items.length <= 1) return
    setItems(prev => prev.filter(i => i.id !== id))
  }

  function updateItem(id, field, value) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const canSearch = (
    UK_POSTCODE_RE.test(postcode.trim()) &&
    items.some(i => i.description.trim().length >= 2) &&
    !loading
  )

  async function handleSearch(e) {
    e.preventDefault()
    if (!validatePostcode(postcode)) return
    const validItems = items.filter(i => i.description.trim().length >= 2)
    if (!validItems.length) return

    setLoading(true)
    setError(null)
    setResults(null)
    setWarnings([])

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const res = await fetch('/api/tools/material-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          postcode: postcode.trim().toUpperCase(),
          items: validItems.map(({ description, quantity, unit }) => ({ description, quantity, unit })),
        }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `Server error ${res.status}`)
      }

      const data = await res.json()
      setResults(data.rows)
      setWarnings(data.warnings || [])
    } catch (err) {
      if (err.name === 'AbortError') return
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleCancel() {
    abortRef.current?.abort()
    setLoading(false)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <span style={{ ...T.label, color: C.muted }}>Tools</span>
          <span style={{ color: C.border }}>›</span>
          <span style={{ ...T.label, color: C.green }}>Material Price Checker</span>
          <span style={{
            fontSize: '0.5rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            background: C.amberBg, color: C.amber, borderRadius: '3px', padding: '0.1rem 0.45rem',
            border: '1px solid #FDE68A', marginLeft: '0.25rem',
          }}>Beta</span>
        </div>

        <h1 style={{ ...T.h1, marginBottom: '0.5rem' }}>Material Price Checker</h1>
        <p style={{ ...T.body, maxWidth: 560 }}>
          Enter your UK postcode and materials list. We'll search Screwfix, Toolstation, Travis Perkins, and Wickes in real time and return prices, availability, and delivery estimates.
        </p>
      </div>

      {/* Input form */}
      <form onSubmit={handleSearch}>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px',
          padding: '1.5rem', marginBottom: '1.5rem',
        }}>
          {/* Postcode */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ ...T.label, display: 'block', marginBottom: '0.4rem' }}>UK Postcode</label>
            <input
              type="text"
              value={postcode}
              onChange={e => setPostcode(e.target.value)}
              onBlur={e => e.target.value && validatePostcode(e.target.value)}
              placeholder="e.g. SW1A 1AA"
              maxLength={8}
              style={{
                width: 200, padding: '0.5rem 0.75rem', fontSize: '0.8rem',
                border: `1px solid ${postcodeError ? C.red : C.border}`, borderRadius: '5px',
                background: C.bg, color: C.text, outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {postcodeError && (
              <div style={{ ...T.small, color: C.red, marginTop: '0.3rem' }}>{postcodeError}</div>
            )}
          </div>

          {/* Items table */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ ...T.label, display: 'block', marginBottom: '0.5rem' }}>Materials</label>

            {items.map((item, idx) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem',
              }}>
                <input
                  type="text"
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                  placeholder={`Item ${idx + 1}, e.g. plasterboard 12.5mm`}
                  maxLength={200}
                  style={{
                    flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.78rem',
                    border: `1px solid ${C.border}`, borderRadius: '5px',
                    background: C.bg, color: C.text, fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 1)}
                  min={0.01}
                  max={10000}
                  step={0.01}
                  style={{
                    width: 72, padding: '0.5rem 0.5rem', fontSize: '0.78rem', textAlign: 'right',
                    border: `1px solid ${C.border}`, borderRadius: '5px',
                    background: C.bg, color: C.text, fontFamily: 'inherit', outline: 'none',
                  }}
                />
                <select
                  value={item.unit}
                  onChange={e => updateItem(item.id, 'unit', e.target.value)}
                  style={{
                    padding: '0.5rem 0.4rem', fontSize: '0.78rem',
                    border: `1px solid ${C.border}`, borderRadius: '5px',
                    background: C.bg, color: C.text, fontFamily: 'inherit', outline: 'none', cursor: 'pointer',
                  }}
                >
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  disabled={items.length <= 1}
                  style={{
                    width: 28, height: 28, borderRadius: '4px', border: `1px solid ${C.border}`,
                    background: C.bg, color: items.length <= 1 ? C.subtle : C.muted,
                    cursor: items.length <= 1 ? 'default' : 'pointer', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}
                  aria-label="Remove item"
                >×</button>
              </div>
            ))}

            {items.length < 10 && (
              <button
                type="button"
                onClick={addItem}
                style={{
                  marginTop: '0.25rem', padding: '0.35rem 0.75rem', fontSize: '0.72rem',
                  fontWeight: 600, border: `1px solid ${C.border}`, borderRadius: '5px',
                  background: C.bg, color: C.muted, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                + Add item
              </button>
            )}
          </div>

          {/* Search button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
            {loading && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '0.55rem 1rem', fontSize: '0.78rem', fontWeight: 500,
                  border: `1px solid ${C.border}`, borderRadius: '5px',
                  background: C.bg, color: C.muted, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Cancel</button>
            )}
            <button
              type="submit"
              disabled={!canSearch}
              style={{
                padding: '0.55rem 1.5rem', fontSize: '0.78rem', fontWeight: 600,
                border: 'none', borderRadius: '5px',
                background: canSearch ? '#111111' : C.border,
                color: canSearch ? '#ffffff' : C.subtle,
                cursor: canSearch ? 'pointer' : 'default', fontFamily: 'inherit',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Searching…' : 'Search Prices →'}
            </button>
          </div>
        </div>
      </form>

      {/* Loading state */}
      {loading && (
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px',
          padding: '2.5rem', textAlign: 'center',
        }}>
          <div style={{ ...T.small, marginBottom: '1rem' }}>Checking live prices across 4 suppliers…</div>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {SUPPLIERS.map(s => (
              <span key={s} style={{
                padding: '0.3rem 0.75rem', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600,
                background: C.greenLight, color: C.green, border: `1px solid ${C.greenBorder}`,
                animation: 'pulse 1.5s ease-in-out infinite',
              }}>{s}</span>
            ))}
          </div>
          <div style={{ ...T.small, marginTop: '1rem' }}>
            This usually takes 30–90 seconds. Please wait.
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div style={{
          background: C.redBg, border: `1px solid #FECACA`, borderRadius: '8px',
          padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '0.78rem', color: C.red }}>{error}</span>
          <button
            onClick={() => setError(null)}
            style={{ fontSize: '0.72rem', color: C.red, background: 'none', border: 'none', cursor: 'pointer' }}
          >Dismiss</button>
        </div>
      )}

      {/* Warnings */}
      {!loading && warnings.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          {warnings.map((w, i) => (
            <div key={i} style={{
              background: C.amberBg, border: '1px solid #FDE68A', borderRadius: '5px',
              padding: '0.5rem 0.75rem', fontSize: '0.72rem', color: C.amber, marginBottom: '0.4rem',
            }}>⚠ {w}</div>
          ))}
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div>
          {/* Results table */}
          <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                  <th style={{ ...cellStyle, textAlign: 'left', minWidth: 180, paddingLeft: '0.75rem' }}>Material</th>
                  <th style={{ ...cellStyle, width: 55 }}>Qty</th>
                  <th style={{ ...cellStyle, width: 55 }}>Unit</th>
                  {SUPPLIERS.map(s => (
                    <th key={s} style={{ ...cellStyle, minWidth: 130, color: C.text }}>{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, ri) => {
                  const best = cheapestSupplier(row)
                  return (
                    <tr key={ri} style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                      <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '0.75rem', fontWeight: 500, color: C.text }}>
                        {row.description}
                      </td>
                      <td style={{ ...cellStyle, color: C.muted }}>{row.quantity}</td>
                      <td style={{ ...cellStyle, color: C.muted }}>{row.unit}</td>
                      {SUPPLIERS.map(s => {
                        const r = row.results?.[s]
                        const isBest = s === best && r?.price_per_unit != null
                        return (
                          <td key={s} style={{
                            ...cellStyle,
                            background: isBest ? C.greenBg : 'transparent',
                            border: isBest ? `1px solid ${C.greenBorder}` : undefined,
                            borderRadius: isBest ? '4px' : undefined,
                            padding: '0.5rem 0.6rem',
                          }}>
                            {r?.error && !r?.price_per_unit ? (
                              <span style={{ color: C.subtle, fontSize: '0.65rem' }}>
                                {r.error === 'blocked' ? 'Unavailable' : r.error === 'no_results' ? 'Not found' : r.error === 'timeout' ? 'Timed out' : 'Error'}
                              </span>
                            ) : r?.price_per_unit != null ? (
                              <div>
                                <div style={{ fontWeight: 600, color: isBest ? C.green : C.text }}>
                                  {fmt(r.price_per_unit)}<span style={{ fontWeight: 400, color: C.muted, fontSize: '0.65rem' }}>/{row.unit === 'units' ? 'unit' : row.unit}</span>
                                </div>
                                <div style={{ color: C.muted, fontSize: '0.68rem' }}>
                                  Total: {fmt(r.total_price)}
                                </div>
                                <div style={{ marginTop: '0.2rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                  <AvailBadge text={r.availability} />
                                  {r.delivery_days && r.delivery_days !== 'unknown' && (
                                    <span style={{ color: C.subtle, fontSize: '0.62rem' }}>{r.delivery_days}</span>
                                  )}
                                  {r.product_url && (
                                    <a
                                      href={r.product_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ fontSize: '0.62rem', color: C.accent, textDecoration: 'none' }}
                                    >View →</a>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <span style={{ color: C.subtle, fontSize: '0.65rem' }}>—</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Basket summary */}
          <BasketSummary results={results} />

          {/* Disclaimer */}
          <p style={{ ...T.small, marginTop: '1.5rem', paddingTop: '1rem', borderTop: `1px solid ${C.borderLight}` }}>
            Prices are scraped in real time from supplier websites and may differ from final checkout prices.
            Delivery costs and availability may vary by postcode. Always verify before purchasing.
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
        input:focus, select:focus { border-color: #2563EB !important; box-shadow: 0 0 0 2px rgba(37,99,235,0.08); }
      `}</style>
    </div>
  )
}

// ─── Basket Summary ───────────────────────────────────────────────────────────
function BasketSummary({ results }) {
  const totals = basketTotals(results)
  const best = cheapestBasket(totals)
  const anyPrices = totals.some(t => t.total > 0)
  if (!anyPrices) return null

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '1.25rem',
    }}>
      <div style={{ ...T.label, marginBottom: '0.75rem' }}>Basket Summary</div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {totals.map(({ supplier, total, complete }) => {
          const isBest = best && supplier === best.supplier
          return (
            <div key={supplier} style={{
              flex: '1 1 140px', padding: '0.75rem', borderRadius: '6px',
              background: isBest ? C.greenBg : C.bg,
              border: `1px solid ${isBest ? C.greenBorder : C.border}`,
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, color: isBest ? C.green : C.muted, marginBottom: '0.3rem' }}>
                {supplier}{isBest && ' ✓'}
              </div>
              {total > 0 ? (
                <>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: isBest ? C.green : C.text }}>
                    £{total.toFixed(2)}
                  </div>
                  {!complete && (
                    <div style={{ fontSize: '0.62rem', color: C.amber, marginTop: '0.2rem' }}>
                      Partial — some items not found
                    </div>
                  )}
                </>
              ) : (
                <div style={{ fontSize: '0.72rem', color: C.subtle }}>No prices</div>
              )}
            </div>
          )
        })}
      </div>
      {best && (
        <div style={{ ...T.small, marginTop: '0.75rem', color: C.green, fontWeight: 500 }}>
          Cheapest full basket: {best.supplier} at £{best.total.toFixed(2)}
        </div>
      )}
    </div>
  )
}

const cellStyle = {
  padding: '0.6rem 0.5rem',
  textAlign: 'center',
  verticalAlign: 'top',
  fontSize: '0.75rem',
  color: C.muted,
  fontWeight: 500,
}
