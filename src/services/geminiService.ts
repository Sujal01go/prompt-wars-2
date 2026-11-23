import type {
  AirQualityTelemetry,
  PersonaProfile,
  DailySmogRoutine,
  DailySmogRoutineStep,
} from '../types/index.ts'
import { identifyGoldenWindow } from '../utils/dateUtils.ts'
import type { HourlyForecastItem } from '../types/index.ts'

export interface GenAiResponse {
  text: string
  routine?: DailySmogRoutine
  source: 'live-gemini' | 'offline-heuristic'
}

/**
 * Offline Heuristic GenAI Engine:
 * Generates an intelligent, context-aware hour-by-hour smog defense routine
 * even without an active internet connection or Gemini API key.
 */
export function generateOfflineHeuristicRoutine(
  persona: PersonaProfile,
  telemetry: AirQualityTelemetry,
  hourly: HourlyForecastItem[],
  city: string
): DailySmogRoutine {
  const goldenWindow = identifyGoldenWindow(hourly)

  const steps: DailySmogRoutineStep[] = [
    {
      time: '06:30 AM',
      period: 'Morning',
      title: 'Morning Awakening & Indoor Air Check',
      locationType: 'indoor',
      maskRequired: false,
      action:
        'Keep all doors and exterior windows firmly sealed. Morning temperature inversion is trapping nighttime exhaust at ground level.',
      guidance: `Verify indoor air purifier or DIY Corsi-Rosenthal box is running. ${
        persona.id === 'respiratory'
          ? 'Check peak expiratory flow rate (PEFR) and take prescribed maintenance inhaler.'
          : 'Drink 2 glasses of warm water to hydrate respiratory mucous membranes.'
      }`,
    },
    {
      time: '08:15 AM',
      period: 'Morning',
      title: 'Peak Commute & Transit Shield',
      locationType: 'transit',
      maskRequired: true,
      action:
        'Mandatory well-fitted N95 / FFP2 respirator with tight metallic nose clip pinch. No loose surgical or cloth masks.',
      guidance: `Outdoor PM2.5 is ${telemetry.pm25} µg/m³ (${telemetry.categoryLabel}). Use Metro rail or AC cabin with air recirculation strictly enabled. Avoid open two-wheeler or walking routes during morning smog trap.`,
    },
    {
      time: '01:00 PM',
      period: 'Midday',
      title: 'Golden Window Ventilation & Midday Flush',
      locationType: 'indoor',
      maskRequired: false,
      action: `Take advantage of Golden Window (${goldenWindow}). Solar radiation has broken the surface inversion cap.`,
      guidance:
        'Crack open two opposite windows for a rapid 10-15 minute cross-draft air flush to vent built-up indoor CO2, then re-seal and ramp air purifiers to High for 20 minutes.',
    },
    {
      time: '04:30 PM',
      period: 'Afternoon',
      title: 'Pre-Evening Activity & School/Work Wrap-Up',
      locationType: 'indoor',
      maskRequired: false,
      action:
        persona.id === 'athlete'
          ? 'Indoor aerobic conditioning only (treadmill or resistance workout next to HEPA filter). Cancel all outdoor track running.'
          : 'Complete all errands before evening rush hour when atmospheric cooling begins trapping vehicular emissions.',
      guidance: `Max outdoor exposure for ${persona.name} today is capped at ${persona.maxOutdoorMinutes} minutes under current AQI of ${telemetry.aqi}.`,
    },
    {
      time: '07:30 PM',
      period: 'Evening',
      title: 'Evening Commute & Decontamination',
      locationType: 'indoor',
      maskRequired: false,
      action:
        'Rinse face, eyes, and nasal passages with sterile saline wash or warm water to remove trapped soot particulate.',
      guidance:
        'Leave outdoor coats and shoes in the entryway to prevent dragging settled PM2.5 soot deeper into living quarters.',
    },
    {
      time: '10:00 PM',
      period: 'Night',
      title: 'Bedroom Micro-Climate Optimization',
      locationType: 'indoor',
      maskRequired: false,
      action:
        'Position Corsi-Rosenthal box or HEPA filter within 1.5 meters of bed headboard on Low/Whisper mode for continuous nocturnal air circulation.',
      guidance:
        'Maintain indoor humidity between 40-50% using a cool-mist humidifier to prevent dry, irritated bronchial membranes.',
    },
  ]

  const iaqChecklist = [
    'Place draft stoppers or damp towels at bottom of exterior entry doors',
    'Ensure all DIY Corsi-Rosenthal / HEPA units are running 24/7',
    'Wipe hard surfaces with damp microfiber cloths (avoid dry sweeping which kicks up settled PM10)',
    'Eliminate indoor combustion: NO incense, scented candles, mosquito coils, or unvented gas frying',
    'Maintain indoor relative humidity at 40-50% to prevent aerosol suspension',
  ]

  const dietaryAntioxidants = [
    'Vitamin C (Amla / Citrus fruits / Bell peppers) to reduce pulmonary oxidative stress',
    'Vitamin E (Almonds / Sunflower seeds / Spinach) to strengthen epithelial lining',
    'Curcumin & Warm Turmeric milk (Haldi Doodh) for bronchial anti-inflammatory relief',
    'Jaggery & Ginger infusion to clear accumulated particulate mucus',
  ]

  return {
    title: `AeroPulse Smog Defense Protocol — ${persona.name}`,
    date: new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    personaName: persona.name,
    city,
    predictedAvgAqi: telemetry.aqi,
    goldenVentilationWindow: goldenWindow,
    steps,
    iaqChecklist,
    dietaryAntioxidants,
  }
}

