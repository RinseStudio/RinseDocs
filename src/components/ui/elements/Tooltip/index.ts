import Tooltip from './Tooltip.astro';
import Trigger from './Trigger.astro';
import Content from './Content.astro';

const Component = Object.assign(Tooltip, {
  Trigger,
  Content,
});

export default Component;
