export type StyleColor = "Red" | "Yellow" | "Green" | "Blue";

export type Scores = Record<StyleColor, number>;

export type Team = {
  id: string;
  name: string;
  manager_name: string;
  manager_email: string;
  invite_code: string;
  created_at: string;
};

export type Participant = {
  id: string;
  team_id: string;
  name: string;
  email: string;
  is_manager: boolean;
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
  x_coord: number;
  y_coord: number;
  created_at: string;
};

export type ResponseRecord = {
  id: string;
  participant_id: string;
  question_id: number;
  answer_value: number;
  color: StyleColor;
  created_at: string;
};

export type QuizAnswer = {
  label: string;
  color: StyleColor;
  value: number;
};

export type QuizQuestion = {
  id: number;
  prompt: string;
  answers: QuizAnswer[];
};

export type StyleSummary = {
  label: StyleColor;
  short: string;
  description: string;
  preferences: string[];
  avoid: string[];
  colorClass: string;
  hex: string;
};
