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
				form: {
					label: 'Form',
					children: [
						{
							subform: {
								label: 'Subform',
								children: [
									{
										supersub1: {
											label: 'Supersub',
										},
									},
								],
							},
						},
					],
				},
			},
		] as NavigationOverride[],
	},
};
