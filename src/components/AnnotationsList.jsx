import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAnnotations, deleteAnnotation } from '../features/annotations/annotationsSlice';

const AnnotationsList = ({ novelId, onNavigate, onClose }) => {
  const dispatch = useDispatch();
  const { annotations, loading } = useSelector((state) => state.annotations);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (novelId) {
      dispatch(getAnnotations(novelId));
    }
  }, [dispatch, novelId]);
  
  // Filter annotations based on category and search term
  const filteredAnnotations = annotations.filter((annotation) => {
    const matchesCategory = filter === 'all' || annotation.category === filter;
    const matchesSearch = searchTerm === '' || 
      annotation.textSelection.selectedText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (annotation.note && annotation.note.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });
  
  // Group annotations by page
  const groupedAnnotations = filteredAnnotations.reduce((acc, annotation) => {
    const page = annotation.page;
    if (!acc[page]) {
      acc[page] = [];
    }
    acc[page].push(annotation);
    return acc;
  }, {});
  
  // Sort pages numerically
  const sortedPages = Object.keys(groupedAnnotations).sort((a, b) => parseInt(a) - parseInt(b));
  
  // Handle navigation to a specific page
  const handleNavigateToPage = (page) => {
    onNavigate(parseInt(page));
    onClose();
  };
  
  // Handle deleting an annotation
  const handleDeleteAnnotation = (annotationId, event) => {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this annotation?')) {
      dispatch(deleteAnnotation(annotationId));
    }
  };
  
  // Get color name from hex code
  const getColorName = (hexColor) => {
    const colorMap = {
      '#ffff00': 'Yellow',
      '#90ee90': 'Green',
      '#add8e6': 'Blue',
      '#ffb6c1': 'Pink',
      '#ffa500': 'Orange',
    };
    
    return colorMap[hexColor] || 'Custom';
  };
  
  // Get category label
  const getCategoryLabel = (category) => {
    const categoryMap = {
      'highlight': 'Highlight',
      'note': 'Note',
      'question': 'Question',
      'important': 'Important',
      'vocabulary': 'Vocabulary',
      'custom': 'Custom',
    };
    
    return categoryMap[category] || 'Highlight';
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Annotations</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {/* Filters and search */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Search annotations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-2 py-1 text-sm rounded-md ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('highlight')}
            className={`px-2 py-1 text-sm rounded-md ${
              filter === 'highlight' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Highlights
          </button>
          <button
            onClick={() => setFilter('note')}
            className={`px-2 py-1 text-sm rounded-md ${
              filter === 'note' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setFilter('important')}
            className={`px-2 py-1 text-sm rounded-md ${
              filter === 'important' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Important
          </button>
        </div>
      </div>
      
      {/* Annotations list */}
      <div className="flex-grow overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading annotations...</div>
          </div>
        ) : filteredAnnotations.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No annotations found.
          </div>
        ) : (
          <div className="space-y-4">
            {sortedPages.map((page) => (
              <div key={page} className="border border-gray-200 rounded-md overflow-hidden">
                <div
                  className="bg-gray-100 px-4 py-2 font-medium cursor-pointer hover:bg-gray-200"
                  onClick={() => handleNavigateToPage(page)}
                >
                  Page {page} ({groupedAnnotations[page].length})
                </div>
                <div className="divide-y divide-gray-200">
                  {groupedAnnotations[page].map((annotation) => (
                    <div
                      key={annotation._id}
                      className="p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleNavigateToPage(annotation.page)}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center">
                          <span
                            className="inline-block w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: annotation.color }}
                          ></span>
                          <span className="text-sm text-gray-500">
                            {getColorName(annotation.color)} {getCategoryLabel(annotation.category)}
                          </span>
                        </div>
                        <button
                          onClick={(e) => handleDeleteAnnotation(annotation._id, e)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="text-sm font-medium mb-1">
                        "{annotation.textSelection.selectedText.length > 100
                          ? annotation.textSelection.selectedText.substring(0, 100) + '...'
                          : annotation.textSelection.selectedText}"
                      </div>
                      {annotation.note && (
                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <span className="font-medium">Note:</span> {annotation.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnotationsList;
