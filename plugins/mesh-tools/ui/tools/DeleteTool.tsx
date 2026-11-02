// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../../../../src/i18n'
// Delete marked: the surface marked by hand taken off the scan.

import { useMark } from '../../../../src/state/markStore'
import { InfoDot } from '../../../../src/ui/InfoDot'
import { MarkTools } from '../../../../src/ui/MarkTools'
import { useMeshTools } from '../../state/meshStore'
import { count } from '../meshFormat'

export function DeleteTool({
  ready,
  busy,
  onDelete,
  onClear,
}: {
  ready: boolean
  busy: boolean
  onDelete: () => void
  onClear: () => void
}) {
  const marked = useMark((s) => s.count)
  const editing = useMeshTools((s) => s.editing)
  const confirming = useMeshTools((s) => s.confirming)
  const setConfirming = useMeshTools((s) => s.setConfirming)

  return (
    <div className="group" data-test="delete-tool">
      <div className="sec-head">
        {tr("Delete marked")}{' '}<InfoDot title={tr("Deleting marked surface")}>
          <p>
            {tr("What the scanner saw that is not the part: the clamp that held it, the fixture it sat in, a patch of the table, a finger. Mark it on the part with a")}{' '}<b>{tr("window")}</b>, a{' '}
            <b>{tr("brush")}</b> {tr("or a")}{' '}<b>{tr("lasso")}</b> {tr("— marked surface turns orange — and delete it. A triangle goes when all three of its corners are marked, exactly the triangles shown in orange.")}{' '}</p>
          <p>
            {tr("It is deleted from the edited copy. The hole it leaves stays open — close it with")}{' '}
            <b>{tr("Fill holes")}</b> {tr("if the part should be closed there.")}{' '}<b>{tr("Ctrl+Z")}</b> {tr("puts the surface back.")}{' '}</p>
        </InfoDot>
      </div>

      <MarkTools escapeNote="The marking stays until it is deleted or cleared." onClear={onClear} />

      {confirming && marked > 0 ? (
        <div className="confirmbox" data-test="delete-confirm" role="alertdialog" aria-label={tr("Delete the marked surface")}>
          <p>
            {tr("Delete the surface marked on the part —")}{' '}<b>{count(marked)} {tr("points")}</b> {tr("— from the edited copy?")}{' '}</p>
          <p className="hint">{tr("Ctrl+Z puts it back.")}</p>
          <div className="toolrow">
            <button data-test="delete-keep" onClick={() => setConfirming(false)} title={tr("Leave the scan as it is (Esc)")}>
              {tr("Keep it")}{' '}</button>
            <button
              className="primary"
              data-test="delete-marked-confirm"
              data-confirm={1}
              disabled={busy}
              onClick={onDelete}
              title={tr("Take the marked surface off the scan (Enter)")}
            >
              {tr("Delete")}{' '}</button>
          </div>
        </div>
      ) : (
        <button
          className="primary block"
          data-test="delete-marked"
          disabled={!ready || busy || marked === 0}
          onClick={() => setConfirming(true)}
        >
          {editing ? (
            <>
              <span className="spinner" />
              {tr("Deleting…")}{' '}</>
          ) : (
            'Delete marked surface…'
          )}
        </button>
      )}
      {ready && marked === 0 && !editing && <p className="hint">{tr("Pick Window, Brush or Lasso and mark what is to go.")}</p>}
    </div>
  )
}
