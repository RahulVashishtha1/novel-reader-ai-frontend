import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SharedContentViewer from '../components/SharedContentViewer';

const Share = () => {
  const { shareId } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Set page title
  useEffect(() => {
    document.title = 'Shared Content | VisNovel';
    
    return () => {
      document.title = 'VisNovel';
    };
  }, []);
  
  // If no shareId is provided, redirect to home
  if (!shareId) {
    return <Navigate to="/" />;
  }
  
  return <SharedContentViewer />;
};

export default Share;
