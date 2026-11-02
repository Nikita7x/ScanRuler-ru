// SPDX-License-Identifier: AGPL-3.0-only
import { tr } from '../../../src/i18n'
// What the imprint owes the libraries this workspace ships.

export function MeshNotices() {
  return (
    <p>
      {tr("The Mesh Tools workspace reduces meshes with")}{' '}
      <a href="https://github.com/zeux/meshoptimizer" target="_blank" rel="noopener noreferrer">
        {tr("meshoptimizer")}{' '}</a>{' '}
      {tr("(© Arseny Kapoulkine, MIT) and makes its booleans with")}{' '}
      <a href="https://github.com/elalish/manifold" target="_blank" rel="noopener noreferrer">
        {tr("Manifold")}{' '}</a>{' '}
      {tr("(© The Manifold Authors, Apache-2.0). Both are loaded as WebAssembly when they are first used, and are used unmodified.")}{' '}</p>
  )
}
