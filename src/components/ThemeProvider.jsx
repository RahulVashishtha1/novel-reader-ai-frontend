import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { preferences } = useSelector((state) => state.preferences);

  useEffect(() => {
    // Apply theme to the document
    document.documentElement.setAttribute('data-theme', preferences.theme);
    
    // Apply dyslexia friendly mode
    document.documentElement.setAttribute('data-dyslexia', preferences.dyslexiaFriendly.toString());
    
    // Apply font settings as CSS variables
    document.documentElement.style.setProperty('--font-size', `${preferences.fontSize}px`);
    document.documentElement.style.setProperty('--font-family', preferences.fontFamily);
    document.documentElement.style.setProperty('--line-height', preferences.lineSpacing);
    document.documentElement.style.setProperty('--letter-spacing', `${preferences.letterSpacing}em`);
  }, [preferences]);

  return children;
};

export default ThemeProvider;
