import SurveyPage from '../../components/SurveyPage'

export default function ScanToBIM() {
  return (
    <SurveyPage
      title="Scan to BIM"
      tagline="Fast and accurate digital survey for heritage buildings, existing assets, and as-built environments. Competitive pricing, worldwide support, and scan accuracy reaching 1–2 mm where site conditions allow."
      serviceName="Scan to BIM"
      overview="Scan to BIM is our fast and accurate digital survey service for heritage buildings, existing assets, and as-built environments. It covers Heritage Surveys, Post-Processing, and As-Built Surveys, giving clients a reliable starting point for renovation, retrofit, coordination, and record documentation. We deliver quick turnaround, worldwide support, and competitive pricing, with scan accuracy reaching 1–2 mm where site conditions and project requirements allow."
      deliveryPoints={[
        { title: 'Accurate existing conditions', body: 'Scan data captures what is actually on site — not what was originally drawn. This removes assumptions from design and prevents abortive work caused by geometry discrepancies.' },
        { title: 'BIM-ready output', body: 'Registered and cleaned point clouds are prepared for direct use in Revit, AutoCAD, or coordination environments. No additional processing required before modelling begins.' },
        { title: 'Fast turnaround globally', body: 'We support projects worldwide with competitive pricing and quick delivery. Full-site capture is typically completed in a single session, with processed data available within days.' },
      ]}
      expectStages={[
        { stage: 'Scope and access review', desc: 'We review the project requirements, site access conditions, required accuracy, and deliverable format before mobilisation. Any site-specific considerations are confirmed in advance.' },
        { stage: 'On-site capture', desc: 'The site is scanned using calibrated equipment. Scan stations are positioned to ensure complete coverage — including difficult access areas, plant rooms, and irregular geometry.' },
        { stage: 'Registration and QA', desc: 'Individual scan positions are registered into a single coordinated point cloud. Accuracy is checked against control points and the registered dataset is quality reviewed before delivery.' },
        { stage: 'Deliverable preparation', desc: 'The registered point cloud is cleaned, formatted, and prepared for the agreed output — BIM model, as-built documentation, or record archive — and issued to the project CDE or directly to the client.' },
      ]}
      deliverables={[
        'Registered point cloud (E57 / LAS / RCP)', 'BIM model (LOD 300–400, Revit)', 'As-built floor plans and sections', 'Site control report', 'Accuracy statement', 'Project scan archive',
      ]}
    />
  )
}
