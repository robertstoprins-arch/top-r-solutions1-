import ServicePage from '../../components/ServicePage'

export default function CobieHandover() {
  return (
    <ServicePage
      label="BIM Services · Handover"
      title="COBie & Handover"
      tagline="Deliver a structured, FM-ready dataset at handover — not a collection of drawings and folders that facilities management cannot use."
      serviceName="COBie & Handover"
      overview="COBie and handover cover the asset data templates, validated equipment registers, and O&M-ready information packs required to transfer usable information into operations and maintenance. COBie is often missed, specified too late, or delivered inconsistently, which means asset data is incomplete or difficult to verify at handover and the client loses much of the operational value of BIM. We have supported projects and organisations with different levels of BIM maturity, and we know that handover can become messy and time-consuming when it is left until the end. That usually increases project management effort and can lead to uncontrolled cost growth. We always recommend that COBie and handover standards are planned from the pre-appointment stage and embedded in the BIM Execution Plan, so documentation is developed progressively as the project advances. This approach is far more efficient and significantly less expensive than trying to assemble everything during post-appointment, construction, or handover. COBie also needs to work alongside FM systems so the information can be maintained, updated, and used effectively after handover."
      deliveryPoints={[
        { title: 'Structured for FM from the model', body: 'Every asset is attributed with the data an FM team needs — manufacturer, model, warranty, maintenance schedule, serial number — extracted directly from the BIM model, not compiled from PDF schedules.' },
        { title: 'Validated before handover', body: 'COBie data is reviewed and validated against the EIR requirements before the handover meeting. Gaps are identified and resolved during construction, not at the final account.' },
        { title: 'Future-works ready', body: 'A properly structured COBie dataset means future refurbishment, extension, or maintenance works can begin from accurate asset data — not from a survey of what was actually installed.' },
      ]}
      expectStages={[
        { stage: 'COBie requirements defined', desc: "The Employer's Information Requirements are reviewed to establish exactly what COBie data is required, at what level of detail, and by when. A COBie attribution schedule is issued to the design team." },
        { stage: 'Model attribution configured', desc: 'Revit families and model elements are configured to hold COBie-required data. Attribution templates are issued to each discipline to ensure consistent data entry across the full model.' },
        { stage: 'Stage-gate validation', desc: 'COBie data is validated at each key milestone — RIBA 4 completion, practical completion, and handover. Gaps and errors are identified and resolved before they accumulate.' },
        { stage: 'Final COBie export and verification', desc: 'The complete COBie spreadsheet is exported, validated against the EIR, and issued as part of the handover package. Every asset, space, and system is accounted for.' },
      ]}
      deliverables={[
        'COBie attribution schedule', 'Revit COBie configuration', 'Stage-gate COBie validation reports', 'Final COBie spreadsheet (BS EN ISO 29481)', 'Asset register extract', 'Handover BIM model (as-built)', 'O&M data summary',
      ]}
    />
  )
}
