import ArticlePage from '../../components/ArticlePage'

export default function ScanToBIMGuide() {
  return (
    <ArticlePage
      category="Survey Services"
      categoryColor="#7C3AED"
      title="Scan to BIM: What to Know Before Hiring a Surveyor"
      readTime="8 min read"
      intro="Scan to BIM is increasingly standard on refurbishment, fit-out, and heritage projects. The technology is mature and reliable, but the quality of the final deliverable depends heavily on how the scope is defined before the survey team is commissioned. This guide explains the process, the key decisions, and the questions to ask before appointing a surveyor."
      sections={[
        {
          heading: 'What scan to BIM involves',
          body: [
            'The process starts with a terrestrial laser scan (TLS) of the existing building or site. A scanner — typically a Leica RTC360 or Trimble X7 — is positioned at multiple locations across the building and captures a dense point cloud: a three-dimensional data set made up of millions of measured points that together describe the geometry of every surface the scanner can reach.',
            'That point cloud is then registered — the individual scan positions are stitched together into a single coordinated data set — and used as the reference geometry for building a BIM model in Revit or a similar authoring tool. The model is built to the level of detail specified in the brief and delivered in the formats agreed at commission.',
          ],
        },
        {
          heading: 'Level of Detail (LOD) — what it means in practice',
          body: [
            'The single most important decision in a scan to BIM commission is the Level of Detail (LOD) or Level of Information (LOI) required. These terms are sometimes used interchangeably, but they address different things: LOD refers to geometric complexity and accuracy; LOI refers to the data attributes attached to model elements.',
            'For most fit-out projects, LOD 200 to LOD 300 is appropriate — structural elements, floor plates, wall positions, ceiling heights, and primary MEP routes. For heritage recording and conservation work, LOD 400 or higher may be required, capturing decorative features, moulding profiles, and masonry bond patterns. For facilities management use, LOI requirements often drive the scope more than geometric LOD.',
          ],
          bullets: [
            'LOD 200 — approximate geometry, suitable for planning and concept design',
            'LOD 300 — accurate geometry, suitable for detailed design coordination',
            'LOD 350 — includes interfaces and connections between systems',
            'LOD 400 — fabrication-level detail, rarely required from survey-based models',
          ],
        },
        {
          heading: 'Point cloud accuracy and what affects it',
          body: [
            'Modern TLS scanners achieve accuracy in the range of 1–3mm at medium distances under controlled conditions. In practice, the registered point cloud accuracy across a large building is typically 5–10mm — acceptable for almost all design coordination purposes. For structural engineering work where precise dimensional tolerances matter, this should be confirmed with the surveyor before commission.',
            'Factors that reduce accuracy include: large buildings with complex geometry where individual scan positions multiply and registration errors accumulate; areas with insufficient overlapping scan coverage; highly reflective surfaces such as glazing; and areas where the scanner cannot physically access — plant rooms, risers, voids behind finishes.',
          ],
        },
        {
          heading: 'Deliverable formats — what to ask for',
          body: [
            'A scan to BIM commission typically produces three types of deliverable: the registered point cloud (in .RCP, .E57, or .LAS/LAZ format), the Revit model, and supporting documentation.',
            'Not all design teams have the hardware and software capability to work with dense point clouds in Revit. If the registered point cloud is being handed to a design team for use alongside the model, confirm their workflow and file handling capacity before specifying the point cloud format and density. An unnecessarily dense cloud delivered in a format the design team cannot handle creates significant practical problems.',
          ],
          bullets: [
            '.E57 — open format, widely compatible, recommended for inter-team sharing',
            '.RCP / .RCS — Autodesk format, optimised for Revit, larger file size',
            '.LAS / .LAZ — standard for GIS and civil engineering applications',
            'Revit .RVT — model file, confirm Revit version compatibility with your design team',
          ],
        },
        {
          heading: 'Heritage surveys — additional considerations',
          body: [
            'For listed buildings, conservation areas, and historic assets, scan to BIM provides a non-invasive method of recording existing fabric at a level of accuracy that supports planning submissions, conservation management plans, and detailed repair works.',
            'Heritage scan to BIM briefs typically require higher LOD, a colour-mapped point cloud (the scanner captures RGB values alongside geometry), and in some cases photogrammetric overlay to capture decorative surface detail that the scanner geometry alone cannot resolve. The choice of surveyor for heritage work should consider their experience with listed buildings and their understanding of what the conservation documentation actually requires — not just their scan equipment.',
          ],
        },
        {
          heading: 'Commissioning checklist',
          body: [
            'Before appointing a surveyor, confirm the following with the proposed brief and the surveyor\'s quote:',
          ],
          bullets: [
            'LOD and LOI requirements, referenced to a recognised specification (e.g. AEC (UK) BIM Protocol)',
            'Coordinate system — survey grid or project grid, and who is responsible for setting it',
            'Deliverable formats for point cloud and model, and Revit version',
            'Area coverage — confirm which areas are excluded and why',
            'Accuracy statement — what registration accuracy is being committed to',
            'Programme — scan date, registration period, model delivery, and revision allowance',
            'Post-processing responsibilities — who checks and accepts the registration',
          ],
        },
      ]}
      relatedServices={[
        { path: '/surveys/scan-to-bim', label: 'Scan to BIM' },
        { path: '/surveys/heritage', label: 'Heritage Surveys' },
        { path: '/surveys/post-processing', label: 'Post-Processing' },
        { path: '/surveys/as-built', label: 'As-Built Surveys' },
      ]}
    />
  )
}
