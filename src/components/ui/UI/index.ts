import UI from './UI.astro';
import Preview from './Preview.astro';
import Code from './Code.astro';

const Component = Object.assign(UI, {
  Preview,
  Code,
});

export default Component;
