import { getSupabaseBrowserClient } from "./supabase";
import type { Participant, ResponseRecord, StyleColor, Team } from "./types";

type CreateTeamInput = {
  name: string;
  managerName: string;
  managerEmail: string;
};

type CreateParticipantInput = {
  teamId: string;
  name: string;
  email: string;
  isManager: boolean;
  scores: Record<StyleColor, number>;
  x: number;
  y: number;
  responses: Array<{
    question_id: number;
    answer_value: number;
    color: StyleColor;
  }>;
};

type AddProfileToTeamInput = {
  teamId: string;
  profile: Participant;
};

const teamKey = "tcm:teams";
const participantKey = "tcm:participants";
const responseKey = "tcm:responses";

export async function createTeam(input: CreateTeamInput) {
  const inviteCode = makeInviteCode();
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("teams")
      .insert({
        name: input.name,
        manager_name: input.managerName,
        manager_email: input.managerEmail,
        invite_code: inviteCode
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as Team;
  }

  const team: Team = {
    id: crypto.randomUUID(),
    name: input.name,
    manager_name: input.managerName,
    manager_email: input.managerEmail,
    invite_code: inviteCode,
    created_at: new Date().toISOString()
  };
  writeLocal(teamKey, [...readLocal<Team>(teamKey), team]);
  return team;
}

export async function getTeamByInvite(inviteCode: string) {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("invite_code", inviteCode)
      .single();

    if (error) return null;
    return data as Team;
  }

  return readLocal<Team>(teamKey).find((team) => team.invite_code === inviteCode) ?? null;
}

export async function listTeams() {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase.from("teams").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Team[];
  }

  return readLocal<Team>(teamKey).sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function findParticipantsByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .ilike("email", normalizedEmail)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return normalizeParticipants(data ?? []);
  }

  return readLocal<Participant>(participantKey)
    .filter((participant) => participant.email.toLowerCase() === normalizedEmail)
    .map(normalizeParticipant);
}

export async function listTeamsForEmail(email: string) {
  const [teams, participants] = await Promise.all([listTeams(), findParticipantsByEmail(email)]);
  const teamIds = new Set(participants.map((participant) => participant.team_id));
  return teams.filter((team) => teamIds.has(team.id));
}

export async function listParticipants(teamId: string) {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .select("*")
      .eq("team_id", teamId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return normalizeParticipants(data ?? []);
  }

  return readLocal<Participant>(participantKey)
    .filter((participant) => participant.team_id === teamId)
    .map(normalizeParticipant);
}

export async function createParticipant(input: CreateParticipantInput) {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("participants")
      .insert({
        team_id: input.teamId,
        name: input.name,
        email: input.email,
        is_manager: input.isManager,
        red_score: input.scores.Red,
        yellow_score: input.scores.Yellow,
        green_score: input.scores.Green,
        blue_score: input.scores.Blue,
        x_coord: input.x,
        y_coord: input.y
      })
      .select("*")
      .single();

    if (error) throw error;

    if (input.responses.length) {
      const { error: responseError } = await supabase.from("responses").insert(
        input.responses.map((response) => ({
          ...response,
          participant_id: data.id
        }))
      );
      if (responseError) throw responseError;
    }

    return normalizeParticipant(data);
  }

  const participant: Participant = {
    id: crypto.randomUUID(),
    team_id: input.teamId,
    name: input.name,
    email: input.email,
    is_manager: input.isManager,
    red_score: input.scores.Red,
    yellow_score: input.scores.Yellow,
    green_score: input.scores.Green,
    blue_score: input.scores.Blue,
    x_coord: input.x,
    y_coord: input.y,
    created_at: new Date().toISOString()
  };
  const responses: ResponseRecord[] = input.responses.map((response) => ({
    id: crypto.randomUUID(),
    participant_id: participant.id,
    question_id: response.question_id,
    answer_value: response.answer_value,
    color: response.color,
    created_at: new Date().toISOString()
  }));

  writeLocal(participantKey, [...readLocal<Participant>(participantKey), participant]);
  writeLocal(responseKey, [...readLocal<ResponseRecord>(responseKey), ...responses]);

  return participant;
}

export async function addProfileToTeam(input: AddProfileToTeamInput) {
  const existing = (await listParticipants(input.teamId)).find(
    (participant) => participant.email.toLowerCase() === input.profile.email.toLowerCase()
  );

  if (existing) return existing;

  return createParticipant({
    teamId: input.teamId,
    name: input.profile.name,
    email: input.profile.email,
    isManager: input.profile.is_manager,
    scores: {
      Red: input.profile.red_score,
      Yellow: input.profile.yellow_score,
      Green: input.profile.green_score,
      Blue: input.profile.blue_score
    },
    x: input.profile.x_coord,
    y: input.profile.y_coord,
    responses: []
  });
}

export async function deleteParticipant(participantId: string) {
  const supabase = getSupabaseBrowserClient();

  if (supabase) {
    const { error } = await supabase.from("participants").delete().eq("id", participantId);
    if (error) throw error;
    return;
  }

  writeLocal(
    participantKey,
    readLocal<Participant>(participantKey).filter((participant) => participant.id !== participantId)
  );
  writeLocal(
    responseKey,
    readLocal<ResponseRecord>(responseKey).filter((response) => response.participant_id !== participantId)
  );
}

function readLocal<T>(key: string) {
  if (typeof window === "undefined") return [] as T[];

  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [] as T[];
  }
}

function writeLocal<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function normalizeParticipants(participants: Participant[]) {
  return participants.map(normalizeParticipant);
}

function normalizeParticipant(participant: Participant) {
  return {
    ...participant,
    red_score: Number(participant.red_score),
    yellow_score: Number(participant.yellow_score),
    green_score: Number(participant.green_score),
    blue_score: Number(participant.blue_score),
    x_coord: Number(participant.x_coord),
    y_coord: Number(participant.y_coord)
  };
}
