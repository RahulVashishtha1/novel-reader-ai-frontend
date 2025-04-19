import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateNote, deleteNote } from '../features/novels/novelSlice';

const NotesList = ({ notes, novelId, onNavigate, onClose }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');
  const dispatch = useDispatch();

  const handleEditNote = (note) => {
    setEditingNote(note._id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editContent.trim() && editingNote) {
      dispatch(
        updateNote({
          id: novelId,
          noteId: editingNote,
          noteData: { content: editContent },
        })
      );
      setEditingNote(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote({ id: novelId, noteId }));
    }
  };

  const handleNavigate = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notes</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {notes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No notes yet</p>
      ) : (
        <ul className="space-y-4">
          {notes
            .sort((a, b) => a.page - b.page)
            .map((note) => (
              <li
                key={note._id}
                className="border border-gray-200 rounded-md p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <button
                    onClick={() => handleNavigate(note.page)}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Page {note.page}
                  </button>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditNote(note)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {editingNote === note._id ? (
                  <div>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                      rows="3"
                    ></textarea>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
                )}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default NotesList;
