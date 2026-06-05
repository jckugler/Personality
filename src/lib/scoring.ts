import { styleSummaries } from "./styles";
import type { QuizQuestion, Scores, StyleColor } from "./types";

export type CompletedAnswer = {
  questionId: number;
  answerIndex: number;
};

export type QuizResult = {
  scores: Scores;
  primary: StyleColor;
  secondary: StyleColor;
  x: number;
  y: number;
};

const emptyScores: Scores = {
  Red: 0,
  Yellow: 0,
  Green: 0,
  Blue: 0
};

export function scoreQuiz(questions: QuizQuestion[], answers: CompletedAnswer[]): QuizResult {
  const scores: Scores = { ...emptyScores };

  for (const answer of answers) {
    const question = questions.find((item) => item.id === answer.questionId);
    const selected = question?.answers[answer.answerIndex];
    if (selected) {
      scores[selected.color] += selected.value;
    }
  }

  const ranked = (Object.entries(scores) as [StyleColor, number][]).sort((a, b) => b[1] - a[1]);
  const primary = ranked[0][0];
  const secondary = ranked[1][0];
  const total = Math.max(answers.length, 1);
  const x = clampCoordinate(((scores.Red + scores.Yellow - scores.Green - scores.Blue) / total) * 100);
  const y = clampCoordinate(((scores.Red + scores.Blue - scores.Yellow - scores.Green) / total) * 100);

  return { scores, primary, secondary, x, y };
}

export function responseRows(questions: QuizQuestion[], answers: CompletedAnswer[]) {
  return answers.flatMap((answer) => {
    const question = questions.find((item) => item.id === answer.questionId);
    const selected = question?.answers[answer.answerIndex];
    if (!selected) return [];

    return {
      question_id: answer.questionId,
      answer_value: selected.value,
      color: selected.color
    };
  });
}

export function participantScores(participant: {
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
}) {
  return {
    Red: participant.red_score,
    Yellow: participant.yellow_score,
    Green: participant.green_score,
    Blue: participant.blue_score
  } satisfies Scores;
}

export function participantPrimary(participant: {
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
}) {
  return rankScores(participantScores(participant))[0];
}

export function participantSecondary(participant: {
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
}) {
  return rankScores(participantScores(participant))[1];
}

export function participantCoordinates(participant: {
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
}) {
  const scores = participantScores(participant);
  const total = Math.max(scores.Red + scores.Yellow + scores.Green + scores.Blue, 1);

  return {
    x: clampCoordinate(((scores.Red + scores.Yellow - scores.Green - scores.Blue) / total) * 100),
    y: clampCoordinate(((scores.Red + scores.Blue - scores.Yellow - scores.Green) / total) * 100)
  };
}

export function styleBrief(primary: StyleColor, secondary: StyleColor) {
  return `${styleSummaries[primary].short}; supported by ${secondary.toLowerCase()} tendencies.`;
}

function rankScores(scores: Scores) {
  return (Object.entries(scores) as [StyleColor, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);
}

function clampCoordinate(value: number) {
  return Math.max(-100, Math.min(100, Math.round(value)));
}
