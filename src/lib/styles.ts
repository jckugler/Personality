import type { StyleColor, StyleSummary } from "./types";

export const styleSummaries: Record<StyleColor, StyleSummary> = {
  Red: {
    label: "Red",
    short: "Direct and outcome-focused",
    description: "Prefers clear goals, crisp decisions, and visible progress.",
    preferences: [
      "Lead with the decision or outcome",
      "Use concise options and tradeoffs",
      "Name ownership and next steps"
    ],
    avoid: [
      "Long context before the point",
      "Unclear accountability",
      "Softening the message until it becomes vague"
    ],
    colorClass: "bg-redStyle",
    hex: "#d94a38"
  },
  Yellow: {
    label: "Yellow",
    short: "Collaborative and energizing",
    description: "Prefers momentum, possibility, and room for ideas with people.",
    preferences: [
      "Connect the topic to purpose and people",
      "Invite ideas before narrowing options",
      "Keep the tone warm and forward-moving"
    ],
    avoid: [
      "Overly dry detail without context",
      "Shutting down brainstorming too quickly",
      "Unexpectedly cold or transactional wording"
    ],
    colorClass: "bg-yellowStyle",
    hex: "#d8a51d"
  },
  Green: {
    label: "Green",
    short: "Steady and relationship-aware",
    description: "Prefers trust, clarity, and a measured pace that protects collaboration.",
    preferences: [
      "Give context and time to process",
      "Show how decisions affect people",
      "Use calm, specific requests"
    ],
    avoid: [
      "Abrupt pressure without explanation",
      "Public surprises",
      "Implying conflict is a personal failure"
    ],
    colorClass: "bg-greenStyle",
    hex: "#3f8f6b"
  },
  Blue: {
    label: "Blue",
    short: "Analytical and quality-focused",
    description: "Prefers evidence, precision, and thoughtful planning.",
    preferences: [
      "Bring facts, criteria, and examples",
      "Separate assumptions from knowns",
      "Allow space for questions and review"
    ],
    avoid: [
      "Rushing past important details",
      "Ambiguous standards",
      "Over-indexing on enthusiasm without evidence"
    ],
    colorClass: "bg-blueStyle",
    hex: "#366ac9"
  }
};

export function colorFromScores(scores: Record<StyleColor, number>, index: 0 | 1) {
  return (Object.entries(scores) as [StyleColor, number][])
    .sort((a, b) => b[1] - a[1])[index][0];
}
