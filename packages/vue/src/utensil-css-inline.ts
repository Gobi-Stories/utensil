import layers from 'utensil-css/utensil-layers.css?inline'
import a from 'utensil-css/theme/colors/gray.css?inline'
import b from 'utensil-css/utensil-reset.css?inline'
import c from 'utensil-css/theme/utensil-theme.css?inline'
import d from 'utensil-css/theme/text-themes.css?inline'
import e from 'utensil-css/utensil-utilities.css?inline'

// Layer order must be established before any CSS that mentions the layers
export default [layers, a, b, c, d, e].join('\n')
