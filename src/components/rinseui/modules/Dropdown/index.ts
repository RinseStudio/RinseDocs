import Dropdown from '@rinseui/modules/Dropdown/Dropdown.astro';
import Group from '@rinseui/modules/Dropdown/Group.astro';
import Header from '@rinseui/modules/Dropdown/Header.astro';
import Item from '@rinseui/modules/Dropdown/Item.astro';
import Items from '@rinseui/modules/Dropdown/Item.astro';

const Component = Object.assign(Dropdown, {
  Group,
  Header,
  Item,
  Items,
});

export default Component;
