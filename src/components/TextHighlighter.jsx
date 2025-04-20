import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createAnnotation,
  updateAnnotation,
  deleteAnnotation,
  setCurrentAnnotation,
  clearCurrentAnnotation,
} from '../features/annotations/annotationsSlice';

const TextHighlighter = ({ content, novelId, page, isHtml = false }) => {
  const dispatch = useDispatch();
  const { pageAnnotations, currentAnnotation } = useSelector((state) => state.annotations);

  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 });
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ffff00'); // Default yellow
  const [selectedCategory, setSelectedCategory] = useState('highlight');

  const contentRef = useRef(null);
  const toolbarRef = useRef(null);
  const noteInputRef = useRef(null);

  // Available highlight colors
  const highlightColors = [
    { color: '#ffff00', name: 'Yellow' },
    { color: '#90ee90', name: 'Green' },
    { color: '#add8e6', name: 'Blue' },
    { color: '#ffb6c1', name: 'Pink' },
    { color: '#ffa500', name: 'Orange' },
  ];

  // Available categories
  const categories = [
    { value: 'highlight', label: 'Highlight' },
    { value: 'note', label: 'Note' },
    { value: 'question', label: 'Question' },
    { value: 'important', label: 'Important' },
    { value: 'vocabulary', label: 'Vocabulary' },
  ];

  // Handle text selection
  const handleTextSelection = () => {
    const selection = window.getSelection();

    if (selection.toString().trim().length > 0 && contentRef.current) {
      // Get the selected text
      const text = selection.toString();
      setSelectedText(text);

      // Get the range
      const range = selection.getRangeAt(0);

      // Calculate offsets relative to the content element
      const contentElement = contentRef.current;
      const contentText = contentElement.textContent;

      // Create a range from the start of the content to the start of the selection
      const startRange = document.createRange();
      startRange.setStart(contentElement, 0);
      startRange.setEnd(range.startContainer, range.startOffset);

      // The length of this range's text is the start offset
      const startOffset = startRange.toString().length;

      // The end offset is the start offset plus the length of the selected text
      const endOffset = startOffset + text.length;

      setSelectionRange({ startOffset, endOffset });

      // Position the toolbar above the selection
      const rect = range.getBoundingClientRect();
      setToolbarPosition({
        top: rect.top - 50, // Position above the selection
        left: rect.left + (rect.width / 2) - 100, // Center horizontally
      });

      setShowToolbar(true);
    } else {
      // If clicking outside a selection, hide the toolbar
      if (!toolbarRef.current || !toolbarRef.current.contains(event.target)) {
        setShowToolbar(false);
        setShowNoteInput(false);
      }
    }
  };

  // Handle highlighting text
  const handleHighlight = () => {
    if (selectionRange && novelId && page) {
      const annotationData = {
        page,
        textSelection: {
          startOffset: selectionRange.startOffset,
          endOffset: selectionRange.endOffset,
          selectedText,
        },
        color: selectedColor,
        category: selectedCategory,
      };

      dispatch(createAnnotation({ novelId, annotationData }));

      // Clear selection and hide toolbar
      window.getSelection().removeAllRanges();
      setShowToolbar(false);
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  // Handle adding a note
  const handleAddNote = () => {
    setShowNoteInput(true);
  };

  // Handle saving a note
  const handleSaveNote = () => {
    if (selectionRange && novelId && page && noteText.trim()) {
      const annotationData = {
        page,
        textSelection: {
          startOffset: selectionRange.startOffset,
          endOffset: selectionRange.endOffset,
          selectedText,
        },
        color: selectedColor,
        note: noteText,
        category: 'note',
      };

      dispatch(createAnnotation({ novelId, annotationData }));

      // Clear selection and hide toolbar
      window.getSelection().removeAllRanges();
      setShowToolbar(false);
      setShowNoteInput(false);
      setNoteText('');
      setSelectedText('');
      setSelectionRange(null);
    }
  };

  // Handle updating a note
  const handleUpdateNote = () => {
    if (currentAnnotation) {
      const annotationData = {
        note: noteText,
      };

      dispatch(updateAnnotation({
        annotationId: currentAnnotation._id,
        annotationData,
      }));

      setShowNoteInput(false);
      dispatch(clearCurrentAnnotation());
    }
  };

  // Handle deleting an annotation
  const handleDeleteAnnotation = () => {
    if (currentAnnotation) {
      dispatch(deleteAnnotation(currentAnnotation._id));
      setShowToolbar(false);
      setShowNoteInput(false);
      dispatch(clearCurrentAnnotation());
    }
  };

  // Handle clicking on an existing annotation
  const handleAnnotationClick = (annotation, event) => {
    event.stopPropagation();
    dispatch(setCurrentAnnotation(annotation));

    // Position the toolbar near the annotation
    const rect = event.target.getBoundingClientRect();
    setToolbarPosition({
      top: rect.top - 50,
      left: rect.left + (rect.width / 2) - 100,
    });

    setShowToolbar(true);

    if (annotation.note) {
      setNoteText(annotation.note);
      setShowNoteInput(true);
    }
  };

  // Close toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target) &&
        (!noteInputRef.current || !noteInputRef.current.contains(event.target))
      ) {
        setShowToolbar(false);
        setShowNoteInput(false);
        dispatch(clearCurrentAnnotation());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dispatch]);

  // Render the content with annotations
  const renderContentWithAnnotations = () => {
    if (!content) {
      return '';
    }

    // If there are no annotations or if it's HTML content, just return the content
    if (!pageAnnotations || pageAnnotations.length === 0) {
      return content;
    }

    // For HTML content, we need a different approach to annotations
    // This is a simplified implementation - in a production app, you'd want to use a proper HTML parser
    if (isHtml) {
      // For now, just return the HTML content without annotations
      // In a real implementation, you'd need to parse the HTML and insert annotations at the right places
      return content;
    }

    // Sort annotations by start offset (in reverse order to process from end to start)
    const sortedAnnotations = [...pageAnnotations].sort((a, b) =>
      b.textSelection.startOffset - a.textSelection.startOffset
    );

    let contentWithAnnotations = content;

    // Insert annotation markers
    sortedAnnotations.forEach((annotation) => {
      const { startOffset, endOffset } = annotation.textSelection;
      const beforeText = contentWithAnnotations.substring(0, startOffset);
      const highlightedText = contentWithAnnotations.substring(startOffset, endOffset);
      const afterText = contentWithAnnotations.substring(endOffset);

      const hasNote = annotation.note && annotation.note.trim().length > 0;
      const noteIndicator = hasNote ? ' 📝' : '';

      contentWithAnnotations =
        beforeText +
        `<span
          class="annotation"
          data-annotation-id="${annotation._id}"
          style="background-color: ${annotation.color}; cursor: pointer;"
        >` +
        highlightedText +
        noteIndicator +
        '</span>' +
        afterText;
    });

    return contentWithAnnotations;
  };

  // Add event listeners to annotation spans after rendering
  useEffect(() => {
    const addAnnotationEventListeners = () => {
      if (contentRef.current) {
        const annotationSpans = contentRef.current.querySelectorAll('.annotation');

        annotationSpans.forEach((span) => {
          const annotationId = span.getAttribute('data-annotation-id');
          const annotation = pageAnnotations.find(a => a._id === annotationId);

          if (annotation) {
            span.addEventListener('click', (event) =>
              handleAnnotationClick(annotation, event)
            );
          }
        });
      }
    };

    // Add a small delay to ensure the DOM has been updated
    const timeoutId = setTimeout(addAnnotationEventListeners, 100);

    return () => clearTimeout(timeoutId);
  }, [pageAnnotations, content]);

  return (
    <div className="relative">
      {/* Content with annotations */}
      <div
        ref={contentRef}
        className="prose max-w-none whitespace-pre-wrap"
        onMouseUp={handleTextSelection}
        dangerouslySetInnerHTML={{ __html: renderContentWithAnnotations() }}
      />

      {/* Annotation toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="absolute z-50 bg-white shadow-lg rounded-md p-2 flex flex-col items-center"
          style={{
            top: toolbarPosition.top + 'px',
            left: toolbarPosition.left + 'px',
          }}
        >
          {/* Color picker */}
          <div className="flex space-x-1 mb-2">
            {highlightColors.map((hc) => (
              <button
                key={hc.color}
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: hc.color }}
                title={hc.name}
                onClick={() => setSelectedColor(hc.color)}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2">
            {!currentAnnotation ? (
              <>
                <button
                  onClick={handleHighlight}
                  className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
                >
                  Highlight
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-2 py-1 bg-green-600 text-white text-sm rounded"
                >
                  Add Note
                </button>
              </>
            ) : (
              <>
                {currentAnnotation.note ? (
                  <button
                    onClick={handleAddNote}
                    className="px-2 py-1 bg-green-600 text-white text-sm rounded"
                  >
                    Edit Note
                  </button>
                ) : (
                  <button
                    onClick={handleAddNote}
                    className="px-2 py-1 bg-green-600 text-white text-sm rounded"
                  >
                    Add Note
                  </button>
                )}
                <button
                  onClick={handleDeleteAnnotation}
                  className="px-2 py-1 bg-red-600 text-white text-sm rounded"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Note input */}
      {showNoteInput && (
        <div
          ref={noteInputRef}
          className="absolute z-50 bg-white shadow-lg rounded-md p-3"
          style={{
            top: (toolbarPosition.top + 70) + 'px',
            left: (toolbarPosition.left - 50) + 'px',
            width: '300px',
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            rows="3"
            placeholder="Enter your note..."
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowNoteInput(false)}
              className="px-2 py-1 bg-gray-300 text-gray-700 text-sm rounded"
            >
              Cancel
            </button>
            <button
              onClick={currentAnnotation ? handleUpdateNote : handleSaveNote}
              className="px-2 py-1 bg-blue-600 text-white text-sm rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;
