export type WorkspaceMode = 'write' | 'draw' | 'study'

export interface WorkspacePrefs {
  mode: WorkspaceMode
  splitEnabled: boolean
  gridEnabled: boolean
  snapEnabled: boolean
}

export const defaultWorkspacePrefs: WorkspacePrefs = {
  mode: 'study',
  splitEnabled: true,
  gridEnabled: true,
  snapEnabled: false,
}
