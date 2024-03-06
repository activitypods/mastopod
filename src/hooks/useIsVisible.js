import { useState, useEffect } from "react";

const useIsVisible = (ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) =>
        setIsVisible(entry.isIntersecting)
      );
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }
  }, [ref, setIsVisible]);

  return isVisible;
};

export default useIsVisible;
