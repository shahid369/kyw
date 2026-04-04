// ============================================================
// KYW — Men's Guide Content Library
// Science-backed, actionable guidance for each cycle phase
// ============================================================

import { CyclePhase } from './cycle-engine'

export interface GuideContent {
  phase: CyclePhase
  title: string
  subtitle: string
  whatIsHappening: {
    heading: string
    body: string
  }
  dos: string[]
  donts: string[]
  tipOfTheDay: string[]
  communicationScript: string
  colorAccent: string
}

export const GUIDE_CONTENT: Record<CyclePhase, GuideContent> = {
  menstrual: {
    phase: 'menstrual',
    title: 'Her Period Is Here',
    subtitle: 'Days of rest, not demands',
    colorAccent: 'var(--phase-menstrual)',
    whatIsHappening: {
      heading: "What's Happening Inside Her Body",
      body:
        'The uterus is shedding its lining. Prostaglandin hormones cause muscle contractions — similar to mild labour cramps. Estrogen and progesterone are at their lowest, which can trigger fatigue, low mood, and heightened pain sensitivity. This is not weakness; it is biology.',
    },
    dos: [
      'Offer a heating pad or hot water bottle without being asked',
      'Make her favourite warm drink or meal',
      'Give her space to rest without guilt',
      'Check in softly — "Do you need anything?" is enough',
      "Cancel plans gracefully if she's not up for it",
      "Be patient if she's quieter than usual",
    ],
    donts: [
      'Do not minimise her pain — "It\'s just cramps" is dismissive',
      "Don't bring up heavy topics or unresolved arguments",
      'Avoid pressuring her into physical activity or social events',
      'Don\'t take her low energy or mood personally',
      'Avoid making jokes about her period',
      "Don't expect affection on demand — be led by her",
    ],
    tipOfTheDay: [
      'Stock up on her preferred pain relief before she needs to ask.',
      'A warm blanket and no questions is sometimes the best gift.',
      'Let her nap without guilt. Rest is medicine right now.',
      'Put on a show she loves and sit beside her. Presence over productivity.',
    ],
    communicationScript:
      '"Hey, I know today might be rough. I\'ve got [warm drink/food] ready and nowhere to be. Just tell me what you need."',
  },

  follicular: {
    phase: 'follicular',
    title: "She's Coming Back to Life",
    subtitle: 'Her energy is rising — match it',
    colorAccent: 'var(--phase-follicular)',
    whatIsHappening: {
      heading: "What's Happening Inside Her Body",
      body:
        "Estrogen is climbing steadily. The brain produces more serotonin and dopamine. Physically, she will feel lighter, more motivated, and socially engaged. Cognitive function sharpens — this is when she processes things best. New ideas excite her. She's more open to conversation and adventure.",
    },
    dos: [
      "Plan a date, outing, or new experience she'll enjoy",
      "Engage her in real conversation — she wants to be stimulated",
      'Make plans together: trips, goals, projects',
      "Be playful and light — she's in the mood for fun",
      'Compliment her specifically, not generically',
      "Bring up important discussions now — she's mentally sharp",
    ],
    donts: [
      "Don't be passive or withdrawn — she'll notice and feel disconnected",
      "Avoid last-minute plan cancellations — she's energised and looking forward to things",
      "Don't compare this phase to the last — each phase is its own chapter",
      "Avoid being dismissive of her ideas — she's creative right now",
    ],
    tipOfTheDay: [
      'Suggest something new: a restaurant, a weekend trip, a class together.',
      "Ask her opinion on something important — she's at her analytical best.",
      "Plan ahead with her. She's future-focused and will appreciate the effort.",
      "Match her energy. If she's cheerful, don't be a wet blanket.",
    ],
    communicationScript:
      '"I made a reservation for Saturday — thought we could try something new. What do you think?"',
  },

  ovulation: {
    phase: 'ovulation',
    title: "Peak Phase — She's at Her Best",
    subtitle: 'High energy, high connection',
    colorAccent: 'var(--phase-ovulation)',
    whatIsHappening: {
      heading: "What's Happening Inside Her Body",
      body:
        'LH (Luteinising Hormone) surges, triggering the release of an egg. Estrogen peaks. Testosterone also rises slightly, boosting confidence, drive, and libido. She is at her physical, emotional, and social peak. Her voice is more attractive to others during this window, and she radiates warmth and charisma. She wants deep connection.',
    },
    dos: [
      'Be present, attentive, and engaged — she notices effort now',
      'Have meaningful conversations — emotional connection is at its peak',
      "Express your feelings openly — she's more receptive than any other time",
      'Plan something romantic or special',
      'Be physically affectionate and attentive',
      'Resolve lingering issues now — communication is at its best',
    ],
    donts: [
      "Don't take her heightened energy for granted",
      'Avoid being distracted by your phone when she wants to connect',
      "Don't waste this window on small arguments",
      'Avoid major conflict — use this time for bonding, not battles',
    ],
    tipOfTheDay: [
      'Tell her something you genuinely appreciate about her — specifically.',
      'Put your phone away completely during dinner tonight.',
      'This is the best window for any important relationship talk.',
      "Plan a night that's about her — her favourite things, her choices.",
    ],
    communicationScript:
      '"I want to spend proper time with you this week. Let\'s [her favourite activity]. No phones, just us."',
  },

  luteal: {
    phase: 'luteal',
    title: 'Energy is Winding Down',
    subtitle: 'She needs calm, not stimulation',
    colorAccent: 'var(--phase-luteal)',
    whatIsHappening: {
      heading: "What's Happening Inside Her Body",
      body:
        'After ovulation, progesterone rises and estrogen begins a slow decline. She may feel less social, more introspective, and prefer quieter environments. Her body temperature rises slightly. She may crave carbohydrates as her body uses more glucose. Small irritants become easier to notice. This is a phase of withdrawal and inward focus — entirely normal.',
    },
    dos: [
      'Create a calm, comfortable home environment',
      'Cook or order her comfort food without being asked',
      "Let her lead the pace — don't overschedule",
      'Validate her feelings without trying to "fix" them',
      'Offer gentle physical comfort: a hug, shoulder rub',
      'Give her solo time guilt-free if she needs it',
    ],
    donts: [
      "Don't plan too many social events or gatherings",
      'Avoid bringing up stressful financial or life decisions',
      "Don't interpret her quietness as rejection or anger at you",
      "Avoid picking fights — her irritability threshold is lower",
      'Don\'t pressure her to "cheer up" or "be happy"',
    ],
    tipOfTheDay: [
      'Suggest a quiet night in instead of going out.',
      'Run her a bath or create a cosy environment without being asked.',
      "If she seems distant, ask gently — don't assume.",
      'Bring her favourite snack. No explanation needed.',
    ],
    communicationScript:
      '"I noticed you might need a quieter evening. I\'m cooking tonight — no plans, no pressure. Just us."',
  },

  pms: {
    phase: 'pms',
    title: 'PMS Phase — Handle With Care',
    subtitle: 'This is physiological, not personal',
    colorAccent: 'var(--phase-pms)',
    whatIsHappening: {
      heading: "What's Happening Inside Her Body",
      body:
        'Estrogen and progesterone both drop sharply in the final days before menstruation. Serotonin — the feel-good neurotransmitter — falls with them. The result: heightened emotional sensitivity, lower stress tolerance, physical discomfort (bloating, headaches, breast tenderness), and a shorter fuse. This is not a personality change — it is a hormonal withdrawal. Her brain is literally in a different chemical state.',
    },
    dos: [
      'Be exceptionally patient — your calm is her anchor',
      'Acknowledge her feelings: "That sounds really frustrating"',
      'Offer practical help before she has to ask',
      'Respect her need to vent without offering solutions',
      'Stock her preferred snacks, pain relief, and comfort items',
      'Lower your expectations and raise your gentleness',
    ],
    donts: [
      'NEVER say "it\'s just PMS" — this dismisses real suffering',
      "Don't escalate arguments — disengage and revisit when she's ready",
      "Don't make jokes about her mood or emotional state",
      'Avoid adding to her stress: noise, mess, last-minute changes',
      "Don't take her frustration personally — you are a safe outlet",
      "Don't guilt trip her for being emotional",
    ],
    tipOfTheDay: [
      '"You don\'t have to explain yourself. I\'m here." Say this. Mean it.',
      'Clean the kitchen before she notices it needs doing.',
      "Don't give advice unless she asks. Just listen.",
      'Buy her chocolate (or her comfort food). No comment required.',
    ],
    communicationScript:
      '"I can see today is hard. I\'m not going anywhere. What would help most — company or space?"',
  },

  unknown: {
    phase: 'unknown',
    title: 'Log a Cycle to Get Started',
    subtitle: 'The guide unlocks once data is added',
    colorAccent: 'var(--color-muted)',
    whatIsHappening: {
      heading: 'No Cycle Data Yet',
      body:
        'Once the first menstrual cycle is logged, KYW will calculate the current phase and provide personalised daily guidance. Add a cycle start date to begin.',
    },
    dos: ['Log the most recent period start date to unlock your guide'],
    donts: [],
    tipOfTheDay: ['Start by logging the last period start and end date.'],
    communicationScript: '',
  },
}

export function getRandomTip(phase: CyclePhase): string {
  const tips = GUIDE_CONTENT[phase].tipOfTheDay
  return tips[Math.floor(Math.random() * tips.length)]
}
