import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll both body and main elements if they have scroll containers
    window.scrollTo(0, 0);
    const mainCanvas = document.getElementById('main-wise-canvas');
    if (mainCanvas) {
      mainCanvas.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
