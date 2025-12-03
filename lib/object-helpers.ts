/**
 * Object manipulation and utility functions
 * Provides helpers for common object operations
 */

/**
 * Deep clones an object
 * @param obj - Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item)) as T;
  }

  if (obj instanceof Object) {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * Picks specified keys from object
 * @param obj - Source object
 * @param keys - Keys to pick
 * @returns Object with only specified keys
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
}

/**
 * Omits specified keys from object
 * @param obj - Source object
 * @param keys - Keys to omit
 * @returns Object without specified keys
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result as Omit<T, K>;
}

/**
 * Deep merges two or more objects
 * @param objects - Objects to merge
 * @returns Merged object
 */
export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result = {} as T;

  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      const typedKey = key as keyof T;
      const value = obj[typedKey];

      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result[typedKey] = deepMerge(
          (result[typedKey] || {}) as object,
          value as object
        ) as T[keyof T];
      } else {
        result[typedKey] = value as T[keyof T];
      }
    });
  });

  return result;
}

/**
 * Checks if object is empty
 * @param obj - Object to check
 * @returns true if object has no keys
 */
export function isEmpty(obj: object): boolean {
  return Object.keys(obj).length === 0;
}

/**
 * Gets nested value from object using dot notation path
 * @param obj - Source object
 * @param path - Dot notation path (e.g., 'user.address.city')
 * @param defaultValue - Default value if path not found
 * @returns Value at path or default value
 */
export function get<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result === null || result === undefined) {
      return defaultValue;
    }
    result = result[key];
  }

  return result !== undefined ? result : defaultValue;
}

/**
 * Sets nested value in object using dot notation path
 * @param obj - Target object
 * @param path - Dot notation path
 * @param value - Value to set
 * @returns Modified object
 */
export function set<T extends object>(obj: T, path: string, value: any): T {
  const keys = path.split('.');
  const lastKey = keys.pop();

  if (!lastKey) return obj;

  let current: any = obj;

  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
  return obj;
}

/**
 * Checks if object has specified path
 * @param obj - Object to check
 * @param path - Dot notation path
 * @returns true if path exists
 */
export function has(obj: any, path: string): boolean {
  const keys = path.split('.');
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return false;
    }
    current = current[key];
  }

  return true;
}

/**
 * Inverts object keys and values
 * @param obj - Object to invert
 * @returns Inverted object
 */
export function invert<T extends Record<string, string | number>>(
  obj: T
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(obj).forEach(([key, value]) => {
    result[String(value)] = key;
  });

  return result;
}

/**
 * Maps object values
 * @param obj - Source object
 * @param mapper - Function to map values
 * @returns Object with mapped values
 */
export function mapValues<T extends object, U>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>;

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    result[key] = mapper(obj[key], key);
  });

  return result;
}

/**
 * Maps object keys
 * @param obj - Source object
 * @param mapper - Function to map keys
 * @returns Object with mapped keys
 */
export function mapKeys<T extends object>(
  obj: T,
  mapper: (key: keyof T) => string
): Record<string, T[keyof T]> {
  const result: Record<string, T[keyof T]> = {};

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const newKey = mapper(key);
    result[newKey] = obj[key];
  });

  return result;
}

/**
 * Filters object by predicate
 * @param obj - Source object
 * @param predicate - Function to test entries
 * @returns Filtered object
 */
export function filter<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result = {} as Partial<T>;

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    if (predicate(obj[key], key)) {
      result[key] = obj[key];
    }
  });

  return result;
}

/**
 * Gets all object keys with type safety
 * @param obj - Object to get keys from
 * @returns Array of keys
 */
export function keys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Gets all object values with type safety
 * @param obj - Object to get values from
 * @returns Array of values
 */
export function values<T extends object>(obj: T): Array<T[keyof T]> {
  return Object.values(obj) as Array<T[keyof T]>;
}

/**
 * Gets all object entries with type safety
 * @param obj - Object to get entries from
 * @returns Array of [key, value] tuples
 */
export function entries<T extends object>(
  obj: T
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Creates object from entries
 * @param entries - Array of [key, value] tuples
 * @returns Object created from entries
 */
export function fromEntries<K extends string | number | symbol, V>(
  entries: Array<[K, V]>
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>;
}

/**
 * Removes undefined and null values from object
 * @param obj - Object to compact
 * @returns Object without undefined/null values
 */
export function compact<T extends object>(obj: T): Partial<T> {
  return filter(obj, (value) => value !== undefined && value !== null);
}

/**
 * Deep comparison of two objects
 * @param obj1 - First object
 * @param obj2 - Second object
 * @returns true if objects are deeply equal
 */
export function isEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    obj1 === null ||
    obj2 === null ||
    typeof obj1 !== 'object' ||
    typeof obj2 !== 'object'
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => isEqual(obj1[key], obj2[key]));
}

/**
 * Flattens nested object to single level with dot notation keys
 * @param obj - Object to flatten
 * @param prefix - Prefix for keys (used internally)
 * @returns Flattened object
 */
export function flatten(obj: any, prefix: string = ''): Record<string, any> {
  const result: Record<string, any> = {};

  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flatten(value, newKey));
    } else {
      result[newKey] = value;
    }
  });

  return result;
}

/**
 * Unflattens object with dot notation keys to nested structure
 * @param obj - Flattened object
 * @returns Nested object
 */
export function unflatten(obj: Record<string, any>): any {
  const result: any = {};

  Object.entries(obj).forEach(([key, value]) => {
    set(result, key, value);
  });

  return result;
}

/**
 * Freezes object deeply (makes immutable)
 * @param obj - Object to freeze
 * @returns Frozen object
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);

  Object.values(obj).forEach((value) => {
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });

  return obj;
}

/**
 * Creates a shallow copy of object
 * @param obj - Object to copy
 * @returns Copied object
 */
export function clone<T extends object>(obj: T): T {
  return { ...obj };
}

/**
 * Renames keys in an object
 * @param obj - Source object
 * @param keyMap - Map of old keys to new keys
 * @returns Object with renamed keys
 */
export function renameKeys<T extends object>(
  obj: T,
  keyMap: Partial<Record<keyof T, string>>
): any {
  const result: any = {};

  (Object.keys(obj) as Array<keyof T>).forEach((key) => {
    const newKey = keyMap[key] || key;
    result[newKey] = obj[key];
  });

  return result;
}
