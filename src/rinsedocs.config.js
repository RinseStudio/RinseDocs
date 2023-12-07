// Define your SITE constant without using 'as const'
export const SITE = {
	website: 'https://astro-paper.pages.dev/',
	author: 'Sat Naing',
	desc: 'A minimal, responsive and SEO-friendly Astro blog theme.',
	title: 'AstroPaper',
	ogImage: 'astropaper-og.jpg',
	lightAndDarkMode: true,
	postPerPage: 3,

	sidebarOverrides: {
		components: [
			{
				label: ['general', 'General'],
			},
			{
				label: ['inputs', 'Inputs'],
			},
			{
				label: ['getting-started', 'Getting Started'],
			},
			{
				label: ['data-display', 'Data Display'],
			},
		], // Use the type for the array of overrides here
	},
};
