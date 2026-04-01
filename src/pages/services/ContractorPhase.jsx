import ServicePage from '../../components/ServicePage'

export default function ContractorPhase() {
  return (
    <ServicePage
      label="BIM Services · Contractor Phase"
      title="Contractor Phase BIM"
      tagline="Maintain BIM standards through the construction phase — clash-free coordination, information delivery on time, and a handover dataset that actually reflects what was built."
      serviceName="Contractor Phase BIM"
      overview="Contractor phase BIM focuses on coordination models, clash reports, 4D sequencing, constructability reviews, and site data workflows, helping contractors turn design information into buildable, sequence-aware delivery information. This stage is frequently underdeveloped on real projects, especially when the model is treated as a design output rather than a production and construction management tool, which is why hands-on BIM management is critical. We also advise clients to appoint a BIM specialist from the client side, such as within the main contractor or developer team, to oversee all design stages and make sure the work is carried out correctly. That role should be able to validate models and documentation, review clashes between models, and check available approved documentation from local authorities to confirm that project standards are being met. In our experience, the most valuable BIM specialists are those with a project management, site management, or site technical design coordination background, because they understand construction constraints, constructability, delivery processes, and local authority and planning requirements. This helps reduce rework during pre-construction and improves coordination before issues reach site."
      deliveryPoints={[
        { title: 'Clash detection before construction', body: 'The construction model is coordinated before information is released for construction. Clashes visible in the model are resolved before they become programme delays on site.' },
        { title: 'Shop drawing and fabrication integration', body: 'Structural steel, MEP fabrication, facade, and fit-out models are integrated into the coordination environment. Deviations from design intent are identified before manufacture.' },
        { title: 'Progressive as-built record', body: 'The as-built model is built progressively through construction — not assembled retrospectively. The handover dataset is accurate because it reflects actual site conditions, captured at each stage.' },
      ]}
      expectStages={[
        { stage: 'Construction model audit', desc: 'The inherited design models are reviewed and restructured for construction-phase coordination. Missing information, non-compliant naming, and structural gaps are resolved before site mobilisation.' },
        { stage: 'Coordination model setup', desc: 'A federated coordination model is configured in Navisworks or equivalent — drawing in the structural, MEP, architectural, and specialist models for clash detection and programme review.' },
        { stage: 'Information delivery management', desc: 'Information release is managed against the construction programme. Every drawing and model package is tracked against the MIDP. Late or non-compliant submissions are flagged before they affect the programme.' },
        { stage: 'Progressive as-built capture', desc: 'As-built conditions are recorded progressively through construction. Point cloud capture, updated models, and site photography are integrated into the live record at each key stage.' },
        { stage: 'Handover package', desc: 'The completed as-built model, COBie dataset, and O&M documentation are assembled for handover — structured and verified before the final account.' },
      ]}
      deliverables={[
        'Construction model audit report', 'Federated coordination model', 'Clash detection report (per issue)', 'Information delivery tracker', 'Construction phase BEP update', 'Progressive as-built model', 'Handover coordination package',
      ]}
    />
  )
}
