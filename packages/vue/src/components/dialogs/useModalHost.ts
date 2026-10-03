import { inject, isRef, shallowRef, type ShallowRef } from 'vue'
import { utensilRootElementKey } from '../../utensil-keys'

type ProvidedRoot = Node | ShallowRef<HTMLElement | undefined> | undefined

const modalHosts = new Map<Node, ShallowRef<HTMLElement>>()

/**
 * Returns a ref to the modal host element for teleporting modal/dialog content.
 *
 * The modal host is determined by:
 * 1. If a UtensilModalHost component is in the ancestor tree, uses its element (via utensilRootElementKey ref)
 * 2. Otherwise falls back to creating a host appended to document.body
 *
 * When using UtensilModalHost, the teleported content will be inside the theme tree
 * and have access to theme CSS variables.
 *
 * @returns A ref to the modal host element. Always returns a ref for consistent API.
 */
export function useModalHost(): ShallowRef<HTMLElement | undefined> {
  const providedRoot = inject<ProvidedRoot>(utensilRootElementKey, undefined)

  // If a ref is provided (from UtensilModalHost), return it directly
  if (isRef(providedRoot)) {
    return providedRoot
  }

  // Legacy behavior: create a modal host element appended to the provided node or body
  const root = providedRoot || document.body

  if (modalHosts.has(root)) {
    return modalHosts.get(root)!
  }

  const modalHost = document.createElement('div')
  root.appendChild(modalHost)

  // Wrap in a ref for consistent return type
  const modalHostRef = shallowRef(modalHost)
  modalHosts.set(root, modalHostRef)

  return modalHostRef
}
