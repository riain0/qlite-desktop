import * as styledComponents from 'styled-components';

import ThemeInterface from './theme';

const {
  default: styled,
  css,
  createGlobalStyle,
  keyframes,
} = styledComponents as styledComponents.ThemedStyledComponentsModule<ThemeInterface>;

export { css, createGlobalStyle, keyframes };
export default styled;