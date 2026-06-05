import type { StyleColor } from "./types";

export type CommunicationTipSection = {
  title: string;
  items: string[];
};

export type CommunicationCoaching = {
  headline: string;
  sections: CommunicationTipSection[];
};

const targetGuidance: Record<StyleColor, CommunicationTipSection[]> = {
  Red: [
    {
      title: "Begin meetings",
      items: [
        "Open with the goal, decision needed, and time limit.",
        "Start with the headline before adding background.",
        "Name what success looks like by the end of the conversation."
      ]
    },
    {
      title: "Give feedback",
      items: [
        "Be specific about the behavior, impact, and expected change.",
        "Keep the tone respectful but crisp; avoid over-softening the point.",
        "End with owner, deadline, and follow-up plan."
      ]
    },
    {
      title: "Ask questions or status",
      items: [
        "Ask for the current state, blocker, and next move.",
        "Use direct questions like: What decision do you need from me?",
        "Offer options if they need a quick choice."
      ]
    },
    {
      title: "Watch outs",
      items: [
        "Long setup before the point can feel like wasted time.",
        "Vague accountability will frustrate them.",
        "Do not mistake their speed for lack of care."
      ]
    }
  ],
  Yellow: [
    {
      title: "Begin meetings",
      items: [
        "Start with the purpose and why it matters to people.",
        "Create a little room for ideas before narrowing the path.",
        "Keep the energy warm, clear, and forward-moving."
      ]
    },
    {
      title: "Give feedback",
      items: [
        "Connect the feedback to impact, growth, and team momentum.",
        "Be clear about the change needed without sounding cold.",
        "Invite their ideas for how to improve, then lock in next steps."
      ]
    },
    {
      title: "Ask questions or status",
      items: [
        "Ask what is moving, what needs attention, and who should be looped in.",
        "Let them explain context, then summarize the concrete action.",
        "Confirm the follow-up so the conversation does not stay broad."
      ]
    },
    {
      title: "Watch outs",
      items: [
        "A purely transactional tone can shut them down.",
        "Cutting off ideas too early may read as dismissal.",
        "Make sure enthusiasm turns into ownership."
      ]
    }
  ],
  Green: [
    {
      title: "Begin meetings",
      items: [
        "Start calmly with context, purpose, and what you need from them.",
        "Give them a moment to process before pushing for a fast answer.",
        "Acknowledge people, workload, or trust impacts early."
      ]
    },
    {
      title: "Give feedback",
      items: [
        "Make it private, specific, and steady.",
        "Explain the impact without making it feel personal.",
        "Ask what support or clarity would help them follow through."
      ]
    },
    {
      title: "Ask questions or status",
      items: [
        "Ask what is on track, what feels at risk, and what support is needed.",
        "Use a calm check-in instead of sudden pressure.",
        "Clarify next steps so care does not turn into ambiguity."
      ]
    },
    {
      title: "Watch outs",
      items: [
        "Abrupt urgency can create resistance or silence.",
        "Public surprises can damage trust quickly.",
        "Do not assume quiet agreement means real alignment."
      ]
    }
  ],
  Blue: [
    {
      title: "Begin meetings",
      items: [
        "Open with the question to solve, facts available, and criteria for a good answer.",
        "Separate what is known from what is still assumed.",
        "Give them room to ask clarifying questions."
      ]
    },
    {
      title: "Give feedback",
      items: [
        "Use examples, standards, and observable impact.",
        "Be precise about what needs to change and how quality will be measured.",
        "Give them time to think before asking for a final commitment."
      ]
    },
    {
      title: "Ask questions or status",
      items: [
        "Ask for progress, evidence, risks, and the confidence level.",
        "Use questions like: What changed since the last update?",
        "Invite them to flag quality concerns before they become rework."
      ]
    },
    {
      title: "Watch outs",
      items: [
        "Rushing past details may make them less confident.",
        "Ambiguous standards create friction.",
        "Too much hype without evidence can make them skeptical."
      ]
    }
  ]
};

const pairAdjustments: Record<StyleColor, Record<StyleColor, string[]>> = {
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
  return {
    headline: `${from} communicating with ${to}`,
    sections: [
      {
        title: "Adjust your style",
        items: pairAdjustments[from][to]
      },
      ...targetGuidance[to]
    ]
  } satisfies CommunicationCoaching;
}
