import ServicePage from '../../components/ServicePage'

export default function Onboarding() {
  return (
    <ServicePage
      label="BIM Services · Onboarding"
      title="BIM Onboarding"
      tagline="Bring your team into the project BIM environment from day one — with the tools, standards, and working practice to deliver compliantly from the first model issue."
      serviceName="Onboarding"
      overview="Onboarding is the mobilisation phase where the team setup, access control, naming rules, exchange templates, and training are put in place so every party works to the same information standard from day one. The Common Data Environment is the controlled digital platform used to store, share, review, and approve project information, drawings, models, and documents in a structured way. It is critical that onboarding covers the client, consultants, main contractor, and contractors, because every team member must understand the project-specific standards and procedures. We do not rely on generic standards alone; instead, we tailor the workflow to the project so the BIM process reflects the actual delivery requirements rather than a one-size-fits-all approach. This stage is often missed or rushed, but without proper onboarding the CDE quickly becomes inconsistent and project control starts to break down."
      deliveryPoints={[
        { title: 'Built around the project, not generic', body: 'Every onboarding session is designed for the specific CDE, standards, and software stack in use on this project — not a generalised BIM training course.' },
        { title: 'Reduces coordination failures', body: 'When every discipline enters the project environment with the same working practice, naming convention, and model organisation, coordination failures at each model exchange are substantially reduced.' },
        { title: 'Faster mobilisation', body: 'A structured onboarding session means the team produces compliant model outputs from the first issue, not after a cycle of corrections and resubmissions.' },
      ]}
      expectStages={[
        { stage: 'Environment review', desc: 'We review the CDE configuration, folder structure, naming conventions, and model template before the session — so the onboarding is built around what actually exists.' },
        { stage: 'Team-specific session', desc: 'A working session is delivered for each discipline — architects, engineers, contractors — covering CDE access, model organisation, naming conventions, and information delivery requirements specific to their role.' },
        { stage: 'Reference materials issued', desc: 'Each discipline receives a project-specific reference document covering their BIM responsibilities, naming rules, and delivery milestones — formatted for daily use, not an archive.' },
        { stage: 'Follow-up support', desc: 'We remain available in the weeks after onboarding to answer questions, review early model submissions, and resolve any compliance gaps before they compound.' },
      ]}
      deliverables={[
        'Project BIM onboarding session (per discipline)', 'Discipline-specific reference guide', 'CDE access and folder structure guide', 'Naming convention quick reference', 'First-issue model review', 'Compliance checklist',
      ]}
    />
  )
}
