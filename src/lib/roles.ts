import type { Role } from './ascii'

export const ROLES: Record<Role, { glyph: string; name: string }> = {
  P: { glyph: '(o_o)', name: 'Person' },
  A: { glyph: '>>>', name: 'Action' },
  O: { glyph: '[▓▒]', name: 'Object' },
}

export const ROLE_ORDER: Role[] = ['P', 'A', 'O']
