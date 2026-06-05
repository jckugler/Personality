import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import type { StyleColor } from "@/lib/types";

type DataRequest = {
  action: string;
  payload?: Record<string, unknown>;
};

type CreateParticipantPayload = {
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

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  const body = (await request.json()) as DataRequest;
  const sql = neon(process.env.DATABASE_URL);

  try {
    await ensureSchema(sql);

    switch (body.action) {
      case "createTeam":
        return json(await createTeam(sql, body.payload));
      case "getTeamByInvite":
        return json(await getTeamByInvite(sql, body.payload));
      case "listTeams":
        return json(await listTeams(sql));
      case "findParticipantsByEmail":
        return json(await findParticipantsByEmail(sql, body.payload));
      case "listTeamsForEmail":
        return json(await listTeamsForEmail(sql, body.payload));
      case "listParticipants":
        return json(await listParticipants(sql, body.payload));
      case "createParticipant":
        return json(await createParticipant(sql, body.payload as CreateParticipantPayload));
      case "addProfileToTeam":
        return json(await addProfileToTeam(sql, body.payload));
      case "deleteParticipant":
        await deleteParticipant(sql, body.payload);
        return json(null);
      default:
        return NextResponse.json({ error: "Unknown data action." }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Database request failed." },
      { status: 500 }
    );
  }
}

function json(data: unknown) {
  return NextResponse.json({ data });
}

async function ensureSchema(sql: ReturnType<typeof neon>) {
  await sql`create extension if not exists "pgcrypto"`;

  await sql`
    create table if not exists teams (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      manager_name text not null,
      manager_email text not null,
      invite_code text not null unique,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists participants (
      id uuid primary key default gen_random_uuid(),
      team_id uuid not null references teams(id) on delete cascade,
      name text not null,
      email text not null,
      is_manager boolean not null default false,
      red_score integer not null default 0,
      yellow_score integer not null default 0,
      green_score integer not null default 0,
      blue_score integer not null default 0,
      x_coord numeric not null default 0,
      y_coord numeric not null default 0,
      created_at timestamptz not null default now()
    )
  `;

  await sql`
    create table if not exists responses (
      id uuid primary key default gen_random_uuid(),
      participant_id uuid not null references participants(id) on delete cascade,
      question_id integer not null,
      answer_value integer not null,
      color text not null check (color in ('Red', 'Yellow', 'Green', 'Blue')),
      created_at timestamptz not null default now()
    )
  `;

  await sql`create index if not exists participants_team_id_idx on participants(team_id)`;
  await sql`create index if not exists participants_email_idx on participants(lower(email))`;
  await sql`create index if not exists responses_participant_id_idx on responses(participant_id)`;
}

async function createTeam(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  const inviteCode = makeInviteCode();
  const rows = await sql`
    insert into teams (name, manager_name, manager_email, invite_code)
    values (${String(payload?.name ?? "")}, ${String(payload?.managerName ?? "")}, ${String(payload?.managerEmail ?? "")}, ${inviteCode})
    returning *
  `;

  return rows[0];
}

async function getTeamByInvite(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  const rows = await sql`
    select * from teams
    where invite_code = ${String(payload?.inviteCode ?? "")}
    limit 1
  `;

  return rows[0] ?? null;
}

async function listTeams(sql: ReturnType<typeof neon>) {
  return sql`select * from teams order by created_at desc`;
}

async function findParticipantsByEmail(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  return sql`
    select * from participants
    where lower(email) = ${String(payload?.email ?? "").trim().toLowerCase()}
    order by created_at asc
  `;
}

async function listTeamsForEmail(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  return sql`
    select distinct teams.*
    from teams
    inner join participants on participants.team_id = teams.id
    where lower(participants.email) = ${String(payload?.email ?? "").trim().toLowerCase()}
    order by teams.created_at desc
  `;
}

async function listParticipants(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  return sql`
    select * from participants
    where team_id = ${String(payload?.teamId ?? "")}
    order by created_at asc
  `;
}

async function createParticipant(sql: ReturnType<typeof neon>, payload: CreateParticipantPayload) {
  const participantRows = await sql`
    insert into participants (
      team_id,
      name,
      email,
      is_manager,
      red_score,
      yellow_score,
      green_score,
      blue_score,
      x_coord,
      y_coord
    )
    values (
      ${payload.teamId},
      ${payload.name},
      ${payload.email.trim().toLowerCase()},
      ${payload.isManager},
      ${payload.scores.Red},
      ${payload.scores.Yellow},
      ${payload.scores.Green},
      ${payload.scores.Blue},
      ${payload.x},
      ${payload.y}
    )
    returning *
  `;
  const participant = participantRows[0];

  for (const response of payload.responses) {
    await sql`
      insert into responses (participant_id, question_id, answer_value, color)
      values (${participant.id}, ${response.question_id}, ${response.answer_value}, ${response.color})
    `;
  }

  return participant;
}

async function addProfileToTeam(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  const teamId = String(payload?.teamId ?? "");
  const profile = payload?.profile as {
    name: string;
    email: string;
    is_manager: boolean;
    red_score: number;
    yellow_score: number;
    green_score: number;
    blue_score: number;
    x_coord: number;
    y_coord: number;
  };

  const existing = await sql`
    select * from participants
    where team_id = ${teamId}
      and lower(email) = ${profile.email.trim().toLowerCase()}
    limit 1
  `;

  if (existing[0]) return existing[0];

  return createParticipant(sql, {
    teamId,
    name: profile.name,
    email: profile.email,
    isManager: profile.is_manager,
    scores: {
      Red: Number(profile.red_score),
      Yellow: Number(profile.yellow_score),
      Green: Number(profile.green_score),
      Blue: Number(profile.blue_score)
    },
    x: Number(profile.x_coord),
    y: Number(profile.y_coord),
    responses: []
  });
}

async function deleteParticipant(sql: ReturnType<typeof neon>, payload?: Record<string, unknown>) {
  await sql`delete from participants where id = ${String(payload?.participantId ?? "")}`;
}

function makeInviteCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
