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
    color: "#b9245b"
  },
  Yellow: {
    title: "YELLOW",
    words: ["Enthusiast", "Diplomat", "Mediator", "Entertainer"],
    color: "#b99622"
  },
  Green: {
    title: "GREEN",
    words: ["Specialist", "Worker", "Helper", "Carer"],
    color: "#2f7b47"
  },
  Blue: {
    title: "BLUE",
    words: ["Analyst", "Tactician", "Perfectionist", "Adviser"],
    color: "#237993"
  }
} satisfies Record<StyleColor, { title: string; words: string[]; color: string }>;

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
        const coordinates = mapPositionFromScores(participant);

        return {
          ...participant,
          primary: participantPrimary(participant),
          secondary: participantSecondary(participant),
          left: coordinates.left,
          top: coordinates.top
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
              <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-acid">MAP V3 SCORE-BASED</p>
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

          <ScoreMapV3
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

function ScoreMapV3({
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
  const mapWidth = Math.round(980 * zoom);
  const mapHeight = Math.round(680 * zoom);

  return (
    <section
      style={{
        border: "1px solid rgba(255,255,255,0.12)",
        background: "#090b0a",
        padding: 12
      }}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-acid">MAP V3 SCORE-BASED</p>
          <p className="mt-1 text-xs font-bold text-white/40">Zoom {Math.round(zoom * 100)}%</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((value) => Math.max(0.7, Number((value - 0.15).toFixed(2))))}
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
            onClick={() => setZoom((value) => Math.min(2.5, Number((value + 0.15).toFixed(2))))}
            className="inline-flex h-9 w-9 items-center justify-center border border-white/10 bg-white/[0.04] text-white/70"
            aria-label="Zoom in"
            title="Zoom in"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="h-[560px] overflow-auto sm:h-[720px]"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px), #101312",
          backgroundSize: "34px 34px"
        }}
      >
        <div
          className="relative"
          style={{
            width: `${mapWidth}px`,
            height: `${mapHeight}px`,
            minWidth: "100%",
            minHeight: "100%",
            color: "#e9eee9"
          }}
        >
          <div style={axisLine("horizontal")} />
          <div style={axisLine("vertical")} />
          <div style={axisTick("left")} />
          <div style={axisTick("right")} />
          <div style={axisTick("top")} />
          <div style={axisTick("bottom")} />

          <MapLabel style={{ left: "50%", top: "4%", transform: "translateX(-50%)", textAlign: "center" }}>
            Task-Oriented &<br />Issue-Oriented
          </MapLabel>
          <MapLabel style={{ left: "50%", bottom: "5%", transform: "translateX(-50%)", textAlign: "center" }}>
            Relation-Oriented
          </MapLabel>
          <MapLabel style={{ left: "4%", top: "50%", transform: "translateY(-50%)", textAlign: "right" }}>
            Introvert<br />Passive<br />Reserved
          </MapLabel>
          <MapLabel style={{ right: "4%", top: "50%", transform: "translateY(-50%)", textAlign: "left" }}>
            Extrovert<br />Active<br />Implementor
          </MapLabel>

          <MapBlock color="Blue" left="17%" top="16%" />
          <MapBlock color="Red" left="53%" top="16%" />
          <MapBlock color="Green" left="17%" top="53%" />
          <MapBlock color="Yellow" left="53%" top="53%" />

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
                style={{
                  position: "absolute",
                  left: `${point.left}%`,
                  top: `${point.top}%`,
                  zIndex: 30,
                  transform: "translate(-50%, -50%)",
                  border: point.id === selectedId ? "2px solid #ffffff" : "1px solid rgba(255,255,255,0.5)",
                  background: point.id === viewerId ? "#2fbf25" : "#f6f8f4",
                  color: point.id === viewerId ? "#071007" : "#0b0d0c",
                  boxShadow: "0 10px 24px rgba(0,0,0,0.36)",
                  padding: "3px 7px",
                  minWidth: 34,
                  borderRadius: 4,
                  fontSize: 11,
                  lineHeight: "14px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: 0,
                  cursor: "pointer"
                }}
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
    </section>
  );
}

function MapBlock({ color, left, top }: { color: StyleColor; left: string; top: string }) {
  const content = quadrantContent[color];

  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: "30%",
        height: "31%",
        background: content.color,
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: "0 24px 45px rgba(0,0,0,0.28)"
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.08)" }} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
          color: "#ffffff",
          fontSize: 28,
          fontWeight: 900,
          textTransform: "uppercase"
        }}
      >
        {content.title}
      </div>
      {content.words.map((word, index) => (
        <span
          key={word}
          style={{
            ...wordPosition(index),
            position: "absolute",
            zIndex: 2,
            color: "rgba(255,255,255,0.58)",
            fontSize: 11,
            lineHeight: "13px",
            fontWeight: 900,
            textTransform: "uppercase"
          }}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function MapLabel({ children, style }: { children: React.ReactNode; style: React.CSSProperties }) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 15,
        color: "rgba(255,255,255,0.56)",
        fontSize: 14,
        lineHeight: "18px",
        fontWeight: 900,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function axisLine(direction: "horizontal" | "vertical") {
  if (direction === "horizontal") {
    return {
      position: "absolute",
      left: "13%",
      right: "13%",
      top: "50%",
      height: 2,
      background: "rgba(255,255,255,0.58)",
      zIndex: 10
    } as React.CSSProperties;
  }

  return {
    position: "absolute",
    left: "50%",
    top: "10%",
    bottom: "10%",
    width: 2,
    background: "rgba(255,255,255,0.58)",
    zIndex: 10
  } as React.CSSProperties;
}

function axisTick(position: "left" | "right" | "top" | "bottom") {
  const common = {
    position: "absolute",
    zIndex: 11,
    width: 14,
    height: 14,
    borderColor: "rgba(255,255,255,0.58)"
  } as React.CSSProperties;

  if (position === "left") {
    return { ...common, left: "13%", top: "50%", transform: "translate(-55%, -50%) rotate(45deg)", borderBottom: "2px solid", borderLeft: "2px solid" };
  }
  if (position === "right") {
    return { ...common, right: "13%", top: "50%", transform: "translate(55%, -50%) rotate(45deg)", borderTop: "2px solid", borderRight: "2px solid" };
  }
  if (position === "top") {
    return { ...common, left: "50%", top: "10%", transform: "translate(-50%, -55%) rotate(45deg)", borderTop: "2px solid", borderLeft: "2px solid" };
  }
  return { ...common, left: "50%", bottom: "10%", transform: "translate(-50%, 55%) rotate(45deg)", borderBottom: "2px solid", borderRight: "2px solid" };
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

function wordPosition(index: number) {
  const positions = [
    { left: "10%", top: "12%" },
    { right: "10%", top: "12%" },
    { left: "10%", bottom: "12%" },
    { right: "10%", bottom: "12%" }
  ];
  return positions[index] ?? positions[0];
}

function mapPositionFromScores(participant: {
  red_score: number;
  yellow_score: number;
  green_score: number;
  blue_score: number;
}) {
  const { x, y } = participantCoordinates(participant);

  return {
    left: clampMapPercent(50 + x * 0.34),
    top: clampMapPercent(50 - y * 0.34)
  };
}

function clampMapPercent(value: number) {
  return Math.max(18, Math.min(82, Number(value.toFixed(2))));
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
