import type { QuizQuestion } from "./types";

export const questions: QuizQuestion[] = [
  {
    id: 1,
    prompt: "When a project starts to drift, what are you most likely to do first?",
    answers: [
      { label: "Set a clear decision point and assign owners.", color: "Red", value: 1 },
      { label: "Gather the group to rebuild energy and ideas.", color: "Yellow", value: 1 },
      { label: "Check in with people to understand friction.", color: "Green", value: 1 },
      { label: "Review the plan, data, and dependencies.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 2,
    prompt: "In a meeting, you feel most useful when you can:",
    answers: [
      { label: "Move the room toward a decision.", color: "Red", value: 1 },
      { label: "Build on ideas and encourage participation.", color: "Yellow", value: 1 },
      { label: "Notice concerns and keep the tone constructive.", color: "Green", value: 1 },
      { label: "Clarify assumptions and improve the quality of thinking.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 3,
    prompt: "A teammate sends a long, unclear update. You prefer to respond by:",
    answers: [
      { label: "Asking for the headline and the decision needed.", color: "Red", value: 1 },
      { label: "Suggesting a quick conversation to find the thread.", color: "Yellow", value: 1 },
      { label: "Acknowledging the effort and asking gentle clarifying questions.", color: "Green", value: 1 },
      { label: "Organizing the update into facts, risks, and open items.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 4,
    prompt: "When you receive feedback, what helps you hear it best?",
    answers: [
      { label: "Specific examples and a direct ask.", color: "Red", value: 1 },
      { label: "A positive tone with room to discuss possibilities.", color: "Yellow", value: 1 },
      { label: "Privacy, care, and enough time to process.", color: "Green", value: 1 },
      { label: "Evidence, criteria, and a clear standard.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 5,
    prompt: "A deadline is at risk. Your instinct is to:",
    answers: [
      { label: "Narrow scope and push for the most important outcome.", color: "Red", value: 1 },
      { label: "Rally people and look for a creative path through.", color: "Yellow", value: 1 },
      { label: "Protect the team from overload while adjusting expectations.", color: "Green", value: 1 },
      { label: "Recalculate the timeline and isolate the constraint.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 6,
    prompt: "Which message opening feels most natural to you?",
    answers: [
      { label: "Here is the decision we need to make.", color: "Red", value: 1 },
      { label: "I have an idea that could unlock this.", color: "Yellow", value: 1 },
      { label: "I want to make sure this works for everyone affected.", color: "Green", value: 1 },
      { label: "Here is what the evidence is telling us.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 7,
    prompt: "When priorities conflict, you tend to value:",
    answers: [
      { label: "Speed and ownership.", color: "Red", value: 1 },
      { label: "Momentum and shared excitement.", color: "Yellow", value: 1 },
      { label: "Stability and trust.", color: "Green", value: 1 },
      { label: "Accuracy and consistency.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 8,
    prompt: "A new idea is proposed late in the process. You are likely to ask:",
    answers: [
      { label: "What result would this improve, and by when?", color: "Red", value: 1 },
      { label: "What would make this exciting for the team or customer?", color: "Yellow", value: 1 },
      { label: "Who would be affected if we changed direction?", color: "Green", value: 1 },
      { label: "What evidence supports changing the plan now?", color: "Blue", value: 1 }
    ]
  },
  {
    id: 9,
    prompt: "You prefer written updates that are:",
    answers: [
      { label: "Brief, action-oriented, and explicit.", color: "Red", value: 1 },
      { label: "Lively, human, and easy to respond to.", color: "Yellow", value: 1 },
      { label: "Considerate, contextual, and calm.", color: "Green", value: 1 },
      { label: "Structured, precise, and complete.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 10,
    prompt: "When conflict appears, your first helpful move is usually to:",
    answers: [
      { label: "Name the issue and define the decision path.", color: "Red", value: 1 },
      { label: "Get people talking openly again.", color: "Yellow", value: 1 },
      { label: "Lower the temperature and rebuild trust.", color: "Green", value: 1 },
      { label: "Separate facts from interpretations.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 11,
    prompt: "What makes a manager's request easiest for you to act on?",
    answers: [
      { label: "A clear outcome, deadline, and authority level.", color: "Red", value: 1 },
      { label: "A sense of purpose and visible enthusiasm.", color: "Yellow", value: 1 },
      { label: "Why it matters and how support will be available.", color: "Green", value: 1 },
      { label: "The requirements, constraints, and success criteria.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 12,
    prompt: "In planning work, you naturally focus on:",
    answers: [
      { label: "Milestones and accountable owners.", color: "Red", value: 1 },
      { label: "Opportunities to make the work engaging.", color: "Yellow", value: 1 },
      { label: "Team capacity and handoffs.", color: "Green", value: 1 },
      { label: "Risks, sequence, and definitions.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 13,
    prompt: "A stakeholder challenges your recommendation. You prefer to:",
    answers: [
      { label: "Defend the recommendation and clarify the tradeoff.", color: "Red", value: 1 },
      { label: "Explore their reaction and look for a better angle.", color: "Yellow", value: 1 },
      { label: "Listen carefully and look for shared ground.", color: "Green", value: 1 },
      { label: "Walk through the reasoning and supporting details.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 14,
    prompt: "Which phrase sounds most like your working preference?",
    answers: [
      { label: "Let's make the call.", color: "Red", value: 1 },
      { label: "Let's open this up.", color: "Yellow", value: 1 },
      { label: "Let's make this workable.", color: "Green", value: 1 },
      { label: "Let's make this sound.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 15,
    prompt: "When a teammate is stuck, you are most likely to offer:",
    answers: [
      { label: "A direct path to unblock the work.", color: "Red", value: 1 },
      { label: "Encouragement and a few new ideas.", color: "Yellow", value: 1 },
      { label: "Patient support and a check on workload.", color: "Green", value: 1 },
      { label: "A framework for diagnosing the problem.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 16,
    prompt: "A change is announced with limited detail. You most want to know:",
    answers: [
      { label: "What decisions have been made and what happens next.", color: "Red", value: 1 },
      { label: "What possibilities this creates.", color: "Yellow", value: 1 },
      { label: "How people will be supported through it.", color: "Green", value: 1 },
      { label: "What information the change is based on.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 17,
    prompt: "Your preferred brainstorming environment is:",
    answers: [
      { label: "Time-boxed and tied to a decision.", color: "Red", value: 1 },
      { label: "Open, energetic, and interactive.", color: "Yellow", value: 1 },
      { label: "Inclusive, respectful, and unhurried.", color: "Green", value: 1 },
      { label: "Prepared, focused, and grounded in constraints.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 18,
    prompt: "When you have to say no, you prefer to:",
    answers: [
      { label: "Be clear about the decision and reason.", color: "Red", value: 1 },
      { label: "Offer another route or possibility.", color: "Yellow", value: 1 },
      { label: "Protect the relationship while being honest.", color: "Green", value: 1 },
      { label: "Explain the criteria that led to the answer.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 19,
    prompt: "A successful team conversation usually leaves you with:",
    answers: [
      { label: "Clear action and accountability.", color: "Red", value: 1 },
      { label: "Shared energy and fresh thinking.", color: "Yellow", value: 1 },
      { label: "Alignment and trust.", color: "Green", value: 1 },
      { label: "Better understanding and fewer unknowns.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 20,
    prompt: "When presenting work, you usually emphasize:",
    answers: [
      { label: "Impact, choices, and next steps.", color: "Red", value: 1 },
      { label: "Story, engagement, and possibility.", color: "Yellow", value: 1 },
      { label: "Context, people, and practical adoption.", color: "Green", value: 1 },
      { label: "Method, evidence, and quality.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 21,
    prompt: "A teammate misses a commitment. Your first question is closest to:",
    answers: [
      { label: "What needs to happen now to recover?", color: "Red", value: 1 },
      { label: "How can we get momentum back?", color: "Yellow", value: 1 },
      { label: "What got in the way for you?", color: "Green", value: 1 },
      { label: "Where did the estimate or process break down?", color: "Blue", value: 1 }
    ]
  },
  {
    id: 22,
    prompt: "You are most frustrated by communication that is:",
    answers: [
      { label: "Indirect or indecisive.", color: "Red", value: 1 },
      { label: "Flat or closed to new ideas.", color: "Yellow", value: 1 },
      { label: "Abrupt or dismissive.", color: "Green", value: 1 },
      { label: "Loose or unsupported.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 23,
    prompt: "When learning something new at work, you like to:",
    answers: [
      { label: "Try it quickly and adjust from results.", color: "Red", value: 1 },
      { label: "Talk it through and connect it to examples.", color: "Yellow", value: 1 },
      { label: "Practice with support and time.", color: "Green", value: 1 },
      { label: "Study the logic before applying it.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 24,
    prompt: "Which kind of recognition lands best for you?",
    answers: [
      { label: "Recognition for results and ownership.", color: "Red", value: 1 },
      { label: "Recognition that is enthusiastic and shared.", color: "Yellow", value: 1 },
      { label: "Recognition for reliability and care.", color: "Green", value: 1 },
      { label: "Recognition for quality and expertise.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 25,
    prompt: "If a process feels inefficient, you tend to:",
    answers: [
      { label: "Remove steps and push for action.", color: "Red", value: 1 },
      { label: "Reimagine how the experience could feel better.", color: "Yellow", value: 1 },
      { label: "Adjust it so people can follow it consistently.", color: "Green", value: 1 },
      { label: "Map where errors or waste are entering.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 26,
    prompt: "In a one-on-one with your manager, you appreciate:",
    answers: [
      { label: "Straight talk about priorities and progress.", color: "Red", value: 1 },
      { label: "A lively exchange about ideas and growth.", color: "Yellow", value: 1 },
      { label: "A supportive conversation with room for concerns.", color: "Green", value: 1 },
      { label: "Specific feedback with examples and reasoning.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 27,
    prompt: "A team norm you would protect is:",
    answers: [
      { label: "Decisions do not linger without an owner.", color: "Red", value: 1 },
      { label: "People have space to contribute ideas.", color: "Yellow", value: 1 },
      { label: "People are treated with patience and respect.", color: "Green", value: 1 },
      { label: "Information is accurate and easy to verify.", color: "Blue", value: 1 }
    ]
  },
  {
    id: 28,
    prompt: "When you leave a good planning session, you feel best when:",
    answers: [
      { label: "The path forward is decisive.", color: "Red", value: 1 },
      { label: "The team feels motivated.", color: "Yellow", value: 1 },
      { label: "The plan feels sustainable.", color: "Green", value: 1 },
      { label: "The details feel dependable.", color: "Blue", value: 1 }
    ]
  }
];
