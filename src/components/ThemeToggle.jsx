import { useSelector, useDispatch } from 'react-redux';
import { setGlobalTheme } from '../features/preferences/preferencesSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state) => state.preferences);
  
  const toggleTheme = () => {
    // Cycle through themes: light -> dark -> sepia -> light
    const nextTheme = 
      preferences.globalTheme === 'light' ? 'dark' : 
      preferences.globalTheme === 'dark' ? 'sepia' : 'light';
    
    dispatch(setGlobalTheme(nextTheme));
  };
  
  // Get the appropriate icon based on the current theme
  const getThemeIcon = () => {
    switch (preferences.globalTheme) {
      case 'dark':
        return '🌙'; // Moon for dark theme
      case 'sepia':
        return '📜'; // Scroll for sepia theme
      default:
        return '☀️'; // Sun for light theme
    }
  };
  
  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition"
      title={`Current theme: ${preferences.globalTheme}. Click to change.`}
    >
      {getThemeIcon()}
    </button>
  );
};

export default ThemeToggle;
