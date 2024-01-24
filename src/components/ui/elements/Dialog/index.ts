import Dialog from './Dialog.astro';
import Trigger from './Trigger.astro';
import Content from './Content.astro';
import Separator from './Separator.astro';

const Component = Object.assign(Dialog, {
  Trigger,
  Content,
  Separator,
});

export default Component;
