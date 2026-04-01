import ServicePage from '../../components/ServicePage'

export default function PostAppointment() {
  return (
    <ServicePage
      label="BIM Services · Post-appointment"
      title="Post-Appointment BIM"
      tagline="Translate the pre-contract framework into a live project standard. The post-appointment BEP is the operating document for the entire design and delivery team."
      serviceName="Post-appointment BIM"
      overview="Post-appointment BIM starts after appointment and turns the strategy into a working delivery system through the BEP, MIDP/TIDP workflows, responsibility matrix, CDE protocol, and QA plan. This is the stage where the client requests a delivery plan from the consultants that aligns with the delivery containers and project programme, ensuring all dependencies are clearly defined before design progresses. It is essential that consultants set out all information dependencies in the correct order, because if this is done too late or incorrectly, design delays can follow and these delays will inevitably affect the construction phase. At this stage, BIM becomes operational rather than theoretical, and the consultant must make sure the delivery logic supports smooth design progression without failure or avoidable delay."
      deliveryPoints={[
        { title: 'Aligns the full supply chain', body: 'Every consultant and contractor signs off on the same model responsibilities, deliverable formats, and milestones. Disputes over scope become substantially less frequent.' },
        { title: 'Establishes the model environment', body: 'Model breakdown structure, zone assignments, and level of detail are set before design work begins — not renegotiated at each stage gate.' },
        { title: 'Maintains compliance throughout delivery', body: 'The post-appointment BEP is a living document. We update it at each RIBA stage to reflect design changes, team changes, and scope evolution.' },
      ]}
      expectStages={[
        { stage: 'Supply chain review', desc: 'We review the capabilities and software environments of each appointed consultant and contractor. Integration gaps are identified and resolved before design begins.' },
        { stage: 'Post-contract BEP authored', desc: 'The detailed BIM Execution Plan is written — including model breakdown, zone structure, MIDP, TIDP, and information delivery schedule for each RIBA stage.' },
        { stage: 'MIDP and TIDP issued', desc: 'The Master Information Delivery Plan and Task Information Delivery Plans are issued to the full team. Every discipline knows what they must deliver, when, and in what format.' },
        { stage: 'Ongoing compliance support', desc: 'We remain available throughout delivery to review model submissions, resolve coordination issues, and update the BEP as the project evolves.' },
      ]}
      deliverables={[
        'Post-contract BEP', 'Master Information Delivery Plan (MIDP)', 'Task Information Delivery Plans (TIDPs)', 'Model Breakdown Structure', 'Zone and Level assignments', 'Naming convention schedule', 'Software integration register',
      ]}
    />
  )
}
