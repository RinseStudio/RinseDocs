// helpers.js
type Page = any;

type NavigationOverride = {
	[key: string]: {
		label: string;
		children?: NavigationOverride[];
	};
};

// Create breadcrumb based off slug (file-path) and save the last 2 crumbs
export function buildBreadcrumb(slug) {
	let breadcrumb = slug.split('/');
	if (breadcrumb.length > 3) {
		breadcrumb = breadcrumb.slice(-3);
	}
	const prettyBreadcrumb = breadcrumb.map((crumb) =>
		crumb
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' '),
	);
	return prettyBreadcrumb;
}

export function buildNavigation(collectionPages: Page[], currentPath: string = '', overrides: NavigationOverride[] = []) {
	// Step 1. Create a clean content array structure based on content collection array.
	let contentStructure: {
		title: any;
		slug: string | undefined;
		id: string | undefined;
		breadcrumb: any;
		weight: number;
		depth: number;
		isCurrent: boolean;
	}[] = [];

	collectionPages.forEach((page: any) => {
		let schema = {
			title: page.data.title,
			slug: page.collection + '/' + page.slug,
			id: page.collection + '/' + page.id,
			breadcrumb: page.slug.split('/').filter(Boolean).slice(0, -1),
			weight: page.data.weight,
			depth: page.slug.split('/').filter(Boolean).slice(0, -1).length,
			isCurrent: currentPath == '/' + page.collection + '/' + page.slug,
		};
		contentStructure.push(schema);
	});

	// Step 2. Structure the array into nested structure based on slug
	function createNestedStructure(array) {
		function insertIntoStructure(structure, item) {
			let currentLevel = structure;
			item.breadcrumb.forEach((crumb, index) => {
				// Check if breadcrumb already exists at this level
				let existing = currentLevel.find((e) => Object.keys(e)[0] === crumb);
				if (!existing) {
					// If not existing, add a new structure for this breadcrumb
					const newStructure = {
						[crumb]: {
							label: crumb,
							content: [],
							children: [],
						},
					};
					currentLevel.push(newStructure);
					existing = newStructure;
				}

				// If it's the last breadcrumb, insert the item into content and sort
				if (index === item.breadcrumb.length - 1) {
					existing[crumb].content.push(item);
					existing[crumb].content.sort((a, b) => a.weight - b.weight);
				}

				// Move to the children array for the next breadcrumb
				currentLevel = existing[crumb].children;
			});
		}

		// Initialize an empty structure
		let structure = [];

		// For each item in the array, insert it into the structure
		array.forEach((item) => {
			insertIntoStructure(structure, item);
		});

		return structure;
	}

	// Step 3. Apply overrides from rdocs.config.ts
	function reorderBasedOnOverrides(originalArray, overrideArray) {
		const orderedArray = [];
		overrideArray.forEach((overrideEntry) => {
			const overrideKey = Object.keys(overrideEntry)[0];
			const originalEntry = originalArray.find((entry) => entry[overrideKey]);
			if (originalEntry) {
				orderedArray.push(originalEntry);
			}
		});

		// Add any other original entries that weren't in the overrides
		originalArray.forEach((entry) => {
			const key = Object.keys(entry)[0];
			if (!orderedArray.some((orderedEntry) => orderedEntry[key])) {
				orderedArray.push(entry);
			}
		});

		return orderedArray;
	}

	function applyOverrides(original, overrides) {
		for (let key in overrides) {
			if (Array.isArray(original[key])) {
				original[key] = reorderBasedOnOverrides(original[key], overrides[key]);
				overrides[key].forEach((overrideChild) => {
					const overrideKey = Object.keys(overrideChild)[0];
					const originalChild = original[key].find((child) => child[overrideKey]);
					if (originalChild) {
						applyOverrides(originalChild[overrideKey], overrideChild[overrideKey]);
					} else {
						// If no matching child is found, add the new child
						original[key].push(overrideChild);
					}
				});
			} else if (typeof original[key] === 'object' && original[key] !== null && overrides[key]) {
				applyOverrides(original[key], overrides[key]);
			} else {
				original[key] = overrides[key];
			}
		}
	}

	function outputFinalArray(array, overrides) {
		const orderedSampleArray = reorderBasedOnOverrides(array, overrides);
		orderedSampleArray.forEach((sampleEntry) => {
			const sectionKey = Object.keys(sampleEntry)[0];
			const matchingOverride = overrides.find((override) => override[sectionKey]);
			if (matchingOverride) {
				applyOverrides(sampleEntry[sectionKey], matchingOverride[sectionKey]);
			}
		});
		return orderedSampleArray;
	}

	const nestedStructure = createNestedStructure(contentStructure);

	return outputFinalArray(nestedStructure, overrides);
}