/**
 * Offline Heuristic Chatbot Engine:
 * Answers questions intelligently based on clinical protocols and AQI conditions.
 */
export function generateOfflineHeuristicAnswer(
  prompt: string,
  persona: PersonaProfile,
  telemetry: AirQualityTelemetry,
  hourly: HourlyForecastItem[],
  city: string
): GenAiResponse {
  const p = prompt.toLowerCase()
  const goldenWindow = identifyGoldenWindow(hourly)

  // 1. Question about Routine / Plan
  if (
    p.includes('routine') ||
    p.includes('plan') ||
    p.includes('schedule') ||
    p.includes('hour-by-hour') ||
    p.includes('survival')
  ) {
    const routine = generateOfflineHeuristicRoutine(persona, telemetry, hourly, city)
    return {
      text: `### 🛡️ Generated Tailored Smog Defense Protocol for **${persona.name}** in **${city}**

**Current Atmospheric State**: AQI **${telemetry.aqi}** (${telemetry.categoryLabel}) with **${telemetry.inversionRisk.toUpperCase()}** winter inversion risk. Dominant pollutant: **${telemetry.dominantPollutant.toUpperCase()}** at **${telemetry.pm25} µg/m³**.

I have structured a comprehensive 24-hour protocol designed specifically around **${persona.name}**'s physiological vulnerability profile:
- **Golden Ventilation Window**: **${goldenWindow}** (when the daytime sun weakens the cold ground-level inversion cap).
- **Outdoor Time Limit**: Maximum **${persona.maxOutdoorMinutes} minutes** total today.
- **Respiratory Barrier**: Certified **${persona.recommendedMask}** required for any outdoor or transit exposure.

*Review the detailed hour-by-hour timeline card below or export it directly to Markdown/Printable PDF.*`,
      routine,
      source: 'offline-heuristic',
    }
  }

  // 2. Question about DIY Air Purifiers / Corsi-Rosenthal
  if (
    p.includes('purifier') ||
    p.includes('corsi') ||
    p.includes('box fan') ||
    p.includes('merv') ||
    p.includes('hepa') ||
    p.includes('filter')
  ) {
    return {
      text: `### 🛠️ DIY Corsi-Rosenthal Box — High-CADR Low-Cost Defense

A **Corsi-Rosenthal (C-R) Box** provides equal or superior filtration compared to $500 commercial HEPA units at a fraction of the cost ($45-$65):

1. **Required Materials**:
   - One 20-inch box fan (e.g., Lasko ~2000 CFM).
   - Four MERV-13 pleated HVAC filters (20"x20"x1" or 20"x20"x2").
   - One roll of heavy-duty duct tape or HVAC foil tape.
   - The fan cardboard shipping box (for bottom base and top cardboard shroud).

2. **The "Cardboard Shroud" Secret**:
   - Cutting a circular cardboard shroud that covers the outer 1.5 inches of the fan face prevents back-flow air vortexes and boosts airflow efficiency by **20-30%**!

3. **Performance Metrics**:
   - **Clean Air Delivery Rate (CADR)**: ~450–600 CFM for fine submicron particles ($PM_{2.5}$).
   - In an average 250 sq ft living room (2,000 cu ft), this delivers **13.5 Air Changes Per Hour (ACH)**, dropping indoor PM2.5 by 90% in under 12 minutes!

4. **Maintenance**:
   - Under heavy winter smog in cities like ${city}, replace the 4 MERV-13 filters every 5–6 months.`,
      source: 'offline-heuristic',
    }
  }

  // 3. Question about Exercise / Sports / Outdoor safety
  if (
    p.includes('exercise') ||
    p.includes('run') ||
    p.includes('jog') ||
    p.includes('workout') ||
    p.includes('sport') ||
    p.includes('gym')
  ) {
    return {
      text: `### 🏃 Exercise & Smog Advisory for **${persona.name}** in ${city}

**Current Air Quality: AQI ${telemetry.aqi} (${telemetry.categoryLabel})**

1. **The Exercise Paradox**:
   - During aerobic exertion (running, cycling, football), minute ventilation skyrockets from resting $6\\text{ L/min}$ to **$60–100\\text{ L/min}$**.
   - You switch from nasal breathing to oral breathing, bypassing the upper nasal turbinates and driving fine particulates ($PM_{2.5}$) and diesel soot directly into your alveolar capillaries.

2. **Verdict for Today**:
   - **Outdoor Running/Cycling**: **STRICTLY CANCELLED**. Inhaling $PM_{2.5}$ at ${telemetry.pm25} µg/m³ during a 45-minute jog is equivalent to smoking ~${Math.max(2, Math.round(telemetry.pm25 / 15))} cigarettes in one hour.
   - **Indoor Safe Alternative**: Exercise indoors in a sealed room with a HEPA/Corsi-Rosenthal air cleaner running on high speed.
   - If outdoor walking is unavoidable, restrict it strictly to the **Golden Window (${goldenWindow})** with a sealed N95 mask.`,
      source: 'offline-heuristic',
    }
  }

  // 4. Question about Children & Schools
  if (
    p.includes('child') ||
    p.includes('kid') ||
    p.includes('school') ||
    p.includes('baby') ||
    p.includes('infant')
  ) {
    return {
      text: `### 👶 Pediatric Smog Protection Advisory

Children are disproportionately vulnerable to winter smog for three clinical reasons:
1. **Higher Respiratory Rate**: Children breathe roughly 50% more air per pound of body weight than adults.
2. **Developing Lung Alveoli**: 80% of human alveoli develop after birth; chronic smog exposure permanently stunts vital lung volume.
3. **Height Proximity**: Strollers and small children are physically closer to ground-level vehicle exhaust tailpipes.

**Action Plan for Parents**:
- **School Commute**: Ensure child wears a well-sealed, pediatric-sized N95 or KF94 mask. Ensure the nose clip is snugly contoured.
- **Physical Education**: Urge school administrators to move recess and P.E. indoors when AQI exceeds 150.
- **Saline Rinse**: Practice gentle saline gargle and eye wash after arriving home to clear deposited soot.
- **Hydration**: Ensure consistent warm fluid intake to keep the bronchial ciliary escalator moving mucus upward.`,
      source: 'offline-heuristic',
    }
  }

  // 5. Default General Response
  return {
    text: `### 🌬️ AeroPulse Smog Defense Intelligence

**Location**: ${city} | **Live AQI**: ${telemetry.aqi} (${telemetry.categoryLabel})
**Active Persona**: ${persona.name} (${persona.vulnerabilityLevel} Vulnerability)
**Atmospheric Inversion**: ${telemetry.inversionRisk.toUpperCase()} stagnation (${telemetry.stagnationIndex}/100)

**Key Recommendations**:
1. **Respiratory Barrier**: Wear a certified **${persona.recommendedMask}** for any outdoor transit today.
2. **Golden Window**: Best time for urgent outdoor movement is **${goldenWindow}**. Avoid early morning (6-9 AM) and late evening (7-11 PM) inversion peaks.
3. **Indoor Sanctuary**: Keep indoor doors and windows sealed. Operate a Corsi-Rosenthal box or HEPA unit near sleep and work zones.
4. **Impact Summary**: Breathing outdoor air in ${city} today delivers ~**${telemetry.pm25} µg/m³** of fine particulates, equivalent to smoking **~${Math.round(telemetry.pm25 / 22)} cigarettes** over 24 hours.

*Feel free to ask me to generate a personalized hour-by-hour routine, calculate commute exposure, or design a DIY air purifier!*`,
    source: 'offline-heuristic',
  }
}

