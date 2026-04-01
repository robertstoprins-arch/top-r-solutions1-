import ArticlePage from '../../components/ArticlePage'

export default function Iso19650Guide() {
  return (
    <ArticlePage
      category="BIM Standards"
      title="ISO 19650 in Practice: What It Actually Means for Your Project"
      readTime="7 min read"
      intro="ISO 19650 is widely referenced on BIM briefs, tender documents, and employer requirements. Yet on most projects, the standard is cited without any clear explanation of which parts apply, what decisions it drives, and what it actually changes in how the project team works. This guide cuts through the surface-level referencing and explains what ISO 19650 compliance looks like on a live UK construction project."
      sections={[
        {
          heading: 'What ISO 19650 actually covers',
          body: [
            'ISO 19650 is a two-part international standard for managing information across the lifecycle of a built asset. Part 2 covers design and construction. Part 3 covers the operational phase. The UK BIM Framework aligns to both, and the vast majority of UK projects invoking "ISO 19650 compliance" are referring specifically to Part 2.',
            'At its core, the standard defines a process for how information should be requested, produced, exchanged, and accepted between appointing parties (clients and employers) and appointed parties (consultants, contractors, and their supply chains). It does not specify software, model formats, or delivery tools — it specifies the management process around them.',
          ],
        },
        {
          heading: 'The Employer\'s Information Requirements (EIR)',
          body: [
            'The EIR is the document that initiates the ISO 19650 information management process. It is authored by or on behalf of the employer before any appointments are made. It defines what information the employer needs, when, in what format, to what level of detail, and for what purpose.',
            'In practice, most EIRs on UK projects are either missing entirely, copied from a template without project-specific adaptation, or issued late — after consultants have already begun producing information in their own formats. Each of these scenarios creates downstream problems: clashing model structures, information that cannot be exchanged, deliverables that do not meet the employer\'s actual needs, and disputes about scope at handover.',
          ],
          bullets: [
            'A well-written EIR defines the plain language information requirements (PLIRs) for the project',
            'It sets the exchange information requirements (EIRs) — what gets delivered and when',
            'It specifies the project information standard: naming conventions, classification, and model structure',
            'It defines the roles responsible for information management across the supply chain',
          ],
        },
        {
          heading: 'The BIM Execution Plan (BEP)',
          body: [
            'The BEP is the appointed party\'s formal response to the EIR. It explains how the consultant or contractor will meet the employer\'s information requirements — what tools they will use, how they will structure models, how information will be shared, who is responsible for what, and how compliance will be demonstrated.',
            'There are two types: the pre-contract BEP, prepared during tender and confirming the bidder\'s approach before appointment; and the post-contract BEP, developed after appointment and containing the full project-specific delivery plan. A pre-contract BEP that is not reviewed and updated at post-contract stage is one of the most common sources of coordination failure on complex projects.',
          ],
        },
        {
          heading: 'Information management roles',
          body: [
            'ISO 19650 introduces formal information management roles that do not map neatly onto traditional project roles. The task information manager is responsible for managing information production within a single appointed party. The information manager — often held by the lead consultant or a specialist BIM consultant — is responsible for overseeing the exchange of information across the whole project.',
            'On most UK projects, these roles are either unassigned, informally absorbed into existing roles, or held by someone without the time or mandate to perform them properly. Clarifying role assignment early is one of the most commercially important actions a client can take before appointment.',
          ],
        },
        {
          heading: 'What ISO 19650 does not do',
          body: [
            'It does not guarantee model quality. It does not prevent coordination clashes. It does not ensure the information produced is useful for the employer\'s operational needs. Compliance with the process standard is a framework — the quality of the output within that framework depends on the team, the brief, and the project leadership.',
            'The standard works best when the EIR is specific, the BEP is genuinely reviewed against the EIR, and there is an information manager with enough authority and time to enforce the agreed process across the supply chain. Without those three conditions, ISO 19650 compliance can become a documentation exercise that adds overhead without improving delivery.',
          ],
        },
        {
          heading: 'When to invoke ISO 19650',
          body: [
            'Not every project needs full ISO 19650 implementation. For straightforward projects, a proportionate information management process — clear deliverables, agreed formats, and a basic naming convention — will achieve better outcomes than a full standards framework that the team does not have the capacity to implement properly.',
            'ISO 19650 adds the most value on complex multi-consultant, multi-contractor projects where information flows across many boundaries, and on projects where the employer has specific operational data requirements at handover. If you are unsure whether your project requires full implementation, a short scoping exercise before the EIR is drafted will clarify the appropriate level of rigour.',
          ],
        },
      ]}
      relatedServices={[
        { path: '/services/pre-appointment', label: 'Pre-Appointment BIM' },
        { path: '/services/onboarding', label: 'Onboarding / ISO 19650' },
        { path: '/services/cobie-handover', label: 'COBie & Handover' },
      ]}
    />
  )
}
