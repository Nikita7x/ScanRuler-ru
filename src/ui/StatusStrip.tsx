// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../i18n'
// Machine status strip: ready-lamp, what the tool is doing right now, the
// running tally of what has been measured, and the imprint. Nothing that is a
// switch — the ways of looking at the part are on the view bar in the corner
// of the stage, and what is set once and left is in Settings; a strip that
// held both was a row of small print nobody could find anything in.

import { useStore } from '../state/store'
import { useCommandActivity } from '../commands/activity'
import { useAgentLink } from '../commands/agentLink'

export function StatusStrip() {
  const busy = useStore((s) => s.busy)
  const errorText = useStore((s) => s.errorText)
  const statusText = useStore((s) => s.statusText)
  const elements = useStore((s) => s.elements)
  const draft = useStore((s) => s.draft)
  const openImprint = useStore((s) => s.openImprint)
  // A command an agent is running: named here, for as long as it runs.
  const agent = useCommandActivity((s) => s.running)
  const agentConnected = useAgentLink((s) => s.status === 'connected')

  const fitting = draft?.status === 'fitting' || elements.some((e) => e.status === 'fitting')
  const lamp = errorText ? 'lamp err' : busy || fitting || agent ? 'lamp busy' : 'lamp'
  const state = errorText ? 'ERROR' : agent ? 'AGENT' : busy ? 'LOADING' : fitting ? 'FITTING' : 'READY'

  const done = elements.filter((e) => e.fit)
  const dimensions = useStore((s) => s.dimensions)

  return (
    <footer className="strip">
      <div>
        <span className={lamp} /> {tr(state)}
      </div>
      {elements.length > 0 && (
        <div>
          {tr("ELEMENTS")}{' '}<b>{done.length}</b>
          {done.length !== elements.length && ` of ${elements.length}`} {tr("· DIM")}{' '}
          <b>{dimensions.length}</b>
        </div>
      )}
      <div className="msg grow">
        {errorText ? (
          <span className="warn">⚠ {tr(errorText)}</span>
        ) : agent ? (
          <span data-test="agent-running">
            <b>{tr(agent.title)}</b> <code>{agent.name}</code>
            {statusText ? ` — ${tr(statusText)}` : ''}
          </span>
        ) : (
          tr(statusText)
        )}
      </div>
      <button
        className="stripimprint"
        onClick={() => openImprint(true)}
        title={tr("Impressum & Datenschutzerklärung")}
      >
        § <span className="btxt">{tr("IMPRINT")}</span>
      </button>
      <a href="https://www.cnckitchen.com" target="_blank" rel="noreferrer" data-test="local-note">
        {agentConnected ? (
          <>
            {tr("AGENT CONNECTED")}<span className="ltxt"> {tr("· WHAT IT READS GOES TO ITS AI MODEL")}</span>
          </>
        ) : (
          <>
            {tr("LOCAL ONLY")}<span className="ltxt"> {tr("· FILES NEVER LEAVE YOUR BROWSER")}</span>
          </>
        )}
      </a>
    </footer>
  )
}
