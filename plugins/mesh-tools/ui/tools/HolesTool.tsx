// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../../../../src/i18n'
// Fill holes: the gaps in the scan under a size closed, flat or following
// the surface round them.

import { useLength } from '../../../../src/app/useUnits'
import { InfoDot } from '../../../../src/ui/InfoDot'
import { NumberField } from '../../../../src/ui/NumberField'
import { useMeshTools } from '../../state/meshStore'
import { count, typedLen } from '../meshFormat'

export function HolesTool({ ready, busy, onFill }: { ready: boolean; busy: boolean; onFill: () => void }) {
  const holeSize = useMeshTools((s) => s.holeSize)
  const setHoleSize = useMeshTools((s) => s.setHoleSize)
  const fillMode = useMeshTools((s) => s.fillMode)
  const setFillMode = useMeshTools((s) => s.setFillMode)
  const survey = useMeshTools((s) => s.holeSurvey)
  const editing = useMeshTools((s) => s.editing)
  const len = useLength()
  // A count for another size than the one in the field is on its way out.
  const s = survey && survey.maxSize === holeSize ? survey : null
  const holes = (n: number) => `${count(n)} hole${n === 1 ? '' : 's'}`

  return (
    <div className="group" data-test="holes-tool">
      <div className="sec-head">
        {tr("Fill holes")}{' '}<InfoDot title={tr("Filling holes")}>
          <p>
            {tr("A scanner leaves holes where it could not see: the bottom of a blind bore, the inside of a sharp corner, a shiny spot, the pin the part stood on. Every rim smaller across than the size below is a hole, marked on the part in orange and ringed; larger rims — the scan's own open border, a hole too big to guess across — are drawn faint and left open.")}{' '}</p>
          <p>
            {tr("Each hole is closed with the patch across it that bends least, given points as dense as the scan around it, and smoothed:")}{' '}<b>{tr("Curved")}</b> {tr("carries the surface's curvature across the hole, so a patch on a ball bulges with the ball;")}{' '}<b>{tr("Flat")}</b> {tr("lays the tightest patch across the rim, flat wherever the rim is. The scan's own points stay where they are.")}{' '}</p>
          <p>
            {tr("A filled patch is a guess at what the scanner did not see — the deviation and thickness maps read it like any other surface.")}{' '}<b>{tr("Ctrl+Z")}</b> {tr("opens the holes again.")}{' '}</p>
        </InfoDot>
      </div>

      <NumberField
        label="Holes up to"
        testId="holes-size"
        value={holeSize}
        step={0.5}
        min={0.001}
        kind="length"
        disabled={busy}
        onCommit={setHoleSize}
        hint="A rim whose longest span is less than this is a hole to fill. It starts at a twentieth of the part's size."
      />

      <div className="field">
        <span>{tr("Patch")}</span>
        <div className="moderow" role="radiogroup" aria-label={tr("Patch shape")}>
          {(['curved', 'flat'] as const).map((mode) => (
            <button
              key={mode}
              role="radio"
              aria-checked={fillMode === mode}
              className={fillMode === mode ? 'on' : undefined}
              data-test={`fill-${mode}`}
              disabled={busy}
              onClick={() => setFillMode(mode)}
              title={
                mode === 'curved'
                  ? 'Carry the surface’s curvature across the hole'
                  : 'The tightest patch across the rim — flat where the rim is'
              }
            >
              {mode === 'curved' ? 'Curved' : 'Flat'}
            </button>
          ))}
        </div>
      </div>

      {ready && !s && (
        <p className="hint">
          <span className="spinner" /> {tr("Looking for holes…")}{' '}</p>
      )}
      {s && (
        <>
          <div className="kv" data-test="holes-rims">
            <span className="name">{tr("Open rims in the scan")}</span>
            <b>{count(s.rims)}</b>
          </div>
          <div className="kv" data-test="holes-count">
            <span className="name">{tr("Holes, under")}{' '}{typedLen(s.maxSize, len.units)}</span>
            <b>{count(s.holes)}</b>
          </div>
          {s.holes > 0 && (
            <p className="hint" data-test="holes-gap">
              {tr("Marked on the part in orange, each in a ring — click a ring to fill just that hole. The largest is")}{' '}
              {len.fmt(s.largestHole!, 2)} {tr("across")}{' '}{s.smallestOpen !== null ? `, the smallest rim left open ${len.fmt(s.smallestOpen, 2)}` : ''}.
            </p>
          )}
          {s.rims === 0 && (
            <p className="hint" data-test="holes-closed">
              {tr("The scan is closed — it has no open edge anywhere.")}{' '}</p>
          )}
          {s.rims > 0 && s.holes === 0 && (
            <p className="hint" data-test="holes-none">
              {tr("No rim is smaller than that — the smallest is")}{' '}{len.fmt(s.smallestOpen!, 2)} {tr("across.")}{' '}</p>
          )}
        </>
      )}

      <button
        className="primary block"
        data-test="fill-holes"
        data-confirm={1}
        disabled={!ready || busy || !s || s.holes === 0}
        onClick={onFill}
      >
        {editing ? (
          <>
            <span className="spinner" />
            {tr("Filling…")}{' '}</>
        ) : s && s.holes > 0 ? (
          `Fill ${holes(s.holes)}`
        ) : (
          'Fill'
        )}
      </button>
    </div>
  )
}
