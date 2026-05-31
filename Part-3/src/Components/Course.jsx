import Note from "./Note.jsx";

const Course = ({course}) => {
    const initialVal = 0;
    const total = course.parts.reduce((s, p) => {
        console.log("hre is the log", s, p.exercises)
        return s + p.exercises
    }, 0);
    return (
        <div>
            <h1>{course.title}</h1>
            <div>{course.parts.map((part) => (
                <p key={part.id}>
                    {part.name}, {part.exercises}, {part.id}
                </p>
            ))}</div>
            <p>Total of {total} exercises</p>
        </div>
    )

}

export default Course