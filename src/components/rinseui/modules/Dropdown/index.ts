import Dropdown from '@rinseui/modules/Dropdown/Dropdown.astro';
import Trigger from '@rinseui/modules/Dropdown/Trigger.astro';
import Content from '@rinseui/modules/Dropdown/Content.astro';
import Group from '@rinseui/modules/Dropdown/Group.astro';
import Header from '@rinseui/modules/Dropdown/Header.astro';
import Item from '@rinseui/modules/Dropdown/Item.astro';
import Items from '@rinseui/modules/Dropdown/Items.astro';
import Separator from '@rinseui/modules/Dropdown/Separator.astro';

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
