"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, RefreshCw, Trash2, Users } from "lucide-react";
import { communicationTips } from "@/lib/communicationTips";
import { participantPrimary, participantScores, participantSecondary } from "@/lib/scoring";
import { styleSummaries } from "@/lib/styles";
import { deleteParticipant, getTeamByInvite, listParticipants } from "@/lib/storage";
import type { Participant, StyleColor, Team } from "@/lib/types";

type MapPoint = Participant & {
  primary: StyleColor;
  secondary: StyleColor;
  left: number;
  top: number;
};

const quadrantContent = {
  Red: {
    title: "DECISIVE",
    words: ["Leader", "Pioneer", "Go-getter", "Adventurer"],
    className: "bg-redStyle/78"
  },
  Yellow: {
    title: "INFLUENTIAL",
    words: ["Enthusiast", "Diplomat", "Mediator", "Entertainer"],
    className: "bg-yellowStyle/78"
  },
  Green: {
    title: "STABLE",
    words: ["Specialist", "Worker", "Helper", "Carer"],
    className: "bg-greenStyle/78"
  },
  Blue: {
    title: "CONSCIENTIOUS",
    words: ["Analyst", "Tactician", "Perfectionist", "Adviser"],
    className: "bg-blueStyle/78"
  }
} satisfies Record<StyleColor, { title: string; words: string[]; className: string }>;

