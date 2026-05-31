import {useEffect, useState} from 'react'
import Note from "./Components/Note.jsx";
import './index.css'

import Notification from "./Components/Notification.jsx";
import phoneService from "./services/phonebook.js";

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [notify, setNotify] = useState(false)
    const [lastAddedName, setLastAddedName] = useState('')


    useEffect(() => {
        console.log('effect')
        phoneService
            .getAll()
            .then(initialPeople => {
                setPersons(initialPeople)
            })
    }, [])

    useEffect(() => {
        if (notify) {
            const timer = setTimeout(() => {
                setNotify(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notify]);


    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleNewName = (event) => {
        console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNewNumber = (event) => {
        const number = event.target.value
        const existingNumber = persons.filter((person) => person.number === number)
        if(existingNumber.length > 0) {
            const ok = window.confirm(`${number} already exists! Replace the name?`)
            if(ok) {
                const updatedPersons = persons.map(p =>
                    p.number === number ? {...p, name: newName} : p
                )
                setPersons(updatedPersons)
            }
        }
        setNewNumber(number)
    }

    const handleButtonInput = (event) => {
        event.preventDefault()

        const existingName = persons.some(person => person.name === newName)
        if(existingName) {
            alert(`${newName} already exists!`)
            return
        }

        const nameObject = {
            name: newName,
            number: newNumber,
        }
        phoneService
            .create(nameObject)
        .then(returnedPerson => {
            setPersons(persons.concat(returnedPerson))
            setLastAddedName(returnedPerson.name)
            setNotify(true)
            setNewName('')
            setNewNumber('')
        })
    }

    const handleRemove = (id, nameToRemove) => {
        if(window.confirm(`Are you sure you wish to remove ${nameToRemove}?`)) {
            phoneService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(person => person.id !== id))
                    setLastAddedName(`Deleted ${nameToRemove}`)
                    setNotify(true)
                })
                .catch(error => {
                    alert(`The person '${nameToRemove}' was already removed from the server`)
                    setPersons(persons.filter(person => person.id !== id))
                })
        }
    }

    const personsToShow = searchTerm === ''
        ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(searchTerm.toLowerCase())
        )

    return (
        <div>
            <h2>Phonebook</h2>
            {notify && <Notification message={lastAddedName} />}

            Search for a User<input
                value={searchTerm}
                onChange={handleSearch}
            />
            <form onSubmit={handleButtonInput}>
                <div>
                    <h2>Add a new Person</h2>
                    name:
                    <input
                        value={newName}
                        onChange={handleNewName}
                    />
                    number:
                    <input
                        value={newNumber}
                        onChange={handleNewNumber}
                    />
                </div>
                <div>
                    <button
                        type="submit">add
                    </button>
                </div>
            </form>
            <h2>Numbers</h2>
            <ul>
                {personsToShow.map(person =>
                    <li key={person.id}>
                        name: {person.name}, number: {person.number}
                        <button onClick={() => handleRemove(person.id, person.name)}>remove</button>
                    </li>
                )}
            </ul>
        </div>
    )
}

export default App