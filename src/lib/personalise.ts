// ============================================================
// KYW — Personalisation Engine
// Injects her profile details into generic guide content
// ============================================================

import { CyclePhase } from './cycle-engine'

export interface PartnerProfile {
  user_id: string
  love_language: string | null
  personality: string[] | null
  comfort_style: string | null
  communication_style: string | null
  likes: string[] | null
  dislikes: string[] | null
  comfort_foods: string[] | null
  fav_shows: string[] | null
  fav_activities: string[] | null
  onboarding_step: number
}

export interface PersonalisedOverlay {
  /** Extra phase-specific tips generated from her profile */
  extraTips: string[]
  /** Personalised communication script replacing generic one */
  script: string | null
  /** 2–3 hyper-specific action cards shown in the guide */
  personalCards: string[]
  /** Whether the profile has enough data to personalise */
  isPersonalised: boolean
}

// ── Helpers ────────────────────────────────────────────────

function pick<T>(arr: T[] | null | undefined): T | null {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

function hasData(profile: PartnerProfile): boolean {
  return !!(
    profile.love_language ||
    (profile.comfort_foods && profile.comfort_foods.length > 0) ||
    (profile.fav_shows && profile.fav_shows.length > 0) ||
    (profile.fav_activities && profile.fav_activities.length > 0) ||
    (profile.likes && profile.likes.length > 0)
  )
}

// ── Love-language tips per phase ──────────────────────────

function loveLanguageTips(lang: string | null, phase: CyclePhase, partnerName: string): string[] {
  if (!lang) return []
  const name = partnerName || 'her'

  const map: Record<string, Partial<Record<CyclePhase, string[]>>> = {
    words: {
      menstrual: [
        `Send ${name} a genuine text: "I've got nowhere to be. I'm yours today."`,
        `Tell ${name} one specific thing you appreciate — don't make it generic.`,
      ],
      follicular: [
        `Compliment ${name} on something specific she did this week — she's feeling sharp and will notice the detail.`,
        `Ask for her opinion on something important. Her input genuinely matters to you — say that.`,
      ],
      ovulation: [
        `Tell ${name} exactly what you love about her. Be specific, be direct, be sincere.`,
        `Write her a short note — even a text — telling her what she means to you. She's at peak receptivity right now.`,
      ],
      luteal: [
        `Remind ${name} she doesn't have to explain how she feels. "I'm here, that's enough" goes a long way.`,
        `Quietly affirm her. No pressure, no solutions — just "I see you."`,
      ],
      pms: [
        `Say it clearly: "You don't have to justify feeling this way. I'm not going anywhere."`,
        `Don't disappear into silence. A simple "I love you, full stop" is powerful right now.`,
      ],
      unknown: [],
    },
    acts: {
      menstrual: [
        `Do the dishes, tidy up, and don't mention it. Acts, not words.`,
        `Make her a hot drink without being asked. Put it next to her without interrupting.`,
      ],
      follicular: [
        `Handle one thing on ${name}'s to-do list before she gets to it today.`,
        `Organise something for the two of you — plan, book, execute. She'll feel cared for.`,
      ],
      ovulation: [
        `Plan the whole evening — reservation, route, everything. Zero effort on her end.`,
        `Notice something around the house that needs doing and just do it.`,
      ],
      luteal: [
        `Cook her favourite meal without asking. Clean up completely after.`,
        `Handle any pending chore before it becomes a stressor for her.`,
      ],
      pms: [
        `Clean the kitchen before she wakes up. Acts of service are your superpower right now.`,
        `Buy her preferred snacks and pain relief and leave them where she'll find them.`,
      ],
      unknown: [],
    },
    quality_time: {
      menstrual: [
        `Put your phone away completely. Sit near her. That's it — presence is the gift.`,
        `Find a show or film she loves and watch it side by side. No commentary needed.`,
      ],
      follicular: [
        `Suggest something new for the two of you — a walk, a market, a café you haven't tried.`,
        `Block a few hours this weekend that are just hers. No phones, just you two.`,
      ],
      ovulation: [
        `Plan a full evening with ${name} — her favourite activity, her pace, her call.`,
        `Put the phone in another room during dinner tonight. She'll feel it.`,
      ],
      luteal: [
        `Suggest a quiet night in. Sofa, her show, no agenda — she leads.`,
        `Just be present. Don't scroll. Don't half-listen. Be fully there.`,
      ],
      pms: [
        `Don't go missing. Even if she's quiet, your presence is what she needs.`,
        `Sit with her. Not to fix anything — just to be there.`,
      ],
      unknown: [],
    },
    touch: {
      menstrual: [
        `A gentle hand on her back or a long hug — let her set the pace, you just offer.`,
        `Warmth is everything right now: a hot water bottle placed near her without comment.`,
      ],
      follicular: [
        `Hold her hand on the walk. Small touch, big feeling.`,
        `A grounding hug at the start or end of the day — no agenda.`,
      ],
      ovulation: [
        `Physical presence and affection. She's at peak connection — be warm and attentive.`,
        `Reach for her hand. Put an arm around her. Let her feel anchored to you.`,
      ],
      luteal: [
        `A shoulder rub or gentle hug without expectation is worth more than words right now.`,
        `Hold her close. No talking required. Warmth is the language she needs.`,
      ],
      pms: [
        `A long, quiet hug says more than anything you could explain right now.`,
        `Physical warmth — arm around her, hand on her back — without pressure or expectation.`,
      ],
      unknown: [],
    },
    gifts: {
      menstrual: [
        `Pick up her favourite comfort food or something small she loves — no occasion needed.`,
        `Leave a small but thoughtful something where she'll find it. Thought, not price.`,
      ],
      follicular: [
        `Find something small that reminded you of her — a book, a snack, a note. Intentionality is the gift.`,
        `Surprise her with something she mentioned once and you actually remembered. That's it.`,
      ],
      ovulation: [
        `Plan something she's mentioned wanting to do. The act of planning is the gift.`,
        `A small, specific gift that shows you listen — not grand, just real.`,
      ],
      luteal: [
        `Her preferred snacks, delivered without fanfare. She'll know you thought of her.`,
        `Something cosy — a candle, her favourite tea, a soft thing. Low-key, high-meaning.`,
      ],
      pms: [
        `Buy her comfort food and pain relief before she has to ask. That's love in action.`,
        `A small gesture — her snack, her drink, her thing — placed near her without comment.`,
      ],
      unknown: [],
    },
  }

  return map[lang]?.[phase] ?? []
}

// ── Comfort-style tips ────────────────────────────────────

function comfortStyleTip(style: string | null, name: string, phase: CyclePhase): string | null {
  if (!style) return null
  if (phase !== 'menstrual' && phase !== 'pms' && phase !== 'luteal') return null

  const tips: Record<string, string> = {
    physical: `${name} recharges through closeness — a hug, a warm presence is better than space right now.`,
    alone_time: `${name} needs to recharge alone right now. Give her uninterrupted quiet — no check-ins.`,
    distraction: `Distraction is her comfort — put on something she loves and let her switch off.`,
  }
  return tips[style] ?? null
}

// ── Communication-style tip ───────────────────────────────

function communicationStyleTip(style: string | null, name: string, phase: CyclePhase): string | null {
  if (!style) return null
  if (phase !== 'pms' && phase !== 'luteal') return null

  const tips: Record<string, string> = {
    direct: `${name} values directness — say clearly that you're there for her, then follow through.`,
    indirect: `Don't push ${name} to talk. Let her come to you. Follow her lead entirely.`,
    needs_space_first: `Give ${name} space first, then gently check in after an hour. That's her rhythm.`,
  }
  return tips[style] ?? null
}

// ── Script personalisation ────────────────────────────────

function buildScript(
  profile: PartnerProfile,
  phase: CyclePhase,
  partnerName: string,
): string | null {
  const name = partnerName || 'her'
  const food = pick(profile.comfort_foods) ?? 'something she loves'
  const show = pick(profile.fav_shows)
  const activity = pick(profile.fav_activities)

  const showOrActivity = show ?? activity

  switch (phase) {
    case 'menstrual':
      return `"${name}, I've got ${food} ready and I've put on ${showOrActivity ?? 'something she loves'}. No plans, no pressure — just tell me what you need."`
    case 'follicular':
      return activity
        ? `"I thought we could do ${activity} this weekend — just the two of us. What do you think?"`
        : `"I made plans for us this weekend — nothing big, just something new. You in?"`
    case 'ovulation':
      return activity
        ? `"I want tonight to be about you — ${activity}, your call, your pace. No phones, just us."`
        : `"I want to spend proper time with you this evening. Her favourite things — your choices. No distractions."`
    case 'luteal':
      return showOrActivity
        ? `"I was thinking a quiet night — ${showOrActivity ?? 'your show'} and ${food}. No going out, I'll sort everything."`
        : `"Quiet night in. I'll sort food. Zero expectations — you set the pace."`
    case 'pms':
      return `"${name}, you don't have to explain anything. I've got ${food} and nowhere to be. Company or space — just tell me."`
    default:
      return null
  }
}

// ── Personal cards ────────────────────────────────────────

function buildPersonalCards(
  profile: PartnerProfile,
  phase: CyclePhase,
  partnerName: string,
): string[] {
  const name = partnerName || 'her'
  const cards: string[] = []

  const food = pick(profile.comfort_foods)
  const show = pick(profile.fav_shows)
  const activity = pick(profile.fav_activities)
  const like = pick(profile.likes)

  if (food) {
    if (phase === 'menstrual' || phase === 'pms') {
      cards.push(`Get ${name} ${food} — her comfort food, no questions asked.`)
    } else if (phase === 'luteal') {
      cards.push(`Cook or order ${food} tonight. She craves familiar comfort right now.`)
    } else if (phase === 'follicular' || phase === 'ovulation') {
      cards.push(`Surprise her with ${food} — a small gesture that shows you pay attention.`)
    }
  }

  if (show) {
    if (phase === 'menstrual' || phase === 'pms' || phase === 'luteal') {
      cards.push(`Put on ${show} without being asked. Sit with her if she wants company.`)
    }
  }

  if (activity) {
    if (phase === 'follicular' || phase === 'ovulation') {
      cards.push(`Plan ${activity} for this weekend — she's in the mood for experiences right now.`)
    }
  }

  if (like && cards.length < 2) {
    cards.push(`She loves ${like} — find a small way to weave that into today.`)
  }

  return cards.slice(0, 3)
}

// ── Main export ───────────────────────────────────────────

export function personaliseGuide(
  profile: PartnerProfile | null,
  phase: CyclePhase,
  partnerName: string,
): PersonalisedOverlay {
  const empty: PersonalisedOverlay = {
    extraTips: [],
    script: null,
    personalCards: [],
    isPersonalised: false,
  }

  if (!profile || !hasData(profile)) return empty

  const name = partnerName || 'her'

  // Love-language tips
  const llTips = loveLanguageTips(profile.love_language, phase, name)

  // Comfort + communication style tips (for heavy phases)
  const csTip = comfortStyleTip(profile.comfort_style, name, phase)
  const commTip = communicationStyleTip(profile.communication_style, name, phase)

  const extraTips = [...llTips, ...(csTip ? [csTip] : []), ...(commTip ? [commTip] : [])]

  return {
    extraTips,
    script: buildScript(profile, phase, name),
    personalCards: buildPersonalCards(profile, phase, name),
    isPersonalised: true,
  }
}