/**
 * Main Gemini AI Orchestrator:
 * Attempts Live Google Gemini 2.5 Flash / 1.5 Flash API first,
 * falling back seamlessly to the Offline Heuristic GenAI Engine on network or key issues.
 */
export async function askGeminiAssistant(
  prompt: string,
  apiKey: string,
  persona: PersonaProfile,
  telemetry: AirQualityTelemetry,
  hourly: HourlyForecastItem[],
  city: string
): Promise<GenAiResponse> {
  // If no user API key is configured, immediately deliver Offline Heuristic Engine response
  if (!apiKey || apiKey.trim().length === 0) {
    return generateOfflineHeuristicAnswer(prompt, persona, telemetry, hourly, city)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 9000)

    const goldenWindow = identifyGoldenWindow(hourly)

    const systemPrompt = `You are AeroPulse AI, an expert clinical & environmental pulmonologist, urban air quality scientist, and winter smog defense assistant for Google PromptWars Challenge 6: Urban Air Quality Assistant.
CURRENT CONTEXT:
- City: ${city}
- Current US AQI: ${telemetry.aqi} (${telemetry.categoryLabel})
- PM2.5: ${telemetry.pm25} µg/m³ (WHO 24h standard: 15 µg/m³, which is ${Number((telemetry.pm25 / 15).toFixed(1))}x standard)
- Dominant Pollutant: ${telemetry.dominantPollutant.toUpperCase()}
- Weather: Temp ${telemetry.temperature}°C, Humidity ${telemetry.humidity}%, Wind ${telemetry.windSpeed} km/h
- Inversion Stagnation Index: ${telemetry.stagnationIndex}/100 (${telemetry.inversionRisk} risk)
- Golden Ventilation Window: ${goldenWindow}
- Active Persona: ${persona.name} (${persona.vulnerabilityLevel} vulnerability) - ${persona.description}
- Berkeley Earth Cigarette Inhalation Equivalent: ~${Number((telemetry.pm25 / 22).toFixed(1))} cigarettes/day

Provide compassionate, highly actionable, scientifically precise guidance. Use Markdown with clean headers, bullet points, and bold text. If the user asks for a routine or plan, detail an hour-by-hour morning-to-night plan.`

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
      apiKey.trim()
    )}`

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: `${systemPrompt}\n\nUSER QUESTION:\n${prompt}` },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      console.warn(`Gemini API returned status ${res.status}, falling back to Heuristic Engine`)
      return generateOfflineHeuristicAnswer(prompt, persona, telemetry, hourly, city)
    }

    const data = await res.json()
    const candidateText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || ''

    if (!candidateText) {
      return generateOfflineHeuristicAnswer(prompt, persona, telemetry, hourly, city)
    }

    const p = prompt.toLowerCase()
    let routine: DailySmogRoutine | undefined
    if (p.includes('routine') || p.includes('plan') || p.includes('schedule')) {
      routine = generateOfflineHeuristicRoutine(persona, telemetry, hourly, city)
    }

    return {
      text: candidateText,
      routine,
      source: 'live-gemini',
    }
  } catch (err) {
    console.warn('Gemini API call failed, using Offline Heuristic Engine', err)
    return generateOfflineHeuristicAnswer(prompt, persona, telemetry, hourly, city)
  }
}
