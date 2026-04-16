# AGENTS.md

This repository builds **bretta.io**, an Angular standalone Netlify-hosted site.

Bretta currently has an existing polished single-page marketing homepage with a strong scroll-driven presentation and brand-first experience.

This repository must support **both**:
1. the current Bretta marketing site
2. future single-page restaurant landing pages / microsites

## Product purpose

Bretta is a restaurant rebuild system.

The immediate goal is to generate and deploy strong single-page restaurant landing pages for real hospitality businesses identified by a separate Node-based curator app.

The first commercial focus is:
- English-first businesses
- casual dining first
- weak-site rebuild opportunities second
- broader restaurant / cafe / pub opportunities later

The site should be built to outperform weak vendor-built hospitality websites on:
- speed
- mobile usability
- menu visibility
- contact and location clarity
- local SEO basics
- visual polish
- conversion clarity

## Critical existing-site rule

The current Bretta homepage is already a real product asset.

It is a polished single-page marketing experience with important visual and motion behavior.

Do not:
- flatten it into a generic template
- replace it with restaurant-page assumptions
- degrade its animation, layout, or storytelling structure
- restructure the app in ways that casually break the current landing page

Restaurant-page work must be added **alongside** the existing marketing homepage, not by compromising it.

## Relationship to the curator app

This repo does **not** connect directly to the full raw database.

It should consume only curated handoff data generated elsewhere.

Expected restaurant data fields include:
- sourceId
- establishmentName
- segmentName
- city
- stateProvince
- address1
- postalCode
- phone
- email (optional)
- officialWebsite (optional)
- menu url and menu source type
- social profiles
- siteType
- opportunityClass
- summary
- overallConfidence

Treat curator output as input data, not as application architecture.

Do not build features around raw database tables inside this repo.

## Build priorities

Prefer this order of work:
1. protect and preserve the current Bretta homepage
2. static SEO and deployment essentials
3. reusable restaurant page blueprint
4. restaurant page data model
5. page rendering from curated restaurant data
6. extension points for multiple restaurant pages / microsites

When choosing between polish and extensibility, prefer:
- preserving the existing homepage first
- correct structure second
- reusable restaurant rendering third

## First-wave build scope

The first wave is **single-page restaurant sites**, not a generic website builder.

Optimize first for:
- hero
- menu CTA or menu preview
- contact / hours / address
- map / directions CTA
- gallery or visual credibility
- mobile-first sticky action pattern
- strong restaurant-specific SEO basics

Avoid building generalized multi-page systems too early.

## Technical direction

- Angular standalone APIs
- simple, production-oriented implementation
- Netlify deployment
- preserve SPA routing where needed
- prefer static assets and deterministic generation unless dynamic generation is clearly necessary
- do not overengineer CMS-like abstractions early
- prefer explicit data shapes over loose objects
- prefer direct file placement over premature folder abstraction

## Routing and site structure

Assume Bretta has:
- a primary branded homepage experience
- future restaurant landing pages on dedicated routes and/or microsite-style structures

Any new routing work must preserve the current homepage behavior and should keep restaurant pages clearly separable from the main brand experience.

## Restaurant page blueprint

Restaurant landing pages should usually support:
- hero section
- cuisine / category / positioning copy
- menu preview or strong menu CTA
- address / hours / phone
- map / directions CTA
- gallery or food imagery section
- social proof / trust signals where available
- strong mobile-first contact actions
- sticky CTA behavior where useful

Pages should feel:
- fast
- direct
- restaurant-specific
- conversion-oriented
- lighter and clearer than bloated vendor-built restaurant sites

## SEO requirements

The repo should support:
- robots.txt
- sitemap.xml
- canonical handling
- clean meta title / description generation
- Netlify-friendly indexing behavior

SEO assets must support both:
- the existing Bretta marketing homepage
- future restaurant landing pages

When restaurant pages are introduced, SEO work should favor:
- clear page titles
- unique descriptions
- business/location specificity
- menu/contact/discovery usefulness

## Netlify requirements

Support:
- `_redirects`
- SPA-safe routing
- primary domain assumptions around bretta.io
- future support for many restaurant pages and/or microsites

Prefer simple static-compatible Netlify behavior unless a more complex approach is clearly required.

## File and implementation guidance

Prefer work in these rough categories:
- static SEO / deployment assets in the appropriate public or static output path
- homepage-specific logic left intact unless the task explicitly touches it
- restaurant page data models in clearly named app-level data/model files
- reusable restaurant UI sections as focused Angular components
- route-level rendering kept simple and obvious

Do not scatter restaurant-page logic across unrelated files.

When adding a new feature, keep the file placement easy to understand from a quick repo scan.

## Implementation style

- Keep changes direct and practical
- Avoid unnecessary abstraction
- Prefer easy-to-review file placement
- Explain assumptions briefly
- Do not introduce complex infrastructure until there is a clear need
- Make incremental changes that can be reviewed and tested in isolation

## Guardrails

Do not:
- build around the full raw database here
- overfit the system to one restaurant
- create a generic multi-tenant platform too early
- add speculative backend complexity unless clearly required
- add CMS-like editing systems before the page model is proven
- add complex generation pipelines before a few strong restaurant pages exist
- compromise the current homepage experience in order to add restaurant-page support

## Working model for Codex

When given a task:
1. read this file first
2. preserve the current Bretta homepage unless the task explicitly changes it
3. keep the change narrow and production-oriented
4. prefer the simplest implementation that moves Bretta toward reusable restaurant landing pages
5. make assumptions explicit
6. avoid solving future-scale problems unless the current task truly needs it

## Done means

A task is done when:
- the code is placed correctly
- the local/dev flow remains clear
- the implementation fits Angular + Netlify conventions
- the current homepage remains intact unless intentionally changed
- the result is reusable for restaurant page generation
- assumptions are explicit
- the change improves Bretta’s ability to ship real restaurant landing pages without harming its current marketing site