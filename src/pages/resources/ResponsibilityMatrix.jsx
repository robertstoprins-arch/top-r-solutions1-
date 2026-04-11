import { C, T } from '../../tokens'
import { Link } from 'react-router-dom'

export default function ResponsibilityMatrix() {
  return (
    <div style={{ marginLeft: C.sidebarW, fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Hero */}
      <section style={{ padding: '4.5rem 2rem 3.5rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ ...T.label, fontSize: '0.58rem', background: C.accentBg, color: C.accent, padding: '0.2rem 0.6rem', borderRadius: '4px', border: `1px solid rgba(37,99,235,0.2)` }}>Pre-Appointment BIM</span>
            <span style={{ fontSize: '0.65rem', color: C.subtle }}>6 min read</span>
          </div>
          <h1 style={{ ...T.h1, fontSize: '1.9rem', marginBottom: '1rem', lineHeight: 1.2 }}>
            The Responsibility Matrix: How Defined Roles Eliminate Design Gaps Before They Form
          </h1>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            Most design gaps don't appear because consultants made mistakes. They appear because no one agreed in advance who was responsible for resolving the interface between their work and someone else's. The responsibility matrix is the document that prevents that ambiguity — and on projects where it is done properly, it fundamentally changes how the team coordinates.
          </p>
        </div>
      </section>

      {/* Article body */}
      <section style={{ padding: '3rem 2rem 4rem', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Insight callout */}
          <div style={{ background: C.borderLight, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.text}`, borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>The core insight</div>
            <p style={{ fontSize: '0.84rem', color: C.text, lineHeight: 1.75, fontWeight: 500 }}>
              Design gaps are almost never caused by missing information. They are caused by assumed responsibility — each consultant believing someone else owns the interface. A responsibility matrix makes that assumption explicit and eliminates it before the project starts.
            </p>
          </div>

          <h2 style={{ ...T.h2, fontSize: '1.05rem' }}>What a responsibility matrix actually defines</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            At its simplest, a responsibility matrix maps every design element, information deliverable, and coordination task to a specific consultant or team. But its value is not in the mapping itself — it's in the conversations the matrix forces. When a responsibility matrix is produced at pre-appointment stage, every interface between disciplines has to be explicitly agreed before anyone starts drawing. Structural/architectural interfaces, M&E coordination zones, facade and structure overlaps, ground floor slab tolerances — all of these have to be owned by someone, and that owner has to agree.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            The result is that when the project reaches Stage 3 or Stage 4, the team is not discovering who should have resolved the duct route through the structural beam — they resolved it in principle before appointment, and the detail follows a path that's already been agreed.
          </p>

          <h2 style={{ ...T.h2, fontSize: '1.05rem' }}>Dependencies: the overlooked half of the matrix</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            Responsibility is one half of the matrix. The other half — equally important, much less frequently documented — is dependencies. Who needs what from whom, and when. An M&E engineer cannot complete a ceiling coordination drawing without confirmed structural depths. A facade consultant cannot issue tender drawings without confirmed floor-to-floor heights. A contractor cannot build a level slab without confirmed services routes below it.
          </p>

          {/* Insight callout 2 */}
          <div style={{ background: C.borderLight, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.text}`, borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>Why this matters for programme</div>
            <p style={{ fontSize: '0.84rem', color: C.text, lineHeight: 1.75, fontWeight: 500 }}>
              Every undocumented dependency is a potential programme risk. When a consultant waits for information they weren't formally expecting to need, the delay looks like a resourcing problem. It's actually an information management problem — one that the responsibility matrix prevents.
            </p>
          </div>

          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            When dependencies are mapped alongside responsibilities, the project team can sequence design development properly. Information flows in the right direction, at the right time, without bottlenecks forming at coordination milestones. Gaps, when they do occur, are visible immediately — because the matrix shows what was expected and who was waiting for it.
          </p>

          <h2 style={{ ...T.h2, fontSize: '1.05rem' }}>Pre-appointment vs post-appointment: why timing is everything</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            A responsibility matrix produced at pre-appointment stage sets the terms of engagement before consultants are hired. Scope is clear. Interfaces are agreed in principle. Consultants tender knowing exactly what is in their scope and what sits at boundaries. There are no scope queries at appointment that should have been resolved at tender — because they were.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            Post-appointment, the matrix is developed further — updated to reflect the actual team, the actual programme, and the specific delivery approach agreed in the BIM Execution Plan. It becomes a live project document, not a static checklist. It tracks who has confirmed responsibility, where interfaces remain open, and what dependencies are currently blocking progress.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            Projects that define responsibilities clearly at pre-appointment stage consistently outperform those that attempt to resolve the same questions mid-design. Not because the consultants are better — but because the information management structure gives them a framework that prevents the ambiguities from forming in the first place.
          </p>

          <h2 style={{ ...T.h2, fontSize: '1.05rem' }}>Eliminating rework at source</h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            Rework on construction projects is almost always traceable back to a gap, a missed dependency, or an unresolved interface that was never formally owned. The cost is real — design fees for revision, coordination time to resolve the clash, and in some cases, site instructions when the issue wasn't caught in the model.
          </p>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.85 }}>
            The responsibility matrix doesn't eliminate rework entirely — no document does. But it eliminates the category of rework that comes from assumption. When every interface has an owner and every dependency has a recipient, the gaps that remain are technical, not organisational. Those are solvable. The organisational ones — where no one is sure who should have resolved it — are the ones that compound.
          </p>

          {/* Final insight */}
          <div style={{ background: C.borderLight, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.text}`, borderRadius: '0 8px 8px 0', padding: '1.1rem 1.4rem' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: C.text, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>In practice</div>
            <p style={{ fontSize: '0.84rem', color: C.text, lineHeight: 1.75, fontWeight: 500 }}>
              At ToP-R, we produce the responsibility matrix as part of every pre-appointment BIM package. It is developed with the client, reviewed with the proposed consultant team, and built into the BEP as a live delivery tool — not filed away after appointment. For most projects, it is the single most valuable document we produce.
            </p>
          </div>

          <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/services/pre-appointment" style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, textDecoration: 'none', borderBottom: `1.5px solid ${C.text}`, paddingBottom: '1px' }}>
              Pre-Appointment BIM services →
            </Link>
            <Link to="/resources" style={{ fontSize: '0.78rem', color: C.muted, textDecoration: 'none' }}>
              ← Back to resources
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
