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
	let cleanStructure: {
		title: any;
		slug: string | undefined;
		id: string | undefined;
		group: string | undefined;
		breadcrumb: any;
		weight: number;
		depth: number;
		isIndex: boolean;
		isCurrent: boolean;
	}[] = [];

	collectionPages.forEach((page: any) => {
		let schema = {
			title: page.data.title,
			slug: page.collection + '/' + page.slug,
			id: page.collection + '/' + page.id,
			group: page.data.group,
			breadcrumb: page.id
				.split('/')
				.filter(Boolean)
				.slice(0, -1)
				.concat(page.slug.split('/').pop().startsWith('index') ? [page.slug.split('/').pop()] : []),
			weight: page.data.weight,
			depth: page.slug.split('/').filter(Boolean).slice(0, -1).length,
			isIndex: page.id.split('/').pop().startsWith('index'),
			isCurrent: currentPath == '/' + page.collection + '/' + page.slug,
		};
		cleanStructure.push(schema);
	});

	// Step 2. Structure the array into nested structure based on slug
	function createNestedStructure(array) {
		// Initialize an empty structure
		let structure = [];

		// Insert into structure
		function insertIntoStructure(structure, item) {
			let currentLevel = structure;

			item.breadcrumb.forEach((directory, index) => {
				// Check if breadcrumb already exists at this level
				let existing = currentLevel.find((e) => Object.keys(e)[0] === directory);
				if (!existing) {
					// If not existing, add a new structure for this breadcrumb
					const newStructure = {
						[directory]: {
							label: directory,
							content: [],
							children: [],
						},
					};
					currentLevel.push(newStructure);
					existing = newStructure;
				}
				if (index === item.breadcrumb.length - 1) {
					if (item.isIndex === true) {
						Object.assign(existing[directory], item);
					} else {
						// If it's the last breadcrumb, insert the item into content and sort
						existing[directory].content.push(item);
						existing[directory].content.sort((a, b) => a.weight - b.weight);
					}
				}

				// Move to the children array for the next breadcrumb
				currentLevel = existing[directory].children;
			});
		}

		// For each clean item in the array, insert it into the structure
		array.forEach((item) => {
			insertIntoStructure(structure, item);
		});

		return structure;
	}

	const nestedStructure = createNestedStructure(cleanStructure);

	// Step 3. Apply overrides from rdocs.config.ts
	function reorderBasedOnOverrides(originalArray, overrideArray) {
		// This function reorders the original array based on the presence and order of elements in the override array
		const orderedArray = [];
		const originalArrayMap = new Map();

		// Create a map for quick lookup
		originalArray.forEach((entry) => {
			const key = Object.keys(entry)[0];
			originalArrayMap.set(key, entry);
		});

		// Place override items first in the ordered array
		overrideArray.forEach((overrideEntry) => {
			const overrideKey = Object.keys(overrideEntry)[0];
			if (originalArrayMap.has(overrideKey)) {
				orderedArray.push(originalArrayMap.get(overrideKey));
				originalArrayMap.delete(overrideKey);
			}
		});

		// Add remaining items from the original array
		originalArrayMap.forEach((entry) => {
			orderedArray.push(entry);
		});

		return orderedArray;
	}

	function applyOverrides(original, overrides) {
		// This function recursively applies overrides to the original object
		for (let key in overrides) {
			if (Array.isArray(original[key]) && Array.isArray(overrides[key])) {
				original[key] = reorderBasedOnOverrides(original[key], overrides[key]);
				original[key].forEach((originalChild, index) => {
					const originalKey = Object.keys(originalChild)[0];
					if (overrides[key][index] && overrides[key][index].hasOwnProperty(originalKey)) {
						applyOverrides(originalChild[originalKey], overrides[key][index][originalKey]);
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
		// This function reorders the array and applies overrides to each matching section
		const orderedSampleArray = reorderBasedOnOverrides(array, overrides);
		orderedSampleArray.forEach((sampleEntry) => {
			const sectionKey = Object.keys(sampleEntry)[0];
			const matchingOverride = overrides.find((override) => override.hasOwnProperty(sectionKey));
			if (matchingOverride) {
				applyOverrides(sampleEntry[sectionKey], matchingOverride[sectionKey]);
			}
		});
		return orderedSampleArray;
	}

	// console.dir(nestedStructure, { depth: null });
	return outputFinalArray(nestedStructure, overrides);
}
