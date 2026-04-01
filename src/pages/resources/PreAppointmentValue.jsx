import ArticlePage from '../../components/ArticlePage'

export default function PreAppointmentValue() {
  return (
    <ArticlePage
      category="Pre-Appointment BIM"
      title="Why Pre-Appointment BIM Saves More Than It Costs"
      readTime="6 min read"
      intro="The commercial argument for pre-appointment BIM investment is rarely made clearly. It tends to be presented as a compliance requirement or as a risk management exercise — important, but abstract. The practical case is more direct: decisions made before appointment have a disproportionate and measurable effect on fees, programme, and coordination quality throughout the project lifecycle."
      sections={[
        {
          heading: 'The cost multiplication principle',
          body: [
            'In construction project management, it is well established that the cost of resolving a problem increases with each phase it passes through. A scope ambiguity resolved at pre-appointment costs almost nothing — a conversation, a document revision, a clarified brief. The same ambiguity discovered at tender costs time and money to address through addenda and clarifications. Discovered post-appointment, it generates a variation. Discovered on site, it can generate a significant claim.',
            'BIM scope is no different. When the employer\'s information requirements are not defined before consultants are appointed, each discipline brings its own interpretation of what BIM means. The result is a project where models are structured differently, naming conventions are inconsistent, and coordination workflows have to be retrofitted at a point when the team has limited appetite to revisit their established processes.',
          ],
        },
        {
          heading: 'Scope drift and how it starts',
          body: [
            'Scope drift in BIM does not usually happen through deliberate decisions. It happens through accumulated small assumptions. Consultant A assumes they are responsible for the federated model. Consultant B assumes the project is not using a CDE. Consultant C has a standard LOD 300 deliverable package that does not include the data outputs the employer actually needs at handover.',
            'None of these assumptions are visible at appointment because no one asked the right questions before the contracts were signed. The drift becomes visible six months later, when the first model exchange produces incompatible files and the employer\'s project manager has to spend significant time arbitrating between consultants who each believe their approach is correct.',
          ],
          bullets: [
            'Inconsistent model origins are the most common source of clash detection failure',
            'Undefined file naming leads to duplicate files, version confusion, and missed submissions',
            'Absent information delivery milestones mean deliverables arrive on the consultant\'s schedule, not the employer\'s',
            'Unclear data requirements mean COBie and handover data is an afterthought, not a designed output',
          ],
        },
        {
          heading: 'What pre-appointment BIM actually involves',
          body: [
            'Pre-appointment BIM is not a large undertaking. For most projects, the deliverables are: a reviewed or drafted EIR, a pre-contract BEP template for tenderers to complete, a responsibility matrix allocating model and data responsibilities to each discipline, and a brief information delivery schedule aligned to the design programme.',
            'The time investment for a competent BIM consultant on a mid-size commercial project is typically two to five days. The output is a structured brief that removes the ambiguity from every BIM-related appointment and sets expectations that are enforceable in the contract.',
          ],
        },
        {
          heading: 'Where the fee saving comes from',
          body: [
            'Consultants price for uncertainty. When a tender package is unclear about BIM requirements, consultants either price conservatively to cover an unknown scope, or price competitively and assume the BIM deliverables will be negotiated down during delivery. Neither outcome serves the employer.',
            'A clear EIR and BEP template at tender stage allows consultants to price specifically and comparably. The client receives tenders that reflect the actual scope, not a risk premium on an undefined one. On a £50m commercial project, the fee difference between a clearly scoped BIM tender and a vague one can easily exceed the cost of the pre-appointment BIM work by a significant multiple.',
          ],
        },
        {
          heading: 'The variation argument',
          body: [
            'BIM-related variations follow a consistent pattern. The consultant claims the employer\'s information requirements were not clear at appointment. The employer claims the consultant\'s BEP committed them to a deliverable they are now refusing to produce. Both parties are often partially correct — the ambiguity was there from the start.',
            'When the EIR is clear and the pre-contract BEP has been reviewed against it before appointment, this argument is largely closed. The consultant\'s obligations are explicit and agreed. The employer\'s requirements are documented and proportionate. Disputes about scope still happen on complex projects — but the pre-appointment process removes the class of disputes that arise from genuine information gaps.',
          ],
        },
        {
          heading: 'The right time to start',
          body: [
            'Pre-appointment BIM support is most effective when it begins before the consultant longlist is finalised. At that stage, the brief can be shaped around the project\'s actual information needs, the EIR can be developed in parallel with the appointment strategy, and the BEP template can be built into the tender documents.',
            'Starting at tender stage is still valuable. Starting after appointment is possible but significantly less effective — the window for setting expectations on fee, scope, and deliverable standards has largely closed.',
          ],
        },
      ]}
      relatedServices={[
        { path: '/services/pre-appointment', label: 'Pre-Appointment BIM' },
        { path: '/services/post-appointment', label: 'Post-Appointment BIM' },
        { path: '/services/onboarding', label: 'Onboarding / ISO 19650' },
      ]}
    />
  )
}
