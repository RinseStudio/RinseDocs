import Card from './Card.astro';
import Group from './Group.astro';
import Separator from './Separator.astro';

const Component = Object.assign(Card, {
  Group,
  Separator,
});

export default Component;
