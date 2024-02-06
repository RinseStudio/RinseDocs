import prettier from 'prettier';

// Function to get data from an object by path
export function getData(path, data) {
  const keys = path.split('.');
  const result = keys.reduce(
    (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
    data,
  );
  return result;
}

// Function to deeply merge multiple source objects into a target object
export function deepMerge(target, ...sources) {
  sources.forEach((source) => {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object') {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = Array.isArray(source[key]) ? [] : {};
        }
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  });
  return target;
}

// Helper function to prettify code
export async function prettify(content, parser) {
  try {
    const formattedCode = await prettier.format(content, {
      parser: parser,
    });
    return formattedCode;
  } catch (error) {
    console.error('Error formatting code:', error);
    throw error; // Re-throw the error for the caller to handle
  }
}

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

export function buildNavigation(
  collectionPages,
  currentPath = '',
  overrides = [],
) {
  // Step 1: Create a clean content array structure based on content collection array.
  let cleanStructure = [];

  collectionPages.forEach((page) => {
    let schema = {
      title: page.data.title,
      url: page.collection + '/' + page.slug.split('/').slice(1).join('/'),
      // url: page.collection + '/' + page.slug,
      id: page.id.split('/').slice(0, -1).join('/').toLowerCase(), // Normalization is needed to compare 'Input' with 'input'
      childOfID: page.slug.split('/').slice(0, -1).join('/').toLowerCase(),
      group: page.id.split('/')[0],
      breadcrumb: page.slug.split('/').slice(1, -1),
      weight: page.data.weight,
      isIndex: page.id.split('/').pop().startsWith('index'),
      pages: [],
    };
    cleanStructure.push(schema);
  });

  // Step 2: Group based on group property
  function groupByGroup(input) {
    const grouped = input.reduce((accumulator, currentItem) => {
      // Initialize the group in the accumulator if it doesn't exist
      if (!accumulator[currentItem.group]) {
        accumulator[currentItem.group] = {
          label: currentItem.group,
          pages: [],
        };
      }

      // Add the current item to its group's pages array
      accumulator[currentItem.group].pages.push(currentItem);

      return accumulator; // Pass the accumulator on for the next iteration
    }, {}); // Start with an empty object as the accumulator

    // Extract the grouped objects into an array
    return Object.values(grouped);
  }

  const groupedArray = groupByGroup(cleanStructure);

  // Step 3: Sort and nest pages
  function nestItemsByIndexAndID(items) {
    // Step 3.1: Initialize a Map to store index items for quick lookup.
    // Index items are identified by 'isIndex: true' and can contain nested 'pages'.
    const indexMap = new Map();

    // Step 3.2: Populate the indexMap with index items.
    // Each index item's 'id' is used as a key in the map for quick reference,
    // and the item's 'pages' property is initialized to an empty array to hold nested items.
    items.forEach((item) => {
      if (item.isIndex) {
        item.pages = []; // Prepare to hold child items
        indexMap.set(item.id, item); // Add to map for quick lookup
      }
    });

    // Step 3.3: Nest items within their respective parent index items.
    // Items are nested by matching each item's 'childOfID' with an index item's 'id' in the indexMap.
    // Nested items are added to their parent item's 'pages' array.
    items.forEach((item) => {
      if (item.childOfID && indexMap.has(item.childOfID)) {
        // Retrieve the parent item using 'childOfID' and nest the current item within it.
        const parentItem = indexMap.get(item.childOfID);
        parentItem.pages.push(item); // Add current item as a nested page
      }
    });

    // Step 3.4: Build the final array of top-level items.
    // This array includes items that are top-level index items (no 'childOfID')
    // and non-index items that are not nested within any other item.

    return items.filter((item) => {
      // Check if the item is a top-level index item
      const isTopLevelIndex = item.isIndex && !item.childOfID;
      // Check if the item is not nested within any index item
      const isNotNested = !indexMap.has(item.childOfID);

      // Log the item and the condition results for debugging
      // console.log(`Processing item: ${item.title}`);
      // console.log(`Is top-level index: ${isTopLevelIndex}`);
      // console.log(`Is not nested: ${isNotNested} \n`);

      // The filter includes the item if it's a top-level index or if it's not nested
      return isTopLevelIndex || isNotNested;
    });
  }

  function sortPages(pages) {
    // Sort the current level based on the weight property.
    const sortedPages = pages.sort((a, b) => a.weight - b.weight);

    // Go through each page and recursively sort its children if any.
    sortedPages.forEach((page) => {
      if (page.pages && page.pages.length > 0) {
        page.pages = sortPages(page.pages); // Recursively sort child pages.
      }
    });

    return sortedPages;
  }

  const nestedArray = groupedArray.map((item) => ({
    label: item.label,
    pages: sortPages(nestItemsByIndexAndID(item.pages)),
  }));

  // Step 4. Reorder based on override
  function reorderArrayBasedOnOverrides(sampleArray, overridesArray) {
    const overrideMap = new Map(
      overridesArray.map((item) => [item.label[0], item.label[1]]),
    );

    sampleArray.sort((a, b) => {
      const labelA = overrideMap.get(a.label);
      const labelB = overrideMap.get(b.label);

      if (labelA !== undefined && labelB !== undefined) {
        return (
          overridesArray.findIndex((item) => item.label[0] === a.label) -
          overridesArray.findIndex((item) => item.label[0] === b.label)
        );
      } else if (labelA !== undefined) {
        return -1;
      } else if (labelB !== undefined) {
        return 1;
      } else {
        return 0;
      }
    });

    return sampleArray;
  }

  const reorderedArray = reorderArrayBasedOnOverrides(nestedArray, overrides);

  // Step 5. Update labels based on override
  function updateLabels(sampleArray, overridesArray) {
    // Create a map for quick lookup of overrides
    const overridesMap = new Map(
      overridesArray.map(({ label }) => [label[0], label[1]]),
    );

    // Update labels in the sample array
    const updatedArray = sampleArray.map(({ label, pages }) => ({
      label: overridesMap.get(label) || label,
      pages: pages,
    }));

    return updatedArray;
  }

  const finalArray = updateLabels(reorderedArray, overrides);
  return finalArray;
}
