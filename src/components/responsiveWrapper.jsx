import React, { useState, useEffect } from 'react';
import DesktopPage from './DesktopPage';

const ResponsiveWrapper = ({ children, desktopTitle = "데스크톱 전용 페이지" }) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isMobile) {
    return <DesktopPage title={desktopTitle}>{children}</DesktopPage>;
  }

  return <>{children}</>;
};

export default ResponsiveWrapper;
