import SurveyPage from '../../components/SurveyPage'

export default function AsBuilt() {
  return (
    <SurveyPage
      title="As-Built Surveys"
      tagline="An accurate digital record of what is actually on site — essential for existing buildings, retrofit projects, and any work where reliable site conditions are needed before design or construction progresses."
      serviceName="As-Built Survey"
      overview="As-built surveys provide an accurate digital record of what is actually on site, rather than what was originally designed. This is essential for existing buildings, retrofit projects, and any work where reliable site conditions are needed before design or construction progresses. Design based on inaccurate or assumed site conditions is one of the leading causes of abortive work and late-stage coordination failures on construction projects. An as-built survey removes those assumptions and gives the design team a verified baseline from which to work — reducing rework, improving coordination, and providing a reliable record for future maintenance or change."
      deliveryPoints={[
        { title: 'Removes design assumptions', body: 'Design based on assumed site conditions frequently leads to abortive work when reality does not match drawings. An as-built survey replaces assumptions with verified data before design progresses.' },
        { title: 'Supports retrofit and refurbishment', body: 'Retrofit and refurbishment projects depend on accurate knowledge of existing conditions. As-built data allows services coordination, structural analysis, and façade design to proceed from a reliable baseline.' },
        { title: 'Record for future works', body: 'A verified as-built dataset is a long-term asset for the building owner — available for future maintenance, refurbishment, extension, or regulatory inspection without the need for re-survey.' },
      ]}
      expectStages={[
        { stage: 'Brief and access review', desc: 'The scope of the as-built survey is agreed — areas to capture, required accuracy, deliverable format, and coordinate system. Access arrangements and any site-specific constraints are confirmed in advance.' },
        { stage: 'Site capture', desc: 'The existing building or structure is scanned systematically, ensuring complete coverage of all areas within scope. Structural elements, services, floor levels, and façade geometry are captured as required.' },
        { stage: 'Registration, QA, and modelling', desc: 'The scan dataset is registered, quality-checked, and used to produce the agreed deliverables — point cloud, BIM model, or measured drawings — verified against the project accuracy requirements.' },
        { stage: 'Delivery and coordination handoff', desc: 'Final deliverables are issued to the design team or project CDE, formatted for direct use in the design environment. We confirm the handoff is usable and answer any questions before closing the commission.' },
      ]}
      deliverables={[
        'Registered as-built point cloud', 'BIM model (LOD 300, Revit)', 'As-built floor plans, sections, and elevations', 'Services and structure capture (where in scope)', 'Accuracy and methodology statement', 'Site control record',
      ]}
    />
  )
}
