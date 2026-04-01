import ServicePage from '../../components/ServicePage'

export default function ARImplementation() {
  return (
    <ServicePage
      label="BIM Services · Augmented Reality"
      title="BIM Augmented Reality Implementation"
      tagline="Turn BIM into action on site with Augmented Reality. We help clients integrate AR across the project lifecycle — from technology selection and contractor agreement support to on-site deployment, training, and operational documentation. The result is faster decisions, less rework, and better coordination where it matters most: on site."
      serviceName="BIM AR Implementation"
      overview="BIM Augmented Reality Implementation is our specialist service for companies at any BIM maturity level that want to bring digital models into the field in a practical, usable way. We support the full process from product selection and pre-appointment contractor alignment through to field integration management, training, and site setup documentation, ensuring the AR solution is tailored to the client's workflow, project demands, and delivery environment. We believe heavily coordinated BIM projects should take full advantage of augmented reality, because it helps teams visualise design intent on site, reduce rework, improve accuracy, and streamline decision-making during construction. In larger and more complex projects, this creates a clear commercial benefit by improving coordination, reducing delays, and supporting smoother project delivery. For this reason, we strongly recommend AR implementation on highly coordinated projects where site clarity, sequencing, and fast decision-making are essential."
      deliveryPoints={[
        { title: 'Visualise design intent on site', body: 'AR overlays the coordinated BIM model onto the physical site environment, giving site teams a live view of design intent against actual conditions — before trades commit to position.' },
        { title: 'Reduce rework and delays', body: 'Issues identified on site in AR can be resolved before installation rather than after. On complex coordinated projects this directly reduces rework costs and programme delays.' },
        { title: 'Works at any BIM maturity level', body: 'Our implementation approach is calibrated to the client\'s current BIM maturity. We do not require a perfect model environment — we configure AR around what exists and build from there.' },
      ]}
      expectStages={[
        { stage: 'Technology selection and brief', desc: 'We review available AR platforms — Trimble XR10, HoloLens 2, GAMMA AR, Fologram, and others — against the project type, site environment, model quality, and team capability. A technology recommendation and implementation brief is produced.' },
        { stage: 'Pre-appointment contractor alignment', desc: 'AR expectations are embedded into the contractor appointment documentation and BEP — covering model delivery requirements, format standards, and on-site workflow responsibilities. Contractors understand what is expected before they mobilise.' },
        { stage: 'Model preparation and optimisation', desc: 'The BIM model is reviewed and optimised for AR deployment — file size, level of detail, coordinate system, and zone structure are configured for the chosen AR platform. A model that works in Revit does not automatically work in the field without preparation.' },
        { stage: 'Site setup and integration', desc: 'The AR system is configured, calibrated, and set up on site. Control points, coordinate alignment, and device configuration are established so the model overlays accurately with physical conditions from day one.' },
        { stage: 'Training and onboarding', desc: 'Site teams, foremen, and project managers receive hands-on training specific to the project environment and AR platform. We do not deliver generic AR training — sessions are built around the actual model, site, and workflow.' },
        { stage: 'Field integration management', desc: 'We remain available through the construction phase to support model updates, resolve alignment issues, assist with clash resolution in the field, and manage AR workflow as design changes are issued.' },
      ]}
      deliverables={[
        'Technology selection report', 'AR implementation brief', 'Pre-appointment AR requirements schedule', 'Model preparation and optimisation', 'Site control and coordinate setup', 'AR platform configuration', 'Team training sessions', 'Site setup documentation', 'Field integration management', 'Post-deployment review report',
      ]}
    />
  )
}
