import { useSelector } from 'react-redux';

const BookThemeProvider = ({ children }) => {
  const { preferences } = useSelector((state) => state.preferences);

  // Apply theme styles only to the book content
  const themeStyles = {
    fontFamily: preferences?.fontFamily === 'dyslexic'
      ? 'OpenDyslexic, sans-serif'
      : preferences?.fontFamily,
    fontSize: `${preferences?.fontSize}px`,
    lineHeight: preferences?.lineSpacing,
    letterSpacing: `${preferences?.letterSpacing}em`,
  };

  // Apply book-specific theme class based on the selected theme
  const themeClass = preferences?.theme === 'dark'
    ? 'bg-gray-900 text-gray-100'
    : preferences?.theme === 'sepia'
      ? 'bg-amber-50 text-amber-900'
      : 'bg-white text-gray-800';

  return (
    <div className={themeClass} style={themeStyles}>
      {children}
    </div>
  );
};

export default BookThemeProvider;
