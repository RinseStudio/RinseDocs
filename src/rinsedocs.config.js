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
				label: ['elements', 'Elements'],
			},
			{
				label: ['modules', 'Modules'],
			},
			{
				label: ['layouts', 'Layouts'],
			},
			{
				label: ['templates', 'Templates'],
			},
		], // Use the type for the array of overrides here
	},
};
