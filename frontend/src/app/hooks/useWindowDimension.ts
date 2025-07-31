import { useState, useEffect } from 'react';

const useWindowDimension = () => {
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set mounted flag and initial dimensions
    setIsMounted(true);
    handleResize();

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Return default values during SSR, actual values after hydration
  return {
    width: isMounted ? windowDimension.width : 1024,
    height: isMounted ? windowDimension.height : 768,
    isMounted,
  };
};

export default useWindowDimension;
