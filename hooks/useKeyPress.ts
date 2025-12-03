import { useEffect, useState } from 'react';

/**
 * Hook to detect keyboard key presses
 * @param targetKey - Key to detect (e.g., 'Enter', 'Escape', 'a')
 * @param options - Optional configuration
 * @returns true if key is currently pressed
 */
export function useKeyPress(
  targetKey: string,
  options: {
    ctrlKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    metaKey?: boolean;
  } = {}
): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      const modifiersMatch =
        (!options.ctrlKey || event.ctrlKey) &&
        (!options.shiftKey || event.shiftKey) &&
        (!options.altKey || event.altKey) &&
        (!options.metaKey || event.metaKey);

      if (event.key === targetKey && modifiersMatch) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey, options.ctrlKey, options.shiftKey, options.altKey, options.metaKey]);

  return keyPressed;
}
