import type { StyleColor } from "./types";

const pairTips: Record<StyleColor, Record<StyleColor, string[]>> = {
  Red: {
    Red: [
      "Be direct, but do not turn the conversation into a contest.",
      "Name the decision, then leave room for their point of view.",
      "Agree on ownership and timing before you leave the conversation."
    ],
    Yellow: [
      "Start with the purpose and why the work matters before jumping to orders.",
      "Let them contribute ideas, then narrow the path together.",
      "Keep your directness warm so it does not read as dismissal."
    ],
    Green: [
      "Slow down and explain the context before pushing for action.",
      "Make the ask specific, calm, and private when possible.",
      "Check how the change affects people, workload, and trust."
    ],
    Blue: [
      "Bring facts, criteria, and examples instead of only urgency.",
      "Give them time to examine risks before forcing a decision.",
      "Separate what must move fast from what still needs precision."
    ]
  },
  Yellow: {
    Red: [
      "Lead with the outcome before exploring possibilities.",
      "Keep the conversation energetic but focused on the decision needed.",
      "Avoid adding too many side ideas once they are ready to act."
    ],
    Yellow: [
      "Use the energy, then create a clear next step before the momentum scatters.",
      "Make space for ideas without losing the original purpose.",
      "Confirm who owns what after the conversation."
    ],
    Green: [
      "Dial down the pace and give them room to process.",
      "Balance enthusiasm with reassurance about support and impact.",
      "Avoid treating hesitation as negativity."
    ],
    Blue: [
      "Bring structure to your ideas: facts, options, and a recommendation.",
      "Avoid overselling before they see the reasoning.",
      "Pause for questions and let them test assumptions."
    ]
  },
  Green: {
    Red: [
      "Get to the point sooner than feels natural.",
      "State the decision or request clearly, then add context.",
      "Avoid cushioning the message so much that the action becomes unclear."
    ],
    Yellow: [
      "Add warmth and possibility, not only risk or caution.",
      "Invite their ideas before moving into practical constraints.",
      "Keep the tone optimistic while still naming boundaries."
    ],
    Green: [
      "Create a calm, respectful space and be clear about what support is needed.",
      "Do not avoid the hard point just to preserve comfort.",
      "Agree on a practical next step so the conversation does not stay abstract."
    ],
    Blue: [
      "Bring details and standards, not only relational context.",
      "Give them time to think before asking for agreement.",
      "Use examples to make concerns concrete."
    ]
  },
  Blue: {
    Red: [
      "Start with the recommendation before walking through all the analysis.",
      "Keep details available, but do not make them earn the headline.",
      "Translate risk into clear options and action."
    ],
    Yellow: [
      "Open with the bigger purpose, not only the data.",
      "Leave room for discussion and creative input.",
      "Avoid sounding like every idea needs a proof packet before it can breathe."
    ],
    Green: [
      "Use a calm tone and explain how the details affect people.",
      "Do not overwhelm them with critique before establishing support.",
      "Give them time to process and ask what would make the plan workable."
    ],
    Blue: [
      "Share evidence and criteria, then move toward a decision.",
      "Watch for over-analysis when the next step is already clear.",
      "Agree on what level of precision is enough for now."
    ]
  }
};

export function communicationTips(from: StyleColor, to: StyleColor) {
  return pairTips[from][to];
}
