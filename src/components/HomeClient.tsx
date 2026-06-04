"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Plus, Users } from "lucide-react";
import { responseRows, scoreQuiz } from "@/lib/scoring";
import {
  addProfileToTeam,
  createParticipant,
  createTeam,
  findParticipantsByEmail,
  listTeams,
  listTeamsForEmail
} from "@/lib/storage";
import { mixedQuestions } from "@/lib/quizView";
import type { Participant, StyleColor, Team } from "@/lib/types";

type Step = "identity" | "quiz" | "team";

type Identity = {
  firstName: string;
  lastName: string;
  email: string;
};

export function HomeClient() {
  const [step, setStep] = useState<Step>("identity");
  const [identity, setIdentity] = useState<Identity>({ firstName: "", lastName: "", email: "" });
  const [existingProfiles, setExistingProfiles] = useState<Participant[]>([]);
  const [memberTeams, setMemberTeams] = useState<Team[]>([]);
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finishedProfile, setFinishedProfile] = useState<Participant | null>(null);
  const [error, setError] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const fullName = `${identity.firstName.trim()} ${identity.lastName.trim()}`.trim();
  const activeProfile = finishedProfile ?? existingProfiles[0] ?? null;
  const completedAnswers = useMemo(
    () =>
      mixedQuestions.flatMap((question) => {
        const answerIndex = answers[question.id];
        return typeof answerIndex === "number" ? [{ questionId: question.id, answerIndex }] : [];
      }),
    [answers]
  );
  const question = mixedQuestions[current];
  const progress = Math.round((completedAnswers.length / mixedQuestions.length) * 100);

  async function lookupPerson(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!identity.firstName.trim() || !identity.lastName.trim() || !identity.email.trim()) {
      setError("Add your first name, last name, and email.");
      return;
    }

    setIsWorking(true);
    try {
      const [profiles, teams, openTeams] = await Promise.all([
        findParticipantsByEmail(identity.email),
        listTeamsForEmail(identity.email),
        listTeams()
      ]);
      setExistingProfiles(profiles);
      setMemberTeams(teams);
      setAllTeams(openTeams);
      setSelectedTeamId(teams[0]?.id ?? "");
      setStep(profiles.length ? "team" : "quiz");
    } catch (lookupError) {
      setError(`Lookup failed: ${readErrorMessage(lookupError)}`);
    } finally {
      setIsWorking(false);
    }
  }

  async function finishQuiz() {
    setError("");
    if (completedAnswers.length !== mixedQuestions.length) {
      setError("Answer every question before continuing.");
      return;
    }

    const result = scoreQuiz(mixedQuestions, completedAnswers);
    const tempProfile: Participant = {
      id: "pending",
      team_id: "pending",
      name: fullName,
      email: identity.email.trim().toLowerCase(),
      is_manager: false,
      red_score: result.scores.Red,
      yellow_score: result.scores.Yellow,
      green_score: result.scores.Green,
      blue_score: result.scores.Blue,
      x_coord: result.x,
      y_coord: result.y,
      created_at: new Date().toISOString()
    };

    setFinishedProfile(tempProfile);
    setAllTeams(await listTeams());
    setStep("team");
  }

  async function addToMap() {
    setError("");
    if (!activeProfile) return;
    if (!selectedTeamId && !newTeamName.trim()) {
      setError("Choose an existing map or create a new team map.");
      return;
    }

    setIsWorking(true);
    try {
      const team =
        newTeamName.trim().length > 0
          ? await createTeam({
              name: newTeamName.trim(),
              managerName: fullName,
              managerEmail: identity.email.trim().toLowerCase()
            })
          : allTeams.find((item) => item.id === selectedTeamId);

      if (!team) throw new Error("Missing team");

      if (activeProfile.id === "pending") {
        const result = scoreQuiz(mixedQuestions, completedAnswers);
        await createParticipant({
          teamId: team.id,
          name: fullName,
          email: identity.email.trim().toLowerCase(),
          isManager: false,
          scores: result.scores,
          x: result.x,
          y: result.y,
          responses: responseRows(mixedQuestions, completedAnswers)
        });
      } else {
        await addProfileToTeam({ teamId: team.id, profile: activeProfile });
      }

      window.location.href = `/dashboard/${team.invite_code}?email=${encodeURIComponent(identity.email.trim().toLowerCase())}`;
    } catch (addError) {
      setError(`Add failed: ${readErrorMessage(addError)}`);
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <main className="min-h-screen bg-charcoal text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-5">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-acid">Team Communication Map</p>
            <div className="hidden h-0.5 w-20 bg-acid sm:block" />
          </div>
        </header>

        {step === "identity" ? (
          <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <h1 className="max-w-3xl text-6xl font-black uppercase leading-[0.9] tracking-normal sm:text-7xl lg:text-8xl">
                Find your team map
              </h1>
            </div>

            <form onSubmit={lookupPerson} className="border border-white/10 bg-white/[0.04] p-5 shadow-dark sm:p-6">
              <h2 className="text-2xl font-black uppercase">Your info</h2>
              <Field label="First name" value={identity.firstName} onChange={(value) => setIdentity({ ...identity, firstName: value })} />
              <Field label="Last name" value={identity.lastName} onChange={(value) => setIdentity({ ...identity, lastName: value })} />
              <Field label="Email" type="email" value={identity.email} onChange={(value) => setIdentity({ ...identity, email: value })} />
              {error ? <p className="mt-4 text-sm font-bold text-redStyle">{error}</p> : null}
              <button
                type="submit"
                disabled={isWorking}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-acid px-5 py-4 font-black uppercase tracking-wide text-charcoal disabled:opacity-50"
              >
                {isWorking ? "Checking..." : "Continue"}
                <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </section>
        ) : null}

        {step === "quiz" ? (
          <section className="grid flex-1 gap-6 py-8 lg:grid-cols-[300px_1fr]">
            <aside className="border border-white/10 bg-white/[0.04] p-5">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-acid">Reflection quiz</p>
              <h2 className="mt-4 text-3xl font-black uppercase leading-none">{fullName}</h2>
              <p className="mt-3 text-sm text-white/45">{identity.email}</p>
              <div className="mt-8">
                <div className="mb-2 flex justify-between text-sm font-bold text-white/55">
                  <span>{completedAnswers.length} of 28</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-white/10">
                  <div className="h-2 bg-acid" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </aside>

            <section className="border border-white/10 bg-white/[0.04] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-acid">Question {question.id}</p>
                  <h2 className="mt-3 text-3xl font-black leading-tight text-white">{question.prompt}</h2>
                </div>
                <p className="font-black text-white/35">{current + 1} / {mixedQuestions.length}</p>
              </div>

              <div className="mt-8 grid gap-3">
                {question.answers.map((answer, index) => {
                  const selected = answers[question.id] === index;
                  return (
                    <button
                      key={answer.label}
                      type="button"
                      onClick={() => setAnswers((previous) => ({ ...previous, [question.id]: index }))}
                      className={`flex min-h-16 items-center justify-between border px-4 py-4 text-left font-semibold transition ${
                        selected
                          ? "border-acid bg-acid text-charcoal"
                          : "border-white/10 bg-black/20 text-white/75 hover:border-acid/70"
                      }`}
                    >
                      <span>{answer.label}</span>
                      {selected ? <Check className="h-5 w-5 shrink-0" /> : null}
                    </button>
                  );
                })}
              </div>

              {error ? <p className="mt-5 text-sm font-bold text-redStyle">{error}</p> : null}

              <div className="mt-8 flex flex-wrap justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrent((value) => Math.max(0, value - 1))}
                  disabled={current === 0}
                  className="border border-white/15 px-5 py-3 font-black uppercase text-white disabled:opacity-35"
                >
                  Back
                </button>
                {current < mixedQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrent((value) => Math.min(mixedQuestions.length - 1, value + 1))}
                    className="inline-flex items-center gap-2 bg-acid px-5 py-3 font-black uppercase text-charcoal"
                  >
                    Next
                    <ArrowRight className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={finishQuiz}
                    className="inline-flex items-center gap-2 bg-acid px-5 py-3 font-black uppercase text-charcoal"
                  >
                    Finish
                    <ArrowRight className="h-5 w-5" />
                  </button>
                )}
              </div>
            </section>
          </section>
        ) : null}

        {step === "team" ? (
          <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.32em] text-acid">
                {existingProfiles.length ? "Welcome back" : "Quiz complete"}
              </p>
              <h1 className="mt-5 text-5xl font-black uppercase leading-none sm:text-7xl">
                Choose a map
              </h1>
              {activeProfile ? <ProfilePreview profile={activeProfile} /> : null}
            </div>

            <div className="space-y-5">
              {memberTeams.length ? (
                <section className="border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                  <h2 className="text-2xl font-black uppercase">Maps you can view</h2>
                  <select
                    value={selectedTeamId}
                    onChange={(event) => setSelectedTeamId(event.target.value)}
                    className="mt-5 w-full border border-white/10 bg-charcoal px-3 py-4 font-bold text-white"
                  >
                    {memberTeams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  <Link
                    href={`/dashboard/${memberTeams.find((team) => team.id === selectedTeamId)?.invite_code ?? memberTeams[0].invite_code}?email=${encodeURIComponent(identity.email.trim().toLowerCase())}`}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-acid px-5 py-4 font-black uppercase text-charcoal"
                  >
                    Open selected map
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </section>
              ) : null}

              <section className="border border-white/10 bg-white/[0.04] p-5 sm:p-6">
                <h2 className="text-2xl font-black uppercase">Add yourself to a map</h2>
                <select
                  value={selectedTeamId}
                  onChange={(event) => {
                    setSelectedTeamId(event.target.value);
                    setNewTeamName("");
                  }}
                  className="mt-5 w-full border border-white/10 bg-charcoal px-3 py-4 font-bold text-white"
                >
                  <option value="">Choose an existing map</option>
                  {allTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
                <div className="my-4 flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-white/35">
                  <div className="h-px flex-1 bg-white/10" />
                  or
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <input
                  value={newTeamName}
                  onChange={(event) => {
                    setNewTeamName(event.target.value);
                    setSelectedTeamId("");
                  }}
                  className="w-full border border-white/10 bg-charcoal px-3 py-4 font-bold text-white"
                  placeholder="Create a new team map"
                />
                {error ? <p className="mt-4 text-sm font-bold text-redStyle">{error}</p> : null}
                <button
                  type="button"
                  onClick={addToMap}
                  disabled={isWorking}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-acid px-5 py-4 font-black uppercase text-charcoal disabled:opacity-50"
                >
                  {isWorking ? "Adding..." : "Add my result"}
                  <Plus className="h-5 w-5" />
                </button>
              </section>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function readErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown Supabase error";
}

function Field({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="mt-5 block text-sm font-black uppercase tracking-wide text-white/60">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 block w-full border border-white/10 bg-charcoal px-3 py-4 text-base font-bold normal-case tracking-normal text-white"
      />
    </label>
  );
}

function ProfilePreview({ profile }: { profile: Participant }) {
  const scores = {
    Red: profile.red_score,
    Yellow: profile.yellow_score,
    Green: profile.green_score,
    Blue: profile.blue_score
  };
  const primary = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0] as StyleColor;
  const secondary = Object.entries(scores).sort((a, b) => b[1] - a[1])[1][0] as StyleColor;

  return (
    <div className="mt-8 border border-white/10 bg-white/[0.04] p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-acid text-charcoal">
        <Users className="h-5 w-5" />
      </div>
      <p className="text-sm font-black uppercase tracking-[0.22em] text-white/35">Your result</p>
      <h2 className="mt-2 text-3xl font-black uppercase">
        {primary} / {secondary}
      </h2>
    </div>
  );
}