export function DashboardClient({ inviteCode }: { inviteCode: string }) {
  const searchParams = useSearchParams();
  const viewerEmail = searchParams.get("email")?.trim().toLowerCase() ?? "";
  const [team, setTeam] = useState<Team | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode, viewerEmail]);

  async function refresh() {
    setIsLoading(true);
    setError("");
    try {
      const loadedTeam = await getTeamByInvite(inviteCode);
      setTeam(loadedTeam);
      if (loadedTeam) {
        const loadedParticipants = await listParticipants(loadedTeam.id);
        setParticipants(loadedParticipants);
        setSelectedId((previous) => previous || loadedParticipants[0]?.id || "");
      }
    } catch {
      setError("The map could not be loaded.");
    } finally {
      setIsLoading(false);
    }
  }

  const viewerProfile = participants.find((participant) => participant.email.toLowerCase() === viewerEmail);
  const selected = participants.find((participant) => participant.id === selectedId) ?? viewerProfile ?? participants[0];
  const mapData = useMemo<MapPoint[]>(
    () =>
      participants.map((participant) => ({
        ...participant,
        primary: participantPrimary(participant),
        secondary: participantSecondary(participant),
        left: Math.max(3, Math.min(94, ((participant.x_coord + 100) / 200) * 100)),
        top: Math.max(4, Math.min(92, 100 - ((participant.y_coord + 100) / 200) * 100))
      })),
    [participants]
  );

  async function handleDelete(participantId: string) {
    await deleteParticipant(participantId);
    if (selectedId === participantId) setSelectedId("");
    await refresh();
  }

  if (isLoading) {
    return <Shell title="Loading map..." />;
  }

  if (!team) {
    return (
      <Shell title="Map not found">
        <Link href="/" className="inline-flex items-center gap-2 font-black uppercase text-acid">
          <ArrowLeft className="h-4 w-4" />
          Start over
        </Link>
      </Shell>
    );
  }

  if (!viewerEmail || !viewerProfile) {
    return (
      <Shell title={team.name} subtitle="Private to map members">
        <section className="mx-auto max-w-2xl border border-white/10 bg-white/[0.04] p-6 shadow-dark">
          <h2 className="text-3xl font-black uppercase">Add yourself first</h2>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 bg-acid px-5 py-4 font-black uppercase text-charcoal">
            Go to start
            <ArrowLeft className="h-5 w-5 rotate-180" />
          </Link>
        </section>
      </Shell>
    );
  }

  const viewer = viewerProfile as Participant;

  return (
    <Shell title={team.name} subtitle="Team personality map">
      {error ? <p className="mb-4 text-sm font-bold text-redStyle">{error}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
        <section className="border border-white/10 bg-white/[0.04] p-4 shadow-dark sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.22em] text-acid">World of difference</p>
              <h2 className="text-3xl font-black uppercase text-white">{participants.length} people mapped</h2>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex items-center gap-2 border border-white/10 px-4 py-3 font-black uppercase text-white/70"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          <PersonalityMap
            data={mapData}
            selectedId={selected?.id}
            viewerId={viewer.id}
            viewerPrimary={participantPrimary(viewer)}
            onSelect={setSelectedId}
          />

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/35">
                  <th className="py-3 pr-3 font-black uppercase">Name</th>
                  <th className="py-3 pr-3 font-black uppercase">Primary</th>
                  <th className="py-3 pr-3 font-black uppercase">Secondary</th>
                  <th className="py-3 pr-3 font-black uppercase">Scores</th>
                  <th className="py-3 pr-3 font-black uppercase">Admin</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => {
                  const primary = participantPrimary(participant);
                  const secondary = participantSecondary(participant);
                  const scores = participantScores(participant);
                  return (
                    <tr
                      key={participant.id}
                      className={`border-b border-white/10 ${selected?.id === participant.id ? "bg-white/[0.06]" : ""}`}
                    >
                      <td className="py-3 pr-3">
                        <button
                          type="button"
                          onClick={() => setSelectedId(participant.id)}
                          className="text-left font-black text-white"
                        >
                          {participant.name}
                          {participant.id === viewer.id ? <span className="ml-2 text-xs text-acid">You</span> : null}
                        </button>
                        <p className="text-xs text-white/35">{participant.email}</p>
                      </td>
                      <td className="py-3 pr-3 text-white/70">{primary}</td>
                      <td className="py-3 pr-3 text-white/70">{secondary}</td>
                      <td className="py-3 pr-3 text-xs text-white/45">
                        R {scores.Red} / Y {scores.Yellow} / G {scores.Green} / B {scores.Blue}
                      </td>
                      <td className="py-3 pr-3">
                        <button
                          type="button"
                          onClick={() => handleDelete(participant.id)}
                          className="inline-flex items-center gap-2 text-sm font-black uppercase text-redStyle"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-5">
          <ParticipantPanel participant={selected} viewerId={viewer.id} />
        </aside>
      </div>
    </Shell>
  );
}

function PersonalityMap({
  data,
  selectedId,
  viewerId,
  viewerPrimary,
  onSelect
}: {
  data: MapPoint[];
  selectedId?: string;
  viewerId: string;
  viewerPrimary: StyleColor;
  onSelect: (id: string) => void;
}) {
  const [hoveredId, setHoveredId] = useState<string>("");
  const hovered = data.find((point) => point.id === hoveredId);

  return (
    <div className="relative h-[460px] overflow-hidden border border-white/20 bg-black sm:h-[560px]">
      <Quadrant color="Blue" className="left-0 top-0" />
      <Quadrant color="Red" className="right-0 top-0" />
      <Quadrant color="Green" className="bottom-0 left-0" />
      <Quadrant color="Yellow" className="bottom-0 right-0" />

      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/35" />
      <div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-black/35" />
      <AxisLabel className="left-1/2 top-2 -translate-x-1/2" label="TASK-ORIENTED" />
      <AxisLabel className="bottom-2 left-1/2 -translate-x-1/2" label="PEOPLE-ORIENTED" />
      <AxisLabel className="left-2 top-1/2 -translate-y-1/2 -rotate-90" label="INTROVERT" />
      <AxisLabel className="right-2 top-1/2 -translate-y-1/2 rotate-90" label="EXTROVERT" />

      {data.length ? (
        data.map((point) => (
          <button
            key={point.id}
            type="button"
            onClick={() => onSelect(point.id)}
            onFocus={() => setHoveredId(point.id)}
            onBlur={() => setHoveredId("")}
            onMouseEnter={() => setHoveredId(point.id)}
            onMouseLeave={() => setHoveredId("")}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-sm px-1.5 py-0.5 text-[11px] font-black uppercase tracking-wide shadow-sm transition sm:text-xs ${
              point.id === selectedId
                ? "bg-charcoal text-acid ring-2 ring-white"
                : point.id === viewerId
                  ? "bg-acid text-charcoal ring-2 ring-white"
                  : "bg-white/90 text-charcoal hover:bg-white"
            }`}
            style={{ left: `${point.left}%`, top: `${point.top}%` }}
            title={`${point.name}: ${point.primary} / ${point.secondary}`}
          >
            {firstName(point.name)}
          </button>
        ))
      ) : (
        <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white/75">
          <div>
            <Users className="mx-auto h-8 w-8" />
            <p className="mt-3 font-black uppercase">No people yet</p>
          </div>
        </div>
      )}

      {hovered ? <HoverTips viewerPrimary={viewerPrimary} person={hovered} /> : null}
    </div>
  );
}

function HoverTips({ viewerPrimary, person }: { viewerPrimary: StyleColor; person: MapPoint }) {
  const tips = communicationTips(viewerPrimary, person.primary);

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 z-30 max-w-md border border-white/20 bg-charcoal/95 p-4 text-white shadow-dark backdrop-blur">
      <p className="text-[11px] font-black uppercase tracking-[0.22em] text-acid">
        {viewerPrimary} communicating with {person.primary}
      </p>
      <h3 className="mt-1 text-xl font-black uppercase">{person.name}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-5 text-white/70">
        {tips.map((tip) => (
          <li key={tip}>- {tip}</li>
        ))}
      </ul>
    </div>
  );
}

function Quadrant({ color, className }: { color: StyleColor; className: string }) {
  const content = quadrantContent[color];
  return (
    <div className={`absolute h-1/2 w-1/2 ${content.className} ${className}`}>
      <div className="map-texture absolute inset-0 opacity-35" />
      <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-lg font-black uppercase tracking-[0.16em] text-white drop-shadow sm:text-2xl">
        {content.title}
      </p>
      {content.words.map((word, index) => (
        <span
          key={word}
          className="absolute z-10 text-[10px] font-black uppercase text-charcoal/80 sm:text-xs"
          style={wordPosition(index)}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function wordPosition(index: number) {
  const positions = [
    { left: "12%", top: "16%" },
    { right: "12%", top: "16%" },
    { left: "12%", bottom: "18%" },
    { right: "12%", bottom: "18%" }
  ];
  return positions[index] ?? positions[0];
}

function AxisLabel({ label, className }: { label: string; className: string }) {
  return (
    <span className={`absolute z-10 bg-white px-2 py-0.5 text-[10px] font-black uppercase text-charcoal ${className}`}>
      {label}
    </span>
  );
}

function ParticipantPanel({ participant, viewerId }: { participant?: Participant; viewerId: string }) {
  if (!participant) {
    return (
      <section className="border border-white/10 bg-white/[0.04] p-5 shadow-dark">
        <h2 className="text-xl font-black uppercase text-white">Selected person</h2>
        <p className="mt-2 text-sm text-white/45">Select a name on the map to view style notes.</p>
      </section>
    );
  }

  const primary = participantPrimary(participant);
  const secondary = participantSecondary(participant);
  const summary = styleSummaries[primary];

  return (
    <section className="border border-white/10 bg-white/[0.04] p-5 shadow-dark">
      <div className="mb-5 h-2 w-full" style={{ background: summary.hex }} />
      <p className="text-sm font-black uppercase tracking-[0.22em] text-white/35">
        {participant.id === viewerId ? "You" : "Selected person"}
      </p>
      <h2 className="mt-2 text-3xl font-black uppercase text-white">{participant.name}</h2>
      <p className="mt-1 text-sm text-white/35">{participant.email}</p>
      <p className="mt-4 text-base font-black uppercase text-white">
        {primary} primary, {secondary} secondary
      </p>

      <DetailList title="Communication preferences" items={summary.preferences} />
      <DetailList title="Things to avoid" items={summary.avoid} />
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <h3 className="text-sm font-black uppercase text-white">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-white/55">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}

function Shell({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-charcoal text-white">
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-12">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-acid">{subtitle}</p>
            <h1 className="mt-2 text-4xl font-black uppercase text-white sm:text-6xl">{title}</h1>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-black uppercase text-white/55">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </header>
        {children}
      </div>
    </main>
  );
}

function firstName(name: string) {
  return name.trim().split(/\s+/)[0] || name;
}
