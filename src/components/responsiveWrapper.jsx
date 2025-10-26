import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DesktopPage from './DesktopPage';

const ResponsiveWrapper = ({ children, desktopTitle = "데스크톱 전용 페이지" }) => {
  const [isMobile, setIsMobile] = useState(true);
  const location = useLocation();
  const isPracticePage = location.pathname === '/practice';

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // practice 페이지는 데스크톱에서도 DesktopPage를 적용하지 않음
  if (!isMobile && !isPracticePage) {
    return <DesktopPage title={desktopTitle}>{children}</DesktopPage>;
  }

  return <>{children}</>;
};

export default ResponsiveWrapper;
