import { article } from './ascii'
import { ACTION_LINK } from './words'

export interface Caption {
  person: string
  action: string
  /** Empty when the verb takes the object directly. */
  preposition: string
  /** Article (or measure phrase) in front of the object. */
  determiner: string
  object: string
}

/** Grammar for a PAO frame, keeping every action-object pair readable. */
export function caption(person: string, action: string, object: string): Caption {
  const link = ACTION_LINK[action] ?? 'direct'
  return {
    person,
    action,
    preposition: link === 'direct' ? '' : link,
    determiner: object === 'scissors' ? 'a pair of' : article(object),
    object,
  }
}

export function captionText(person: string, action: string, object: string) {
  const c = caption(person, action, object)
  return `${c.person} is ${c.action} ${c.preposition ? `${c.preposition} ` : ''}${c.determiner} ${c.object}.`
}
