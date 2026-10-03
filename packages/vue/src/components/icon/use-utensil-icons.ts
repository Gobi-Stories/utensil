import { config as fontAwesomeConfig, dom as fontAwesomeDom } from '@fortawesome/fontawesome-svg-core'

// Don't add Font Awesome CSS automatically
fontAwesomeConfig.autoAddCss = false

export function useUtensilIcons(cssRoot: ShadowRoot | HTMLElement) {
  // Apply font Awesome CSS, scoped to the utensil layer so component styles can override it
  if (!cssRoot.querySelector('[data-fontawesome-css]')) {
    const fontAwesomeCss = fontAwesomeDom.css()
    const style = document.createElement('style')
    style.setAttribute('data-fontawesome-css', 'true')
    style.textContent = `@layer utensil {\n${fontAwesomeCss}\n}`
    cssRoot.appendChild(style)
  }
}
