
document.addEventListener('DOMContentLoaded', function() {
    const notesList = document.getElementById('notes-list');
    const noteTitle = document.getElementById('note-title');
    const noteContent = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note');
    const newNoteBtn = document.getElementById('new-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note');
    const searchInput = document.getElementById('search-notes');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let currentNoteId = null;

    function init() {
        renderNotesList();
        setupEventListeners();
    }

    function setupEventListeners() {
        saveNoteBtn.addEventListener('click', saveNote);
        newNoteBtn.addEventListener('click', createNewNote);
        deleteNoteBtn.addEventListener('click', deleteNote);
        searchInput.addEventListener('input', searchNotes);

        // AUTO-SAVE NOTES
        noteTitle.addEventListener('blur', debounce(saveNote, 300));
        noteContent.addEventListener('blur', debounce(saveNote, 300));
    }

    // RENDER 
    function renderNotesList(filteredNotes = null) {
        const notesToRender = filteredNotes || notes;
        
        if (notesToRender.length === 0) {
            notesList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-sticky-note"></i>
                    <p>No notes yet. Create one!</p>
                </div>
            `;
            return;
        }

        notesList.innerHTML = notesToRender.map(note => `
            <div class="note-item ${currentNoteId === note.id ? 'active' : ''}" data-id="${note.id}">
                <h3>${note.title || 'Untitled Note'}</h3>
                <p>${note.content.substring(0, 60) || 'No content yet...'}</p>
            </div>
        `).join('');

        // ADD EVENT LISTNER TO NOTE
        document.querySelectorAll('.note-item').forEach(item => {
            item.addEventListener('click', () => loadNote(item.dataset.id));
        });
    }

    // LOAD NOTE
    function loadNote(id) {
        const note = notes.find(note => note.id === id);
        if (note) {
            currentNoteId = note.id;
            noteTitle.value = note.title;
            noteContent.value = note.content;
            renderNotesList();
        }
    }

    // CREATE NOTE
    function createNewNote() {
        currentNoteId = Date.now().toString();
        noteTitle.value = '';
        noteContent.value = '';
        noteTitle.focus();
        renderNotesList();
    }

    // SAVE NOTE
    function saveNote() {
        if (!currentNoteId) return;

        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();

        const existingNoteIndex = notes.findIndex(note => note.id === currentNoteId);

         // UPDATE NOTE
        if (existingNoteIndex >= 0) {
            notes[existingNoteIndex] = {
                id: currentNoteId,
                title,
                content,
                updatedAt: new Date().toISOString()
            };
        } else {
            notes.push({
                id: currentNoteId,
                title,
                content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotesList();
    }

    // DELETE NOTE
    function deleteNote() {
        if (!currentNoteId) return;

        if (confirm('Are you sure you want to delete this note?')) {
            notes = notes.filter(note => note.id !== currentNoteId);
            localStorage.setItem('notes', JSON.stringify(notes));
            currentNoteId = null;
            noteTitle.value = '';
            noteContent.value = '';
            renderNotesList();
        }
    }

    // SEARCH NOTES
    function searchNotes() {
        const searchTerm = searchInput.value.toLowerCase();
        if (!searchTerm) {
            renderNotesList();
            return;
        }

        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );

        renderNotesList(filteredNotes);
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    init();
});