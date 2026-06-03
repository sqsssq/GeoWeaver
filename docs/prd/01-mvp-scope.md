# MVP Scope

## Must-have

- Image upload for PNG/JPG/JPEG
- Image preview
- Problem text recognition with editable correction
- Candidate shape detection: `cuboid`, `prism`, `pyramid`, `unknown`
- 2D diagram heuristic extraction with vertices and edges
- Optional VLM-assisted recognition
- Template-based 3D generation
- Interactive 3D viewer:
  - rotate
  - zoom
  - pan
  - reset view
- Selection of vertices, edges, and faces
- Manual editing:
  - drag vertex positions
  - edit vertex labels
  - toggle hidden edges
- Manual teacher mode using templates
- Warnings and fallback behavior

## Should-have

- Structured AI hints:
  - point labels
  - hidden edge suggestions
  - base-face ordering
  - apex label
- Empty, loading, and error states across the primary workflow
- Documentation describing setup, limits, and local verification

## Nice-to-have

- More geometry templates
- More robust 2D-to-3D fitting
- Classroom presentation mode
- Persisted projects or save/load flows
- Multi-step guided correction

## Out of scope

- Exact 3D reconstruction from arbitrary single-view diagrams
- Formal theorem proving
- Automatic symbolic solving of geometry problems
- User accounts and authentication
- Collaboration or cloud storage
- Production deployment infrastructure

