import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const ThemeProvider = ({ children }) => {
  const { preferences } = useSelector((state) => state.preferences);

  useEffect(() => {
    // Apply global theme to the document
    document.documentElement.setAttribute('data-theme', preferences.globalTheme);

    // Add themed classes to body for consistent theming across all pages
    document.body.classList.remove('light-theme', 'dark-theme', 'sepia-theme');
    document.body.classList.add(`${preferences.globalTheme}-theme`);

    // Apply theme to app container after a short delay to ensure it's mounted
    setTimeout(() => {
      const appContainer = document.querySelector('.app-container');
      if (appContainer) {
        appContainer.setAttribute('data-theme', preferences.globalTheme);
      }
    }, 0);
  }, [preferences.globalTheme]);

  return children;
};

export default ThemeProvider;
