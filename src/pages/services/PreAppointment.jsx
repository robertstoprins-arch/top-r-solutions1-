import ServicePage from '../../components/ServicePage'

export default function PreAppointment() {
  return (
    <ServicePage
      label="BIM Services · Pre-appointment"
      title="Pre-Appointment BIM"
      tagline="Define scope, set standards, and protect your margin before a single appointment is issued. Pre-appointment BIM is the most commercially leveraged stage in the project lifecycle."
      serviceName="Pre-appointment BIM"
      overview="Pre-appointment BIM covers the early definition stage where the client's information needs, BIM strategy, EIR, feasibility, standards review, and digital delivery roadmap are established. At this stage, the project boundaries, coordination strategy, and responsibilities should be defined and agreed by the consultant, so the delivery team knows exactly what is required from the outset. This stage matters because it reduces scope drift, avoids duplicated effort, and prevents the team from modelling before the information requirements are properly defined. When this is not done well, the consultancy often has to revisit assumptions later, which can increase fees because the boundaries, deliverables, and approval routes were never properly set."
      deliveryPoints={[
        { title: 'Protects margin from day one', body: 'Scope defined before appointment means consultants cannot expand it unilaterally. Every deliverable is tied to a requirement before costs are committed.' },
        { title: 'Eliminates scope drift', body: 'A pre-contract BEP aligns the full supply chain before mobilisation. Ambiguity is resolved in document, not on site.' },
        { title: 'Reduces variation claims', body: 'When information requirements are explicit before appointment, variation claims tied to BIM scope are substantially reduced across the project lifecycle.' },
      ]}
      expectStages={[
        { stage: 'EIR Review', desc: "We review the Employer's Information Requirements — or draft them from scratch if none exist. Every gap is identified and resolved before consultants are invited." },
        { stage: 'Pre-contract BEP authored', desc: 'A pre-contract BIM Execution Plan is written and issued as part of the appointment package. This defines deliverable formats, model responsibilities, and information delivery milestones.' },
        { stage: 'Responsibility matrix issued', desc: 'Every discipline is assigned clear model and data responsibilities. There is no ambiguity about who delivers what, in what format, and to what standard.' },
        { stage: 'Appointment-ready package', desc: 'The full pre-appointment BIM package — EIR, BEP, responsibility matrix — is issued to support the appointment process. Ready for tender or direct appointment.' },
      ]}
      deliverables={[
        "Employer's Information Requirements (EIR)", 'Pre-contract BEP', 'Responsibility Matrix', 'Information Delivery Plan', 'BIM standards brief', 'Software and format requirements schedule',
      ]}
    />
  )
}
