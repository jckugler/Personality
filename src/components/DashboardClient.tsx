"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, Plus, RefreshCw, Users } from "lucide-react";
import { communicationTips } from "@/lib/communicationTips";
import { participantCoordinates, participantPrimary, participantScores, participantSecondary } from "@/lib/scoring";
import { styleSummaries } from "@/lib/styles";
import { getTeamByInvite, listParticipants } from "@/lib/storage";
import type { Participant, StyleColor, Team } from "@/lib/types";

type MapPoint = Participant & {
  primary: StyleColor;
  secondary: StyleColor;
  left: number;
  top: number;
};

const quadrantContent = {
  Red: {
    title: "RED",
    words: ["Leader", "Pioneer", "Go-getter", "Adventurer"],
    className: "bg-[#bb285d]"
  },
  Yellow: {
    title: "YELLOW",
    words: ["Enthusiast", "Diplomat", "Mediator", "Entertainer"],
    className: "bg-[#c6a83b]"
  },
  Green: {
    title: "GREEN",
    words: ["Specialist", "Worker", "Helper", "Carer"],
    className: "bg-[#428a4b]"
  },
  Blue: {
    title: "BLUE",
    words: ["Analyst", "Tactician", "Perfectionist", "Adviser"],
    className: "bg-[#27839f]"
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
      participants.map((participant) => {
        const coordinates = participantCoordinates(participant);

        return {
          ...participant,
          primary: participantPrimary(participant),
          secondary: participantSecondary(participant),
          left: Math.max(3, Math.min(97, ((coordinates.x + 100) / 200) * 100)),
          top: Math.max(3, Math.min(97, 100 - ((coordinates.y + 100) / 200) * 100))
        };
      }),
    [participants]
  );

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
              <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-white/35">Map version: dark zoom</p>
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
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/35">
                  <th className="py-3 pr-3 font-black uppercase">Name</th>
                  <th className="py-3 pr-3 font-black uppercase">Primary</th>
                  <th className="py-3 pr-3 font-black uppercase">Secondary</th>
                  <th className="py-3 pr-3 font-black uppercase">Scores</th>
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
  const [zoom, setZoom] = useState(1);
  const hovered = data.find((point) => point.id === hoveredId);
  const mapWidth = Math.round(920 * zoom);
  const mapHeight = Math.round(620 * zoom);

  return (
    <div className="map-shell border border-white/10 p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-white/35">Map zoom {Math.round(zoom * 100)}%</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.75, Number((value - 0.15).toFixed(2))))}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/70"
            aria-label="Zoom out"
            title="Zoom out"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="h-9 border border-white/10 bg-white/[0.04] px-3 text-xs font-black uppercase text-white/55"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => setZoom((value) => Math.min(2.25, Number((value + 0.15).toFixed(2))))}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/70"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="map-scroll h-[520px] overflow-auto sm:h-[680px]">
        <div
          className="relative text-[#c8ceca]"
          style={{
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            minWidth: "100%",
            minHeight: "100%"
          }}
        >
          <AxisArrow direction="vertical" />
          <AxisArrow direction="horizontal" />

          <AxisLabel className="left-1/2 top-5 -translate-x-1/2 text-center" label={"Task-Oriented &\nIssue-Oriented"} />
          <AxisLabel className="bottom-8 left-1/2 -translate-x-1/2 text-center" label="Relation-Oriented" />
          <AxisLabel className="left-5 top-1/2 -translate-y-1/2 text-right sm:left-8" label={"Introvert\nPassive\nReserved"} />
          <AxisLabel className="right-5 top-1/2 -translate-y-1/2 text-left sm:right-8" label={"Extrovert\nActive\nImplementor"} />

          <div className="absolute inset-[88px_78px_82px_78px] sm:inset-[106px_132px_96px_132px]">
            <Quadrant color="Blue" className="left-0 top-0" />
            <Quadrant color="Red" className="right-0 top-0" />
            <Quadrant color="Green" className="bottom-0 left-0" />
            <Quadrant color="Yellow" className="bottom-0 right-0" />
          </div>

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
                style={{ left: `${mapPointToCanvas(point.left)}%`, top: `${mapPointToCanvas(point.top)}%` }}
                title={`${point.name}: ${point.primary} / ${point.secondary}`}
              >
                {firstName(point.name)}
              </button>
            ))
          ) : (
            <div className="absolute inset-0 z-20 flex items-center justify-center text-center text-white/55">
              <div>
                <Users className="mx-auto h-8 w-8" />
                <p className="mt-3 font-black uppercase">No people yet</p>
              </div>
            </div>
          )}

          {hovered ? <HoverTips viewerPrimary={viewerPrimary} person={hovered} /> : null}
        </div>
      </div>
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
    <div className={`absolute h-[47%] w-[47%] ${content.className} ${className} shadow-[0_0_0_1px_rgba(255,255,255,0.08)]`}>
      <div className="absolute inset-0 bg-black/10" />
      <p className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
        {content.title}
      </p>
      {content.words.map((word, index) => (
        <span
          key={word}
          className="absolute z-10 text-[9px] font-black uppercase tracking-wide text-white/55 sm:text-[11px]"
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
    { left: "10%", top: "12%" },
    { right: "10%", top: "12%" },
    { left: "10%", bottom: "12%" },
    { right: "10%", bottom: "12%" }
  ];
  return positions[index] ?? positions[0];
}

function AxisLabel({ label, className }: { label: string; className: string }) {
  return (
    <span className={`absolute z-10 whitespace-pre-line text-sm font-black leading-tight text-[#6f7474] ${className}`}>
      {label}
    </span>
  );
}

function AxisArrow({ direction }: { direction: "horizontal" | "vertical" }) {
  if (direction === "horizontal") {
    return (
      <div className="absolute left-[15%] right-[15%] top-1/2 z-10 h-0.5 -translate-y-1/2 bg-[#98a09b]">
        <span className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-[#98a09b]" />
        <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-[#98a09b]" />
      </div>
    );
  }

  return (
    <div className="absolute bottom-[12%] left-1/2 top-[14%] z-10 w-0.5 -translate-x-1/2 bg-[#98a09b]">
      <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-l-2 border-t-2 border-[#98a09b]" />
      <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#98a09b]" />
    </div>
  );
}

function mapPointToCanvas(value: number) {
  return 21 + value * 0.58;
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
