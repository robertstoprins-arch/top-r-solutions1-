import SurveyPage from '../../components/SurveyPage'

export default function PostProcessing() {
  return (
    <SurveyPage
      title="Post-Processing"
      tagline="Turning raw scan data into clean, usable deliverables — point cloud registration, cleaning, alignment, and preparation for BIM modelling or as-built documentation."
      serviceName="Post-Processing"
      overview="Post-processing turns raw scan data into clean, usable deliverables. This includes point cloud registration, cleaning, alignment, and preparation for BIM modelling or as-built documentation so the information is ready for design and project coordination. Raw scan data from site is rarely usable without processing — individual scan positions must be registered into a single coordinated dataset, noise and artefacts removed, and the output formatted for the receiving software environment. We provide post-processing as a standalone service for clients who have their own scanning capability but need reliable, production-ready outputs."
      deliveryPoints={[
        { title: 'Production-ready output', body: 'Cleaned and registered point clouds are formatted for direct import into Revit, AutoCAD, Navisworks, or coordination environments — with no additional preparation required before modelling begins.' },
        { title: 'Standalone service', body: 'Post-processing is available as a standalone service for clients who have their own scanning equipment but need reliable, quality-checked processing delivered on a project or batch basis.' },
        { title: 'Consistent quality control', body: 'Each dataset is checked for registration accuracy, coverage gaps, and noise before issue. The output is validated against the project brief and accuracy requirements before delivery.' },
      ]}
      expectStages={[
        { stage: 'Data receipt and review', desc: 'Raw scan files are received and reviewed for completeness, coverage, and quality. Any gaps or issues are identified and communicated before processing begins.' },
        { stage: 'Registration', desc: 'Individual scan positions are registered into a single coordinated point cloud using target-based or cloud-to-cloud registration methods. Registration accuracy is checked and documented.' },
        { stage: 'Cleaning and noise reduction', desc: 'The registered dataset is cleaned to remove scan artefacts, moving objects, redundant data, and noise. The result is a clean, coherent point cloud representing the captured environment.' },
        { stage: 'Format and issue', desc: 'The processed dataset is formatted for the agreed software environment — E57, LAS, RCP, or other — and issued with an accuracy statement and processing report.' },
      ]}
      deliverables={[
        'Registered point cloud (E57 / LAS / RCP)', 'Registration report', 'Accuracy statement', 'Noise-cleaned dataset', 'Software-ready formatted output', 'Processing methodology record',
      ]}
    />
  )
}
