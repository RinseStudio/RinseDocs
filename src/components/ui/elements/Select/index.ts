import Select from './Select.astro';
import Trigger from './Trigger.astro';
import Value from './Value.astro';
import Content from './Content.astro';
import Group from './Group.astro';
import Header from './Header.astro';
import Item from './Item.astro';
import Items from './Items.astro';
import Separator from './Separator.astro';

const Component = Object.assign(Select, {
  Group,
  Trigger,
  Value,
  Content,
  Header,
  Item,
  Items,
  Separator,
});

export default Component;
