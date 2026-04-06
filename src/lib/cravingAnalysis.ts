export interface CravingUserData {
  sleepHours: number;
  steps: number;
  waterIntake: number;
  mood: "low" | "normal" | "good";
}

export interface CravingAnalysisResult {
  craving: string;
  reasons: string[];
  whyThisCraving: string;
  activitySuggestion: string;
  foodSuggestion: string;
}

function normalizeCraving(craving: string): "sweet" | "salty" | "spicy" | "junk" | "other" {
  const key = craving.toLowerCase().trim();
  if (key.includes("sweet") || key.includes("chocolate") || key.includes("cake") || key.includes("ice cream")) return "sweet";
  if (key.includes("salty") || key.includes("chips")) return "salty";
  if (key.includes("spicy")) return "spicy";
  if (key.includes("junk") || key.includes("pizza") || key.includes("burger") || key.includes("fries")) return "junk";
  return "other";
}

export function getActivitySuggestion(craving: string): string {
  const type = normalizeCraving(craving);
  if (type === "sweet") return "Take a short 5-minute walk, then drink water and wait 10 minutes before deciding.";
  if (type === "salty") return "Do 5-minute stretching or light yoga to reset cravings, then hydrate.";
  if (type === "spicy") return "Try deep breathing with a short walk to reduce stress-driven spicy cravings.";
  if (type === "junk") return "Drink water, walk for 5 minutes, and re-check hunger after 10 minutes.";
  return "Take a short walk or light yoga, then drink water and wait 10 minutes.";
}

export function getFoodSuggestion(craving: string): string {
  const key = craving.toLowerCase().trim();

  if (key.includes("sweet")) {
    return "Have fruit with peanut butter or a small piece of dark chocolate instead of sugary snacks.";
  }
  if (key.includes("salty")) {
    return "Try roasted nuts or lightly salted seeds instead of processed salty snacks.";
  }
  if (key.includes("spicy")) {
    return "Try a light homemade spicy option, like roasted chickpeas or grilled veggies with chili-lime seasoning.";
  }
  if (key.includes("junk") || key.includes("pizza") || key.includes("burger") || key.includes("fries")) {
    return "If you eat it, keep a smaller portion and add protein or a side salad.";
  }

  return "If you eat this craving, keep portions mindful and pair it with protein or fiber.";
}

export function analyzeCraving(userData: CravingUserData, craving: string): CravingAnalysisResult {
  const reasons: string[] = [];
  const type = normalizeCraving(craving);

  if (userData.sleepHours < 6) reasons.push("Low sleep");
  if (userData.steps < 4000) reasons.push("Low activity");
  if (userData.waterIntake < 2) reasons.push("Low hydration");
  if (userData.mood === "low") reasons.push("Emotional craving");

  const cravingContext =
    type === "sweet" ? "a quick energy dip" :
    type === "salty" ? "electrolyte or stress cues" :
    type === "spicy" ? "stress stimulation" :
    type === "junk" ? "habit-driven comfort patterns" :
    "a temporary preference";

  const whyThisCraving = reasons.length > 0
    ? `You may be craving this due to ${reasons.map(r => r.toLowerCase()).join(" and ")} with ${cravingContext}.`
    : `Your current routine looks balanced; this may be ${cravingContext}.`;

  return {
    craving: craving.toLowerCase().trim(),
    reasons,
    whyThisCraving,
    activitySuggestion: getActivitySuggestion(craving),
    foodSuggestion: getFoodSuggestion(craving),
  };
}
