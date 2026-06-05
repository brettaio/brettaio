import { ScrollExperienceConfig } from './scroll-experience.types';
import { CONNECTION_STRANDS_FRAGMENT_SHADER } from './shaders/connection-strands.shader';
import { GRATITUDE_TUNNEL_FRAGMENT_SHADER } from './shaders/gratitude-low-tech-tunnel.shader';
import { KINDNESS_WEAVE_FRAGMENT_SHADER } from './shaders/kindness-weave.shader';
import { PRESENCE_BREATH_FRAGMENT_SHADER } from './shaders/presence-breath.shader';

const primaryCta = {
  primaryCtaLabel: 'Email Brett',
  primaryCtaHref: '',
  secondaryCtaLabel: 'Start a conversation',
  secondaryCtaHref: '@project-inquiry-panel',
};

export const HOME_SCROLL_EXPERIENCES = [
  {
    id: 'connection',
    fragmentShader: CONNECTION_STRANDS_FRAGMENT_SHADER,
    eyebrow: 'Connection',
    title: 'I build the missing bridge between people and systems.',
    copy:
      'I help teams, founders, coaches, operators, and service businesses turn human friction into clearer language, better workflows, and usable digital products.',
    frames: [
      {
        eyebrow: 'Connection',
        titleLines: ['The problem is often', 'a missing bridge.'],
        bodyLines: [
          'Customers do not know what to do next. Staff avoid the workflow. A team keeps repeating the same conversation. A website gets traffic but no trust.',
          'That is not just a design problem. It is a connection problem with a system attached to it.',
        ],
      },
      {
        eyebrow: 'What I do',
        titleLines: ['I turn friction', 'into working structure.'],
        bodyLines: [
          'I can clarify the message, map the flow, design the user journey, write the content, and build the digital surface that carries it.',
          'Landing pages. Intake forms. Dashboards. Admin tools. Internal workflows. Product prototypes. Reporting systems.',
        ],
      },
      {
        eyebrow: 'Why it works',
        titleLines: ['Better systems', 'make participation easier.'],
        bodyLines: [
          'People engage when the next step is obvious, the language feels true, and the tool respects the reality of their situation.',
          'That is where writing, UX, software, and human judgement have to work together.',
        ],
      },
      {
        eyebrow: 'Who this helps',
        titleLines: ['For people building', 'something people need to trust.'],
        bodyLines: [
          'Founders, coaches, consultants, service businesses, community builders, and teams who need a digital system that feels clearer, more useful, and more human.',
        ],
      },
      {
        eyebrow: 'Start here',
        titleLines: ['Bring me the gap.', 'I will help shape it.'],
        bodyLines: [
          'If something important is getting lost between people, process, and technology, that is a strong place to start.',
        ],
      },
    ],
    frameWeights: [1.28, 1.08, 1.08, 1.06, 1.7],
    scrollTimeRange: 5.8,
    ...primaryCta,
    vectors: {
      velocity: 0.82,
      density: 0.44,
      depth: 0.72,
      warmth: 0.76,
    },
  },
  {
    id: 'gratitude',
    fragmentShader: GRATITUDE_TUNNEL_FRAGMENT_SHADER,
    eyebrow: 'Value',
    title: 'I help make valuable work easier to understand and enter.',
    copy:
      'If you have something people already care about, I can help turn it into stronger positioning, cleaner flows, better content, and a system people can actually use.',
    frames: [
      {
        eyebrow: 'Value',
        titleLines: ['Good work still needs', 'a clear way in.'],
        bodyLines: [
          'You may already have the experience, service, product, story, or community.',
          'But if people cannot quickly understand what it is, why it matters, and what to do next, the value stays hidden.',
        ],
      },
      {
        eyebrow: 'What I do',
        titleLines: ['I turn value', 'into a usable experience.'],
        bodyLines: [
          'I can help with positioning, homepage copy, service pages, intake flows, product framing, onboarding, and the systems around the first real interaction.',
          'The goal is not to decorate the work. The goal is to make the work easier to trust.',
        ],
      },
      {
        eyebrow: 'Where this shows up',
        titleLines: ['Websites. Forms.', 'Products. Workflows.'],
        bodyLines: [
          'A good offer can be weakened by a vague page, a confusing form, a messy workflow, or a product that does not guide people clearly.',
          'I help connect the value of the work to the experience people actually touch.',
        ],
      },
      {
        eyebrow: 'Who this helps',
        titleLines: ['For people with real value', 'but unclear presentation.'],
        bodyLines: [
          'Consultants, coaches, founders, trades, service businesses, creators, and organizations who need the outside to finally match the depth of the work.',
        ],
      },
      {
        eyebrow: 'Start here',
        titleLines: ['If the work matters,', 'make it easier to enter.'],
        bodyLines: [
          'Bring the service, idea, site, product, or workflow that is not carrying its weight yet.',
        ],
      },
    ],
    frameWeights: [1.28, 1.08, 1.08, 1.06, 1.7],
    scrollTimeRange: 9.2,
    ...primaryCta,
    vectors: {
      velocity: 0.58,
      density: 0.38,
      depth: 0.62,
      warmth: 0.92,
    },
  },
  {
    id: 'kindness',
    fragmentShader: KINDNESS_WEAVE_FRAGMENT_SHADER,
    eyebrow: 'Clarity',
    title: 'I build systems that reduce confusion instead of adding pressure.',
    copy:
      'I help leaders, teams, and businesses create clearer tools, workflows, content, and interfaces so people can do the right thing without fighting the system.',
    frames: [
      {
        eyebrow: 'Clarity',
        titleLines: ['A good system', 'lowers the emotional load.'],
        bodyLines: [
          'People should not need to guess what matters, where to go, who owns what, or how to complete the next step.',
          'Confusion becomes friction. Friction becomes avoidance. Avoidance becomes disconnection.',
        ],
      },
      {
        eyebrow: 'What I do',
        titleLines: ['I make the next step', 'harder to miss.'],
        bodyLines: [
          'I can build clearer forms, internal tools, dashboards, checklists, customer flows, admin screens, content systems, and handoff processes.',
          'The work can be technical, but the outcome is practical: less drag, fewer dead ends, better follow-through.',
        ],
      },
      {
        eyebrow: 'Where this matters',
        titleLines: ['Teams need clarity.', 'Customers do too.'],
        bodyLines: [
          'A leader needs a better workflow. A customer needs a clearer form. A team needs one source of truth. A service business needs fewer manual gaps.',
          'That is where thoughtful systems create trust.',
        ],
      },
      {
        eyebrow: 'Who this helps',
        titleLines: ['For people responsible', 'for other people’s experience.'],
        bodyLines: [
          'Operators, managers, coaches, founders, service providers, and teams who need the system to support the standard instead of relying on memory and pressure.',
        ],
      },
      {
        eyebrow: 'Start here',
        titleLines: ['If people keep getting stuck,', 'the system is speaking.'],
        bodyLines: [
          'Bring the recurring confusion. I will help translate it into something clearer and buildable.',
        ],
      },
    ],
    frameWeights: [1.28, 1.08, 1.08, 1.06, 1.7],
    scrollTimeRange: 5.9,
    ...primaryCta,
    vectors: {
      velocity: 0.68,
      density: 0.5,
      depth: 0.7,
      warmth: 0.82,
    },
  },
  {
    id: 'presence',
    fragmentShader: PRESENCE_BREATH_FRAGMENT_SHADER,
    eyebrow: 'Diagnosis',
    title: 'Before building, I help find the real problem.',
    copy:
      'I help people slow down long enough to understand what is actually broken, then turn that diagnosis into better language, product direction, UX, workflows, or software.',
    frames: [
      {
        eyebrow: 'Diagnosis',
        titleLines: ['Do not build', 'the wrong solution faster.'],
        bodyLines: [
          'A homepage problem might be a positioning problem. A workflow problem might be an ownership problem. A software idea might really be a service design problem.',
          'Before the build, the shape needs to be understood.',
        ],
      },
      {
        eyebrow: 'What I do',
        titleLines: ['I separate noise', 'from the real signal.'],
        bodyLines: [
          'I can review the current site, offer, workflow, user journey, product idea, or operational process and identify what is actually blocking progress.',
          'Then I help decide what should be written, designed, automated, simplified, or built.',
        ],
      },
      {
        eyebrow: 'Where this helps',
        titleLines: ['Better scope.', 'Better decisions.'],
        bodyLines: [
          'This matters before a rebuild, before a product sprint, before a new offer, before a dashboard, before another tool gets added to the stack.',
          'The right diagnosis saves time, money, and emotional energy.',
        ],
      },
      {
        eyebrow: 'Who this helps',
        titleLines: ['For people who know', 'something is off.'],
        bodyLines: [
          'Founders, teams, coaches, consultants, and organizations who can feel the gap but need help turning it into a clear plan and practical execution.',
        ],
      },
      {
        eyebrow: 'Start here',
        titleLines: ['Bring the mess.', 'We will find the shape.'],
        bodyLines: [
          'The first step does not need to be polished. It needs to be honest enough to diagnose.',
        ],
      },
    ],
    frameWeights: [1.28, 1.08, 1.08, 1.06, 1.7],
    scrollTimeRange: 11.5,
    ...primaryCta,
    vectors: {
      velocity: 0.84,
      density: 0.42,
      depth: 0.9,
      warmth: 0.82,
    },
  },
  {
    id: 'systems-belonging',
    eyebrow: 'Systems',
    title: 'I build digital systems around human behaviour.',
    copy:
      'I work across strategy, writing, UX, and code to create websites, forms, dashboards, workflows, and applications that help people understand, participate, and return.',
    frames: [
      {
        eyebrow: 'Systems',
        titleLines: ['I build digital systems', 'around human behaviour.'],
        bodyLines: [
          'A digital system is never just a screen.',
          'It tells people what matters, what to do next, how much to trust you, and whether the experience is worth returning to.',
        ],
      },
      {
        eyebrow: 'What I do',
        titleLines: ['Strategy.', 'Writing. UX. Code.'],
        bodyLines: [
          'I can move from diagnosis to language, from language to interface, from interface to working application.',
          'That includes sites, forms, admin tools, dashboards, reporting surfaces, automation, product prototypes, and custom web systems.',
        ],
      },
      {
        eyebrow: 'How I think',
        titleLines: ['The human system', 'and the technical system are linked.'],
        bodyLines: [
          'If the words are unclear, the interface suffers. If the workflow is messy, the software inherits the mess. If trust is missing, the product has to work twice as hard.',
          'The best build starts by understanding the people inside it.',
        ],
      },
      {
        eyebrow: 'Who this helps',
        titleLines: ['For work that has', 'outgrown the current system.'],
        bodyLines: [
          'Service businesses, founders, operators, communities, coaches, teams, and organizations who need more than a prettier page.',
          'They need a clearer path from intent to action.',
        ],
      },
      {
        eyebrow: 'Start here',
        titleLines: ['Bring the human problem', 'and the technical shape.'],
        bodyLines: [
          'I will help clarify what matters, what is broken, what should exist, and what can be built next.',
        ],
      },
    ],
    frameWeights: [1.35, 1.1, 1.14, 1.08, 1.75],
    scrollTimeRange: 6.4,
    ...primaryCta,
    vectors: {
      velocity: 0.78,
      density: 0.58,
      depth: 0.88,
      warmth: 0.74,
    },
  },
] satisfies readonly ScrollExperienceConfig[];

export type HomeScrollExperienceId = (typeof HOME_SCROLL_EXPERIENCES)[number]['id'];

export function getHomeScrollExperienceConfig(
  id: HomeScrollExperienceId
): ScrollExperienceConfig {
  return (
    HOME_SCROLL_EXPERIENCES.find((experience) => experience.id === id) ||
    HOME_SCROLL_EXPERIENCES[0]
  );
}
