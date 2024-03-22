import { useEffect, useCallback } from "react";

/* export const useDebouncedEffect = (effect, delay, deps) => {
    // eslint-disable-next-line 
   const callback = useCallback(effect, deps);
 ​
   useEffect(() => {
     const handler = setTimeout(() => {
       callback();
     }, delay);
 ​
     return () => {
       clearTimeout(handler);
     };
   }, [callback, delay]);
 }; */

export const debounce = (callback: (e: any) => any, delay: number) => {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay);
  };
};
