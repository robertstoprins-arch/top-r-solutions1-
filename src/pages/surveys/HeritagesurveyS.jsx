import SurveyPage from '../../components/SurveyPage'

export default function HeritageSurveys() {
  return (
    <SurveyPage
      title="Heritage Surveys"
      tagline="Careful capture of existing conditions where geometry is irregular, access is limited, or the building fabric is sensitive — creating dependable records for conservation, refurbishment, and informed design decisions."
      serviceName="Heritage Survey"
      overview="Heritage projects require careful capture of existing conditions, especially where geometry is irregular, access is limited, or the building fabric is sensitive. Our heritage scanning approach helps create dependable records for conservation, refurbishment, and informed design decisions. We work with listed buildings, historic structures, and protected environments where the survey must be non-invasive, methodical, and accurate — and where the resulting record needs to support planning submissions, conservation management, and future works over a long time horizon."
      deliveryPoints={[
        { title: 'Non-invasive capture', body: 'Laser scanning captures geometry without physical contact with the building fabric. There is no risk of damage to historic surfaces, decorative elements, or fragile structural components.' },
        { title: 'Reliable conservation record', body: 'A millimetre-accurate digital record provides a permanent baseline for the building — useful for planning submissions, conservation reports, insurance purposes, and future refurbishment design.' },
        { title: 'Supports complex geometry', body: 'Historic buildings frequently have irregular geometry, curved surfaces, and undocumented alterations that are impossible to capture reliably with traditional measured survey methods. Scan data handles this directly.' },
      ]}
      expectStages={[
        { stage: 'Pre-survey planning', desc: 'Access requirements, scan density, coordinate system, and deliverable format are agreed before mobilisation. Any specific conservation or access constraints are reviewed and addressed in the survey plan.' },
        { stage: 'On-site heritage capture', desc: 'The building is scanned systematically — exterior facades, interior spaces, vaulted areas, and structural details — with particular attention to areas of architectural significance or geometric complexity.' },
        { stage: 'Registration and accuracy check', desc: 'Scan stations are registered into a single coordinated dataset. Accuracy is validated against control points and the result is checked against the survey brief before processing begins.' },
        { stage: 'Record preparation and issue', desc: 'The final deliverable is prepared — high-resolution point cloud, BIM model, or annotated drawings — and issued in the agreed format for use in conservation reports, planning applications, or design development.' },
      ]}
      deliverables={[
        'High-resolution point cloud (E57 / RCP)', 'Heritage record drawings (plan, section, elevation)', 'BIM model (where required)', 'Georeferenced dataset', 'Accuracy and methodology statement', 'Permanent scan archive',
      ]}
    />
  )
}
