import Dropdown from '@rinseui/modules/Dropdown/Dropdown.astro';
import Group from '@rinseui/modules/Dropdown/Group.astro';
import Header from '@rinseui/modules/Dropdown/Header.astro';
import Item from '@rinseui/modules/Dropdown/Item.astro';
import Items from '@rinseui/modules/Dropdown/Items.astro';
import Separator from '@rinseui/modules/Dropdown/Separator.astro';

const Component = Object.assign(Dropdown, {
  Group,
  Header,
  Item,
  Items,
  Separator,
});

export default Component;
