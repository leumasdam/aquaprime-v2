"use client";

import { useId } from "react";
import type { Tier } from "./products";
import type { CfgDecor } from "./configurator-logic";

export type PreviewTank = { w: number; d: number; h: number; liters: number } | null;

const KX = 0.4; // axonometria — posun do hĺbky vodorovne
const KY = 0.24; //                              zvisle
const FEET_H = 10;

/** true = cesta na textúru, false = hex farba */
const isTex = (v: string) => v.startsWith("/");

/**
 * Schematický náhľad skrinky (+ voliteľne akvária) — kreslí sa z reálnych
 * rozmerov, takže reaguje na každý slider aj na dekor. Nie je to render, ale
 * technická skica: pomer strán, počet dvierok, konštrukcia radu, nožičky, kóty.
 */
export default function CabinetPreview({
  w,
  h,
  d,
  tier,
  decor,
  feet,
  led,
  tank,
}: {
  w: number;
  h: number;
  d: number;
  tier: Tier;
  decor: CfgDecor;
  feet: "steel" | "wheels";
  led: boolean;
  tank: PreviewTank;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const VBW = 480;
  const VBH = 360;
  const PAD = { l: 46, r: 20, t: 16, b: 46 };

  const availW = VBW - PAD.l - PAD.r;
  const availH = VBH - PAD.t - PAD.b - FEET_H;

  // mierka: celá zostava (vrátane hĺbkového posunu a nádrže) sa musí zmestiť
  const cmW = w + d * KX;
  const cmH = h + d * KY + (tank ? tank.h : 0);
  const s = Math.min(availW / cmW, availH / cmH);

  const W = w * s;
  const H = h * s;
  const ox = d * s * KX;
  const oy = d * s * KY;
  const TW = tank ? tank.w * s : 0;
  const TH = tank ? tank.h * s : 0;
  const tox = tank ? tank.d * s * KX : 0;
  const toy = tank ? tank.d * s * KY : 0;

  const blockH = H + oy + TH;
  const x0 = PAD.l + (availW - (W + ox)) / 2;
  const yBase = PAD.t + (availH - blockH) / 2 + blockH;
  const yTop = yBase - H;
  const floorY = yBase + FEET_H;

  // vrchná doska = horný pás korpusu, s miernym presahom do strán (ako na fotkách)
  const plateH = Math.max(4, 2.2 * s);
  const plateOver = Math.max(2, 1.2 * s);

  // dvierka: počet podľa šírky (zodpovedá katalógu)
  const doorCount = w <= 120 ? 2 : w <= 160 ? 3 : 4;
  const frame = tier === "standard" ? Math.max(3, 2.4 * s) : 0;
  const gap = Math.max(1.6, 0.7 * s);
  const areaX = x0 + frame;
  const areaY = yTop + plateH + frame;
  const areaW = W - frame * 2;
  const areaH = yBase - areaY - frame;
  const doorW = (areaW - gap * (doorCount - 1)) / doorCount;

  const bodyFill = isTex(decor.body) ? `url(#${uid}body)` : decor.body;
  const doorFill = isTex(decor.doors) ? `url(#${uid}door)` : decor.doors;
  // oceľ svetlejšia než reálna čierna — inak na tmavom pozadí skica splynie
  const STEEL = "#3d4348";

  return (
    <svg
      className="cabsvg"
      viewBox={`0 0 ${VBW} ${VBH}`}
      role="img"
      aria-label={`Náhľad skrinky ${w} × ${h} × ${d} cm, ${decor.name}${
        tank ? `, s akváriom ${tank.w} × ${tank.d} × ${tank.h} cm` : ""
      }`}
    >
      <defs>
        {isTex(decor.body) && (
          <pattern
            id={`${uid}body`}
            patternUnits="userSpaceOnUse"
            width={VBW}
            height={VBH}
          >
            <image
              href={decor.body}
              width={VBW}
              height={VBH}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        )}
        {isTex(decor.doors) && (
          <pattern
            id={`${uid}door`}
            patternUnits="userSpaceOnUse"
            width={Math.max(8, doorW)}
            height={Math.max(8, areaH)}
            x={areaX}
            y={areaY}
          >
            <image
              href={decor.doors}
              width={Math.max(8, doorW)}
              height={Math.max(8, areaH)}
              preserveAspectRatio="xMidYMid slice"
            />
          </pattern>
        )}
        <radialGradient id={`${uid}shadow`}>
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b6c7d" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#123842" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id={`${uid}ledglow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#47c7e8" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#47c7e8" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* tieň na podlahe */}
      <ellipse
        cx={x0 + (W + ox) / 2}
        cy={floorY + 3}
        rx={(W + ox) / 2}
        ry={7}
        fill={`url(#${uid}shadow)`}
      />

      {/* ---------- SKRINKA ---------- */}
      {tier === "basic" ? (
        <BasicFrame
          x0={x0}
          yTop={yTop}
          yBase={yBase}
          W={W}
          ox={ox}
          oy={oy}
          plateH={plateH}
          plateOver={plateOver}
          s={s}
          bodyFill={bodyFill}
          steel={STEEL}
        />
      ) : (
        <>
          {/* bočná stena */}
          <polygon
            points={`${x0 + W},${yTop} ${x0 + W + ox},${yTop - oy} ${x0 + W + ox},${
              yBase - oy
            } ${x0 + W},${yBase}`}
            fill={bodyFill}
          />
          <polygon
            points={`${x0 + W},${yTop} ${x0 + W + ox},${yTop - oy} ${x0 + W + ox},${
              yBase - oy
            } ${x0 + W},${yBase}`}
            fill="#000"
            opacity="0.42"
          />
          {/* čelo korpusu */}
          <rect x={x0} y={yTop} width={W} height={H} fill={bodyFill} />
          {/* dvierka */}
          {Array.from({ length: doorCount }, (_, i) => (
            <rect
              key={i}
              x={areaX + i * (doorW + gap)}
              y={areaY}
              width={doorW}
              height={areaH}
              fill={doorFill}
              rx={1}
            />
          ))}
          {/* vrchná doska — horný pás s presahom */}
          <polygon
            points={`${x0 - plateOver},${yTop} ${x0 + W + plateOver},${yTop} ${
              x0 + W + plateOver + ox
            },${yTop - oy} ${x0 - plateOver + ox},${yTop - oy}`}
            fill={bodyFill}
          />
          <polygon
            points={`${x0 - plateOver},${yTop} ${x0 + W + plateOver},${yTop} ${
              x0 + W + plateOver + ox
            },${yTop - oy} ${x0 - plateOver + ox},${yTop - oy}`}
            fill="#fff"
            opacity="0.1"
          />
          <rect
            x={x0 - plateOver}
            y={yTop}
            width={W + plateOver * 2}
            height={plateH}
            fill={bodyFill}
          />
          <rect
            x={x0 - plateOver}
            y={yTop}
            width={W + plateOver * 2}
            height={plateH}
            fill="#000"
            opacity="0.12"
          />
        </>
      )}

      {/* LED podsvietenie pod vrchnou doskou */}
      {led && (
        <>
          <rect
            x={areaX}
            y={yTop + plateH}
            width={Math.max(0, areaW)}
            height={Math.max(1.5, 0.5 * s)}
            fill="#9fe8fa"
          />
          <rect
            x={areaX}
            y={yTop + plateH}
            width={Math.max(0, areaW)}
            height={Math.min(34, H * 0.32)}
            fill={`url(#${uid}ledglow)`}
          />
        </>
      )}

      {/* nožičky / kolieska */}
      <Feet
        x0={x0}
        W={W}
        ox={ox}
        yBase={yBase}
        kind={feet}
        steel={STEEL}
        count={w > 150 ? 3 : 2}
      />

      {/* ---------- AKVÁRIUM ---------- */}
      {tank && (
        <Tank
          x={x0 + (W - TW) / 2}
          yBottom={yTop}
          TW={TW}
          TH={TH}
          ox={tox}
          oy={toy}
          uid={uid}
        />
      )}

      {/* ---------- KÓTY ---------- */}
      <Dim
        kind="w"
        x1={x0}
        y1={floorY + 18}
        x2={x0 + W}
        y2={floorY + 18}
        label={`${w} cm`}
      />
      <Dim
        kind="h"
        x1={x0 - 18}
        y1={yTop}
        x2={x0 - 18}
        y2={floorY}
        label={`${h} cm`}
      />
      <Dim
        kind="d"
        x1={x0 + W + 8}
        y1={yTop + 6}
        x2={x0 + W + ox + 8}
        y2={yTop - oy + 6}
        label={`${d} cm`}
      />
    </svg>
  );
}

/** Basic = priznaný oceľový rám + vrchná doska, medzi profilmi je vzduch. */
function BasicFrame({
  x0,
  yTop,
  yBase,
  W,
  ox,
  oy,
  plateH,
  plateOver,
  s,
  bodyFill,
  steel,
}: {
  x0: number;
  yTop: number;
  yBase: number;
  W: number;
  ox: number;
  oy: number;
  plateH: number;
  plateOver: number;
  s: number;
  bodyFill: string;
  steel: string;
}) {
  const leg = Math.max(3.5, 3 * s); // profil 30 × 30 mm
  const legs = [x0, x0 + W - leg];
  return (
    <>
      {/* zadná noha v hĺbke */}
      <rect x={x0 + W - leg + ox} y={yTop - oy + plateH} width={leg} height={yBase - yTop - plateH} fill={steel} opacity="0.55" />
      {/* spodný rám do hĺbky */}
      <polygon
        points={`${x0 + W - leg},${yBase - leg} ${x0 + W - leg + ox},${yBase - leg - oy} ${
          x0 + W - leg + ox
        },${yBase - oy} ${x0 + W - leg},${yBase}`}
        fill={steel}
        opacity="0.7"
      />
      {/* predné nohy + spodná priečka */}
      {legs.map((lx) => (
        <rect key={lx} x={lx} y={yTop + plateH} width={leg} height={yBase - yTop - plateH} fill={steel} />
      ))}
      <rect x={x0} y={yBase - leg} width={W} height={leg} fill={steel} />
      {/* vrchná doska v dekore */}
      <polygon
        points={`${x0 - plateOver},${yTop} ${x0 + W + plateOver},${yTop} ${
          x0 + W + plateOver + ox
        },${yTop - oy} ${x0 - plateOver + ox},${yTop - oy}`}
        fill={bodyFill}
      />
      <polygon
        points={`${x0 - plateOver},${yTop} ${x0 + W + plateOver},${yTop} ${
          x0 + W + plateOver + ox
        },${yTop - oy} ${x0 - plateOver + ox},${yTop - oy}`}
        fill="#fff"
        opacity="0.1"
      />
      <rect x={x0 - plateOver} y={yTop} width={W + plateOver * 2} height={plateH} fill={bodyFill} />
      <rect x={x0 - plateOver} y={yTop} width={W + plateOver * 2} height={plateH} fill="#000" opacity="0.12" />
    </>
  );
}

function Feet({
  x0,
  W,
  ox,
  yBase,
  kind,
  steel,
  count,
}: {
  x0: number;
  W: number;
  ox: number;
  yBase: number;
  kind: "steel" | "wheels";
  steel: string;
  count: number;
}) {
  const xs = Array.from({ length: count }, (_, i) =>
    count === 1 ? x0 + W / 2 : x0 + 9 + (i * (W - 18)) / (count - 1)
  );
  return (
    <g>
      {xs.map((x, i) => (
        <g key={i}>
          {kind === "wheels" ? (
            <>
              <rect x={x - 2.5} y={yBase} width={5} height={3} fill={steel} />
              <circle cx={x} cy={yBase + 6} r={4} fill="#2b2e31" stroke={steel} strokeWidth="1.4" />
              <circle cx={x} cy={yBase + 6} r={1.4} fill="#6d7276" />
            </>
          ) : (
            <>
              <rect x={x - 2} y={yBase} width={4} height={7} fill={steel} />
              <ellipse cx={x} cy={yBase + 8.5} rx={4.5} ry={1.8} fill="#2b2e31" />
            </>
          )}
        </g>
      ))}
      {/* naznačená zadná noha */}
      <g opacity="0.5">
        <rect x={x0 + W - 4 + ox} y={yBase - 3} width={4} height={7} fill={steel} />
      </g>
    </g>
  );
}

function Tank({
  x,
  yBottom,
  TW,
  TH,
  ox,
  oy,
  uid,
}: {
  x: number;
  yBottom: number;
  TW: number;
  TH: number;
  ox: number;
  oy: number;
  uid: string;
}) {
  const yTop = yBottom - TH;
  const air = Math.max(2, TH * 0.06); // hladina pod horným okrajom
  const sand = Math.max(3, TH * 0.1);
  return (
    <g>
      {/* horná plocha (hladina v perspektíve) */}
      <polygon
        points={`${x},${yTop + air} ${x + TW},${yTop + air} ${x + TW + ox},${
          yTop + air - oy
        } ${x + ox},${yTop + air - oy}`}
        fill="#2b6c7d"
        opacity="0.45"
      />
      {/* bočná stena */}
      <polygon
        points={`${x + TW},${yTop} ${x + TW + ox},${yTop - oy} ${x + TW + ox},${
          yBottom - oy
        } ${x + TW},${yBottom}`}
        fill="#0f2c33"
        opacity="0.5"
      />
      {/* voda v čele */}
      <rect x={x} y={yTop + air} width={TW} height={TH - air} fill={`url(#${uid}water)`} />
      {/* substrát */}
      <rect x={x} y={yBottom - sand} width={TW} height={sand} fill="#7a6a52" opacity="0.85" />
      {/* sklo + čierny silikón po hranách */}
      <rect
        x={x}
        y={yTop}
        width={TW}
        height={TH}
        fill="#fff"
        fillOpacity="0.04"
        stroke="#0b0d0e"
        strokeWidth="1.8"
      />
      <polygon
        points={`${x},${yTop} ${x + TW},${yTop} ${x + TW + ox},${yTop - oy} ${x + ox},${
          yTop - oy
        }`}
        fill="none"
        stroke="#0b0d0e"
        strokeWidth="1.8"
      />
      {/* odlesk na skle */}
      <path
        d={`M${x + TW * 0.12},${yTop + TH * 0.9} L${x + TW * 0.3},${yTop + air + 2}`}
        stroke="#fff"
        strokeOpacity="0.18"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  );
}

function Dim({
  kind,
  x1,
  y1,
  x2,
  y2,
  label,
}: {
  kind: "w" | "h" | "d";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
}) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // koncové zarážky kolmo na kótu
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 3.5;
  const ny = (dx / len) * 3.5;
  return (
    <g className="cabsvg__dim">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <line x1={x1 - nx} y1={y1 - ny} x2={x1 + nx} y2={y1 + ny} />
      <line x1={x2 - nx} y1={y2 - ny} x2={x2 + nx} y2={y2 + ny} />
      <text
        x={kind === "h" ? mx - 6 : mx}
        y={kind === "w" ? my + 13 : my}
        textAnchor={kind === "h" ? "end" : "middle"}
        dominantBaseline={kind === "w" ? "auto" : "middle"}
        transform={kind === "h" ? `rotate(-90 ${mx - 6} ${my})` : undefined}
      >
        {label}
      </text>
    </g>
  );
}
