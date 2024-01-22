import Card from '@rinseui/elements/Card/Card.astro';
import Group from '@rinseui/elements/Card/Group.astro';
import Separator from '@rinseui/elements/Card/Separator.astro';

const Component = Object.assign(Card, {
  Group,
  Separator,
});

export default Component;
