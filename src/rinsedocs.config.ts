// RinseDocs Config
type NavigationOverride = {
	[key: string]: {
		label: string;
		children?: NavigationOverride[];
	};
};

export const SITE = {
	website: 'https://astro-paper.pages.dev/',
	author: 'Sat Naing',
	desc: 'A minimal, responsive and SEO-friendly Astro blog theme.',
	title: 'AstroPaper',
	ogImage: 'astropaper-og.jpg',
	lightAndDarkMode: true,
	postPerPage: 3,

	sidebar: {
		components: [
			{
				general: {
					label: 'General first?',
				},
			},
			{
				form: {
					label: 'Form lets go',
				},
			},
		] as NavigationOverride[],
	},
};
