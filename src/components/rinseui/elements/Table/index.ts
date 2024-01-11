import Table from './Table.astro';
import Header from './Header.astro';
import Body from './Body.astro';
import Footer from './Footer.astro';
import Row from './Row.astro';
import Head from './Head.astro';
import Cell from './Cell.astro';

const Component = Object.assign(Table, {
  Header,
  Body,
  Footer,
  Row,
  Head,
  Cell,
});

export default Component;
