# GeoWeaver Product Brief

## Summary

GeoWeaver is a desktop-first educational web application for solid geometry learning and teaching. It converts a static geometry problem image into an editable, interactive 3D model, and it also supports teacher-driven manual model creation when automatic recognition is incomplete.

The product is intentionally scoped as an MVP demo. It prioritizes a reliable human-in-the-loop workflow over perfect symbolic reasoning or perfect 3D reconstruction.

## Problem

Students often struggle to form stable spatial understanding from static 2D geometry diagrams. Teachers can explain spatial relations verbally, but quickly producing a manipulable 3D teaching model from a textbook-style problem remains slow and manual.

Current geometry materials usually lack an interaction layer between:

- static problem image,
- problem text and diagram interpretation,
- editable 3D geometry demonstration.

## Users

### Primary users

- Students learning solid geometry
- Teachers preparing or demonstrating classroom examples

### Secondary users

- Tutors
- Curriculum demo evaluators
- Researchers exploring geometry-learning interaction workflows

## Core value proposition

GeoWeaver lets users move from "reading a geometry figure" to "interacting with a spatial structure."

It does this by:

- interpreting problem images,
- extracting usable text and geometry hints,
- generating a 3D geometry starting point,
- letting the user inspect and refine the result.

## MVP outcome

The MVP is successful when a user can complete one end-to-end workflow:

1. upload a geometry problem image or choose manual mode,
2. obtain editable text and geometry hints,
3. generate an approximate 3D model,
4. inspect and refine the model in the browser.

## Constraints

- MVP-first scope
- Chinese problem understanding is important
- VLM use is optional and environment-dependent
- OCR must degrade gracefully
- Only a small template set is supported
- The system is not a theorem prover or exact 3D reconstruction engine

