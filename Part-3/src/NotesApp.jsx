import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from "./Components/Notification";
import Footer from './components/Footer'


const App = () => {

    const [notes, setNotes] = useState([]) //initialized piece of state stored in notes with the array of notes passed in
    const [newNote, setNewNote] = useState('a new note...')
    const [showAll, setShowAll] = useState(true)
    const [errorMessage, setErrorMessage] = useState('some error happened...')


    useEffect(() => {
        console.log('effect')
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    const toggleImportanceOf = id => {
        const note = notes.find(n => n.id === id) //finds the content of the note that is important
        // make a new note because state hsould never be modified directly
        const changedNote = { ...note, important: !note.important } //new note that has its importance flipped

        //use the noteservice to handle the sending
        noteService
            .update(id, changedNote).then(returnedNote => {
            setNotes(notes.map(note => note.id === id ? returnedNote : note))
        })
        .catch(error => {
            setErrorMessage(
                `Note '${note.content}' was already removed from server`
            )
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
            setNotes(notes.filter(n => n.id !== id))
        })
    }

    console.log('render', notes.length, 'notes')

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)


    //event handler for adding a new note
    const handleNoteChange = (event) => {
        console.log(event.target.value)
        setNewNote(event.target.value)
    }

    //defines event handler
    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }
        noteService
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote))
                setNewNote('')
            })

    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={errorMessage} />
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all'}
                </button>
            </div>
            <ul>
                {notesToShow.map(note =>
                    <Note
                        key={note.id}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}

                    />
                )}
            </ul>
            <form onSubmit={addNote}>
                <input
                    value={newNote}
                    onChange={handleNoteChange}
                />
                <button type="submit">save</button>
            </form>
            <Footer />
        </div>
    )
}

export default App