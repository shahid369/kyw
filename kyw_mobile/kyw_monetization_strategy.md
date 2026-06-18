# KYW — Monetization Strategy

> **Positioning**: The only period tracker built *for men* — not for the woman herself.  
> **Privacy-first**: Zero personal data collection beyond what's needed to track cycles.

---

## Revenue Model Overview

```
Phase 1 (Launch)    → Ads-supported free tier (AdMob banners + interstitials)
Phase 2 (Month 1+)  → KYW Pro subscription via RevenueCat
Phase 3 (Month 3+)  → Lifetime purchase option to drive spikes
```

Two revenue streams running in parallel:
1. **Ads** — monetize the free majority immediately
2. **KYW Pro** — convert power users to recurring revenue

---

## Free vs Pro Feature Table

| Feature | Free 🆓 | KYW Pro ⭐ |
|---|---|---|
| Period start/end logging | ✅ | ✅ |
| Current phase + phase ring | ✅ | ✅ |
| Basic daily tip (1 tip/day) | ✅ | ✅ |
| Cycle history | **Last 3 cycles only** | Unlimited |
| Symptom logging | **3 symptoms max** | Unlimited + custom tags |
| Notifications | **Period start only** | All types + custom timing |
| Daily guide depth | **1 section** | All 4 sections (see below) |
| Phase prediction calendar | ❌ | ✅ 3-month view |
| "How to talk to her" tips | ❌ | ✅ Per phase |
| Gift & date ideas | ❌ | ✅ Per phase |
| Mood predictor | ❌ | ✅ |
| Intimacy window alerts | ❌ | ✅ |
| Data export (PDF) | ❌ | ✅ |
| Home screen widget | ❌ | ✅ |
| Ad-free experience | ❌ | ✅ |

---

## Ads Strategy (Free Tier)

| Ad Type | Placement | Notes |
|---|---|---|
| **Banner ad** | Bottom of Dashboard | Always visible for free users |
| **Interstitial** | After logging a period start/end | Max 1 per session, not aggressive |
| **Native ad** | Between cycles in History screen | Looks like a card, less intrusive |

**Key rules:**
- No ads during onboarding (don't scare new users)
- No ads on Guide screen (degrades the core value)
- Pro users see **zero ads**
- Use **Google AdMob** (already in your plans)

---

## KYW Pro — Pricing

| Plan | Price | Notes |
|---|---|---|
| Monthly | **$2.99 / month** | Low barrier to try |
| Annual | **$19.99 / year** | ~44% saving, push this |
| Lifetime | **$39.99 one-time** | Run as limited offer at launch |

> **Recommended default**: Show annual plan first. Lifetime offer only during launch window or sales events.

**RevenueCat** handles:
- App Store + Play Store subscriptions
- Entitlement checks (`isPro` flag)
- Restore purchases
- Analytics on conversion rates

---

## New Pro Features to Build

### 1. 📅 Phase Prediction Calendar
A 3-month calendar showing predicted phases in colour-coded bands.  
Free users see only the current week blurred out.

### 2. 💬 "How to Talk to Her" Tips *(highest value for men)*
Phase-specific conversation starters and things to avoid saying.  
Example for Luteal phase: *"Avoid asking her to make big decisions today. Instead, ask 'what do you need from me right now?'"*

### 3. 🎁 Gift & Date Ideas
Phase-aware suggestions:
- **Menstrual**: Comfort gifts (heating pad, her fav snack, cozy movie night)
- **Follicular**: Adventure dates, trying new things
- **Ovulatory**: Social events, dressing up, going out
- **Luteal**: Low-key at home, comfort food, spa night

### 4. 🌡️ Mood Predictor Card
A daily card on the dashboard: *"She may be feeling: energetic & social today"*  
Based purely on phase — no data collection from the woman.

### 5. 🔔 Smart Notifications (Pro)
- Period due in 3 days alert
- "She's ovulating this week" alert
- "Luteal phase starting — be extra patient" daily tip
- Custom reminder time picker

### 6. 📤 Data Export (PDF)
Monthly cycle summary exportable as PDF — useful for couples tracking fertility or medical appointments.

### 7. 🏠 Home Screen Widget
Small widget showing:
- Current phase + day number
- Days until next period
- One-line tip for today

---

## Pro Upgrade Screen Design

Show this screen at 3 trigger points:
1. When a free user tries to access a locked feature (paywall)
2. After the user logs their 4th cycle (engagement paywall)
3. In Settings as a persistent "Upgrade to Pro" card

**Upgrade screen must show:**
- Clear benefit list (not features, but outcomes: *"Never be caught off guard again"*)
- Annual plan as the default selected option
- Social proof once you have reviews
- Restore purchases link

---

## Implementation Priority Order

```
1. RevenueCat integration + isPro entitlement check
2. AdMob banner on Dashboard (free users only)  
3. Feature gating (history cap, symptom cap, guide sections)
4. Pro upgrade screen (paywall UI)
5. "How to talk to her" tips content (highest perceived value)
6. Gift & date ideas
7. Mood predictor card
8. Phase prediction calendar
9. Smart notification types
10. Home screen widget
11. PDF export
12. Interstitial + native ads
```

---

## Why This Works for KYW Specifically

- **Zero competition** in the "for men" niche — you own this positioning
- **Privacy angle** is a selling point, not a limitation — men will trust an app that doesn't mine their partner's data
- **Low price point** ($2.99/mo) removes friction — it's cheaper than one coffee
- **Gift & date ideas** are the killer pro feature — men will pay for this alone
- **Ad revenue covers Supabase costs** while subscriptions become profit

---

## Tech Stack for Monetization

| Tool | Purpose |
|---|---|
| `revenue_cat` (Flutter SDK) | Subscription management, entitlement checks |
| `google_mobile_ads` | AdMob banner, interstitial, native ads |
| `purchases_flutter` | RevenueCat Flutter package |
| Supabase `profiles` table | Store `is_pro` flag synced from RevenueCat webhooks |
| RevenueCat Dashboard | Conversion analytics, A/B test pricing |

---

## Next Steps to Discuss

1. Do you want to start with **RevenueCat integration** or **AdMob** first?
2. Which Pro features do you want to build first?
3. Do you want me to design the **Pro upgrade screen** UI?
4. Should we discuss the **feature gating code pattern** (how to check `isPro` everywhere cleanly)?
