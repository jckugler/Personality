import { questions } from "./questions";

export const mixedQuestions = questions.map((question) => ({
  ...question,
  answers: shuffleByQuestion(question.answers, question.id)
}));

function shuffleByQuestion<T>(items: T[], seed: number) {
  return items
    .map((item, index) => ({ item, order: seededOrder(seed, index) }))
    .sort((a, b) => a.order - b.order)
    .map(({ item }) => item);
}

function seededOrder(seed: number, index: number) {
  const value = Math.sin(seed * 91.7 + index * 37.3) * 10000;
  return value - Math.floor(value);
}
