import ServicePage from '../../components/ServicePage'

export default function DigitalTwinReadiness() {
  return (
    <ServicePage
      label="BIM Services · Future-proofing"
      title="Digital Twin Readiness"
      tagline="Structure every BIM deliverable so that the path to a live digital twin is direct — not a rebuild from scratch after handover."
      serviceName="Digital Twin Readiness"
      overview="Digital twin readiness means structuring the operational data model, defining lifecycle data governance, and planning the integration concept so the BIM model can evolve into a live asset information environment after handover. We support teams in creating a project-specific digital twin structure that reflects the client's operational needs rather than offering a generic template. This is especially valuable for buildings with significant MEP and HVAC systems, where ongoing monitoring, maintenance, and change management are critical. The benefit of digital twinning is that it can help reduce operational cost, improve planned maintenance, reduce downtime, support service optimisation, and allow services to be adapted more effectively to the owner's needs while aligning with sustainability targets. Many projects talk about digital twins, but in practice they do not define the information structure early enough, so the result becomes a disconnected visual model instead of a genuinely useful operational system. The digital twin also needs to work with FM systems and be maintained through them so it remains a live and useful operational tool rather than becoming outdated after handover."
      deliveryPoints={[
        { title: 'Sensor-ready attribution', body: 'Every asset is attributed with the data required for live sensor binding — unique identifiers, system references, and location data that connects directly to BMS, IoT, and CAFM platforms.' },
        { title: 'Open standards output', body: 'Models are structured for open-format export — not locked to a single platform vendor. Your digital twin is portable and future-proof across Autodesk Tandem, Bentley iTwin, or custom IoT integrations.' },
        { title: 'No rebuild after handover', body: 'The additional cost of retrofitting a model for digital twin capability after handover typically exceeds the cost of configuring it correctly at design stage. Digital twin readiness is an investment that pays for itself.' },
      ]}
      expectStages={[
        { stage: 'Digital twin requirements defined', desc: 'We establish what operational systems the twin must connect to — BMS, CAFM, IoT sensors, energy management platforms — and map those requirements back to BIM model attributes.' },
        { stage: 'Classification and attribute configuration', desc: 'Revit models are configured with the classification, unique identifiers, and attribute structure required for live data binding. This is done at design stage, not retrofitted at handover.' },
        { stage: 'Platform selection support', desc: 'We advise on digital twin platform selection — Autodesk Tandem, Bentley iTwin, or custom integrations — and configure model output to connect without data transformation.' },
        { stage: 'Handover and connection', desc: 'The handover model is structured and verified for digital twin connection. We support the initial data ingestion and sensor binding to confirm the live connection is stable.' },
      ]}
      deliverables={[
        'Digital twin requirements schedule', 'Asset classification register', 'Unique identifier (GUIDs) schedule', 'BMS/IoT integration map', 'COBie-attributed handover model', 'Platform connection verification', 'Digital twin readiness report',
      ]}
    />
  )
}
