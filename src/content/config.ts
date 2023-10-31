import { z, defineCollection } from 'astro:content';

// prettier-ignore
const componentCollection = defineCollection({
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			date: z.date(),
			author: z.string(),
			thumbnail: image(),
			description: z.string().max(160, 'For best SEO results, please keep the description under 160 characters.'),
			category: z.enum(['Component', 'Color', 'Images', 'Icons', 'Prototype']),
			draft: z.boolean().default(false),
			weight: z.number().default(0),
		}),
});

export const collections = {
	components: componentCollection,
};
