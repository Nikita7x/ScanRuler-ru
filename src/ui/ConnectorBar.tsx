// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../i18n'
// The strip under the top bar that tells the person their AI app's
// ScanRuler connector — the scanruler-mcp server it starts — is older than
// this page's commands assume, and how to update it: a sentence to ask the
// agent with, or by hand one copy-ready step per app, then quitting the app
// and opening it again. Shown while the agent connection is on and the server
// it reached is too old.

import { useState } from 'react'
import { CONNECTOR_ASK, CONNECTOR_STEPS, serverTooOld, useAgentLink, WANTS_SERVER } from '../commands/agentLink'
import { usePrefs } from '../state/prefsStore'
import { CopyButton } from './CopyButton'

export function ConnectorBar() {
  const agentLink = usePrefs((s) => s.agentLink)
  const server = useAgentLink((s) => s.server)
  const [hidden, setHidden] = useState<string | null>(null)
  if (!agentLink || !serverTooOld(server)) return null
  const which = server?.version ?? 'old'
  if (hidden === which) return null
  return (
    <aside className="connector-bar" data-test="connector-bar" aria-label={tr("ScanRuler connector out of date")}>
      <p>
        <b>{tr("Your ScanRuler connector is out of date.")}</b> {tr("Your AI app started scanruler-mcp")}{' '}
        {server?.version ? server.version : `older than ${WANTS_SERVER}`}{tr("; this ScanRuler needs")}{' '}{WANTS_SERVER} {tr("or newer, so some of what the agent asks may not work.")}{' '}</p>
      <div className="connector-ask" data-test="connector-bar-ask">
        <b>{tr("Easiest: ask your AI agent.")}</b> {tr("Paste this into its chat:")}{' '}<code>{CONNECTOR_ASK}</code>
        <CopyButton label="Copy" className="ghost" onCopy={() => void navigator.clipboard?.writeText(CONNECTOR_ASK)} />
      </div>
      <p>
        <b>{tr("Or by hand:")}</b> {tr("change the app's ScanRuler setting to the one below, then")}{' '}<b>{tr("quit the app completely")}</b> {tr("(not just its window)")}{' '}
        <b>{tr("and open it again")}</b>{tr(". With more than one AI app open, the old connector may be another app's — one left open in the background holds the connection for all of them: quit it.")}{' '}</p>
      <ul>
        {CONNECTOR_STEPS.map((step) => (
          <li key={step.app}>
            <span>
              <b>{step.app}</b> — {step.how}:
            </span>
            <code>{step.text}</code>
            <CopyButton label="Copy" className="ghost" onCopy={() => void navigator.clipboard?.writeText(step.text)} />
          </li>
        ))}
      </ul>
      <button className="ghost" data-test="connector-bar-hide" onClick={() => setHidden(which)}>
        {tr("Hide")}{' '}</button>
    </aside>
  )
}
