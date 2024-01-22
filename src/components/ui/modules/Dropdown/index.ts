import Dropdown from './Dropdown.astro';
import Trigger from './Trigger.astro';
import Content from './Content.astro';
import Group from './Group.astro';
import Header from './Header.astro';
import Item from './Item.astro';
import Items from './Items.astro';
import Separator from './Separator.astro';

const Component = Object.assign(Dropdown, {
  Group,
  Trigger,
  Content,
  Header,
  Item,
  Items,
  Separator,
});

export default Component;
