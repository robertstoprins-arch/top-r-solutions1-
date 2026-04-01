import ServicePage from '../../components/ServicePage'

export default function RemoteModelling() {
  return (
    <ServicePage
      label="BIM Services · Remote"
      title="Remote Modelling"
      tagline="Dedicated BIM modelling capacity, delivered remotely — integrated into your project workflow without the overhead of a full-time in-house resource."
      serviceName="Remote Modelling"
      overview="Remote modelling provides dedicated Revit modelling capacity on a project or retainer basis, integrated directly into the project CDE environment and working to the project BIM standards. This is not outsourced modelling from a disconnected team — it is a managed resource operating within the same standards, CDE, and coordination workflow as the rest of the design team. Remote modelling is commercially effective for practices and contractors who need consistent BIM output without the cost of recruiting, training, and managing in-house modellers across fluctuating project volumes."
      deliveryPoints={[
        { title: 'Integrated into your workflow', body: 'Remote modellers work within your CDE, to your naming conventions, and within the project BIM standards — not in a separate environment that requires translation at each exchange.' },
        { title: 'Standards-compliant output', body: 'Every model package produced is checked against the project BEP before issue. Naming, classification, and level of detail are verified at the source.' },
        { title: 'Scalable capacity', body: 'Resource scales with project demand — from a single modeller supporting a specific package to a dedicated team managing the full model environment across multiple disciplines.' },
      ]}
      expectStages={[
        { stage: 'Scope and standards review', desc: 'We review the project BEP, CDE configuration, and model requirements before any modelling begins. The remote resource is set up within the project environment, not in an external one.' },
        { stage: 'CDE access and configuration', desc: 'Remote modellers are provisioned with the correct CDE access, model templates, naming convention references, and coordination model access — ready to begin compliant modelling from day one.' },
        { stage: 'Managed delivery', desc: 'Model packages are delivered to the agreed TIDP milestones. Each issue is checked against the project standard before release to the WIP or Shared folder.' },
        { stage: 'Coordination participation', desc: 'Remote modellers participate in coordination reviews, clash resolution, and design change integration — not as a passive resource but as an active part of the delivery team.' },
      ]}
      deliverables={[
        'Revit model packages (per TIDP)', 'Coordination model contributions', 'Clash resolution updates', 'Model issue records', 'Named deliverable files (project BEP compliant)', 'Weekly progress summary',
      ]}
    />
  )
}
