import { useEffect, useRef, useState } from "react";

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  // we use observer api to detect if user has reached bottom of list or not to call a function if reached the bottom of list
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const targetRef = useRef<HTMLDivElement>(null); // we create this ref to store the target elemt(the el that observer looks for)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    if (targetRef.current) {
      // if isItersecting is true, target.current(div) it is in users's viewport
      observer.observe(targetRef.current); // observer, observs the target div el whenever it appears in users's viewport
    }

    // clean up fn to remove prev side effects
    return () => observer.disconnect();
  }, [options]);

  return { targetRef, isIntersecting };
}
