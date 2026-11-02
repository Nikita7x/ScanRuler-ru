// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../../../../src/i18n'
// Flip normals: the triangles turned over, so they face the other way — the
// whole part, or the surface marked on it.

import { useState } from 'react'
import { useMark } from '../../../../src/state/markStore'
import { useStore } from '../../../../src/state/store'
import { InfoDot } from '../../../../src/ui/InfoDot'
import { MarkTools } from '../../../../src/ui/MarkTools'
import { useMeshTools } from '../../state/meshStore'

export type FlipScope = 'all' | 'marked'

export function FlipTool({
  ready,
  busy,
  onFlip,
  onClear,
}: {
  ready: boolean
  busy: boolean
  onFlip: (scope: FlipScope) => void
  onClear: () => void
}) {
  const marked = useMark((s) => s.count)
  const editing = useMeshTools((s) => s.editing)
  const backfaces = useStore((s) => s.showBackfaces)
  // Which key the flip in flight came from, to turn that one to a spinner.
  const [asked, setAsked] = useState<FlipScope>('all')
  const flip = (scope: FlipScope) => {
    setAsked(scope)
    onFlip(scope)
  }
  const label = (scope: FlipScope, text: string) =>
    editing && asked === scope ? (
      <>
        <span className="spinner" />
        {tr("Flipping…")}{' '}</>
    ) : (
      text
    )

  return (
    <div className="group" data-test="flip-tool">
      <div className="sec-head">
        {tr("Flip normals")}{' '}<InfoDot title={tr("Flipping normals")}>
          <p>
            {tr("Which side of a surface is its outside is set by the order of each triangle's corners. A part exported inside-out faces in everywhere, and a scan stitched from patches can have some of them facing in — and the thickness map, the alignment,")}{' '}
            <b>{tr("Shrink/expand")}</b>, <b>{tr("Shell/hollow")}</b> {tr("and")}{' '}<b>{tr("Boolean")}</b> {tr("all go by which way the surface faces.")}{' '}</p>
          <p>
            {tr("A part that plainly encloses its volume inside-out is turned the right way out when it is opened; an open scan, a sheet, or one with patches facing both ways is left as it was wound.")}{' '}<b>{tr("Backfaces")}</b>{tr(", in the menu over the view bar's Scan key, colours the inside of every triangle, so surface facing the wrong way shows.")}{' '}</p>
          <p>
            <b>{tr("Flip all")}</b> {tr("turns every triangle over.")}{' '}<b>{tr("Flip marked")}</b> {tr("turns over the surface you mark with a")}{' '}<b>{tr("window")}</b>, a <b>{tr("brush")}</b> {tr("or a")}{' '}<b>{tr("lasso")}</b> {tr("— a triangle when all three of its corners are marked, exactly the triangles shown in amber. Nothing moves. It flips the edited copy;")}{' '}<b>{tr("Ctrl+Z")}</b> {tr("turns it back.")}{' '}</p>
        </InfoDot>
      </div>

      <MarkTools escapeNote="The marking stays until it is flipped or cleared." onClear={onClear} />

      <div className="toolrow">
        <button
          className={marked > 0 ? 'primary' : undefined}
          data-test="flip-marked"
          // Enter, or a middle click, flips what was just marked — never the
          // whole part, which a stray click would turn over.
          data-confirm={1}
          disabled={!ready || busy || marked === 0}
          onClick={() => flip('marked')}
          title={tr("Turn the marked surface over — the triangles with all three corners marked")}
        >
          {label('marked', 'Flip marked')}
        </button>
        <button
          className={marked > 0 ? undefined : 'primary'}
          data-test="flip-all"
          disabled={!ready || busy}
          onClick={() => flip('all')}
          title={tr("Turn every triangle of the part over")}
        >
          {label('all', 'Flip all')}
        </button>
      </div>
      {ready && marked === 0 && !editing && (
        <p className="hint">{tr("Mark the surface that faces the wrong way — pick Window, Brush or Lasso — or flip the whole part.")}</p>
      )}
      {ready && !backfaces && (
        <p className="hint" data-test="flip-backfaces-hint">
          {tr("Turn on")}{' '}<b>{tr("Backfaces")}</b> {tr("over the Scan key to see which way the surface faces.")}{' '}</p>
      )}
    </div>
  )
}
