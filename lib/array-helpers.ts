/**
 * Array manipulation and utility functions
 * Provides helpers for common array operations
 */

/**
 * Removes duplicates from array
 * @param array - Array to process
 * @returns Array with duplicates removed
 */
export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

/**
 * Removes duplicates from array of objects by key
 * @param array - Array of objects
 * @param key - Key to check for uniqueness
 * @returns Array with duplicates removed
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter((item) => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Groups array elements by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Object with grouped elements
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Chunks array into smaller arrays of specified size
 * @param array - Array to chunk
 * @param size - Size of each chunk
 * @returns Array of chunks
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Flattens nested arrays by one level
 * @param array - Array to flatten
 * @returns Flattened array
 */
export function flatten<T>(array: (T | T[])[]): T[] {
  return array.flat() as T[];
}

/**
 * Deep flattens nested arrays
 * @param array - Array to flatten
 * @returns Deeply flattened array
 */
export function flattenDeep<T>(array: any[]): T[] {
  return array.flat(Infinity) as T[];
}

/**
 * Shuffles array randomly
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Gets random element from array
 * @param array - Array to pick from
 * @returns Random element
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets multiple random elements from array
 * @param array - Array to pick from
 * @param count - Number of elements to pick
 * @returns Array of random elements
 */
export function sampleSize<T>(array: T[], count: number): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(count, array.length));
}

/**
 * Computes intersection of arrays
 * @param arrays - Arrays to intersect
 * @returns Array of common elements
 */
export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  const [first, ...rest] = arrays;
  return unique(first.filter((item) => rest.every((arr) => arr.includes(item))));
}

/**
 * Computes difference between arrays
 * @param array - Base array
 * @param other - Array to subtract
 * @returns Elements in first array but not in second
 */
export function difference<T>(array: T[], other: T[]): T[] {
  return array.filter((item) => !other.includes(item));
}

/**
 * Computes union of arrays
 * @param arrays - Arrays to union
 * @returns Array of all unique elements
 */
export function union<T>(...arrays: T[][]): T[] {
  return unique(arrays.flat());
}

/**
 * Sorts array of objects by key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param order - Sort order ('asc' | 'desc')
 * @returns Sorted array
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Finds first element matching predicate
 * @param array - Array to search
 * @param predicate - Function to test elements
 * @returns First matching element or undefined
 */
export function findFirst<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  return array.find(predicate);
}

/**
 * Finds last element matching predicate
 * @param array - Array to search
 * @param predicate - Function to test elements
 * @returns Last matching element or undefined
 */
export function findLast<T>(
  array: T[],
  predicate: (item: T) => boolean
): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
  return undefined;
}

/**
 * Partitions array into two arrays based on predicate
 * @param array - Array to partition
 * @param predicate - Function to test elements
 * @returns Tuple of [matching, non-matching] arrays
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const matching: T[] = [];
  const nonMatching: T[] = [];

  array.forEach((item) => {
    if (predicate(item)) {
      matching.push(item);
    } else {
      nonMatching.push(item);
    }
  });

  return [matching, nonMatching];
}

/**
 * Removes falsy values from array
 * @param array - Array to compact
 * @returns Array without falsy values
 */
export function compact<T>(array: T[]): NonNullable<T>[] {
  return array.filter((item): item is NonNullable<T> => Boolean(item));
}

/**
 * Creates array of numbers in range
 * @param start - Start of range
 * @param end - End of range (exclusive)
 * @param step - Step between numbers
 * @returns Array of numbers
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Takes first n elements from array
 * @param array - Array to take from
 * @param count - Number of elements to take
 * @returns Array of first n elements
 */
export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, Math.max(0, count));
}

/**
 * Takes last n elements from array
 * @param array - Array to take from
 * @param count - Number of elements to take
 * @returns Array of last n elements
 */
export function takeLast<T>(array: T[], count: number): T[] {
  return array.slice(Math.max(0, array.length - count));
}

/**
 * Drops first n elements from array
 * @param array - Array to drop from
 * @param count - Number of elements to drop
 * @returns Array without first n elements
 */
export function drop<T>(array: T[], count: number): T[] {
  return array.slice(Math.max(0, count));
}

/**
 * Drops last n elements from array
 * @param array - Array to drop from
 * @param count - Number of elements to drop
 * @returns Array without last n elements
 */
export function dropLast<T>(array: T[], count: number): T[] {
  return array.slice(0, Math.max(0, array.length - count));
}

/**
 * Checks if arrays are equal (shallow comparison)
 * @param array1 - First array
 * @param array2 - Second array
 * @returns true if arrays are equal
 */
export function isEqual<T>(array1: T[], array2: T[]): boolean {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

/**
 * Gets minimum value from array
 * @param array - Array of numbers
 * @returns Minimum value or undefined
 */
export function min(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.min(...array);
}

/**
 * Gets maximum value from array
 * @param array - Array of numbers
 * @returns Maximum value or undefined
 */
export function max(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return Math.max(...array);
}

/**
 * Calculates sum of array elements
 * @param array - Array of numbers
 * @returns Sum of all elements
 */
export function sum(array: number[]): number {
  return array.reduce((acc, val) => acc + val, 0);
}

/**
 * Calculates average of array elements
 * @param array - Array of numbers
 * @returns Average value or undefined
 */
export function average(array: number[]): number | undefined {
  if (array.length === 0) return undefined;
  return sum(array) / array.length;
}

/**
 * Counts occurrences of each element
 * @param array - Array to count
 * @returns Object with element counts
 */
export function countBy<T extends string | number>(array: T[]): Record<T, number> {
  return array.reduce((result, item) => {
    result[item] = (result[item] || 0) + 1;
    return result;
  }, {} as Record<T, number>);
}

/**
 * Zips multiple arrays together
 * @param arrays - Arrays to zip
 * @returns Array of tuples
 */
export function zip<T>(...arrays: T[][]): T[][] {
  const maxLength = Math.max(...arrays.map((arr) => arr.length));
  const result: T[][] = [];

  for (let i = 0; i < maxLength; i++) {
    result.push(arrays.map((arr) => arr[i]));
  }

  return result;
}

/**
 * Moves element from one index to another
 * @param array - Array to modify
 * @param fromIndex - Source index
 * @param toIndex - Destination index
 * @returns New array with element moved
 */
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}
