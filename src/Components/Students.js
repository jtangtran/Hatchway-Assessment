import  React, {useEffect}  from 'react';
import '../Styles/Students.css';

const Students = () => {
    const [students, setStudents] = React.useState([]);
    const [search, setSearch] = React.useState([]);
    const [filteredResults, setFilteredResults] = React.useState([]);
    const [displayTests, setDisplayTests] = React.useState([]);

    React.useEffect( () => {
        (async () => {
            try {
                const response = await fetch('https://api.hatchways.io/assessment/students');
                if (!response.ok)
                    throw Error(response.status + ': ' + response.statusText);
                const result = await response.json();
                setStudents(result.students);    
            } catch (error) {
                console.log(`Fetch API Error: ${error}`);
            }
        })();
    },[]);

    useEffect(() => {
        setFilteredResults(
          students.filter(student => {
            return student.firstName.toLowerCase().includes(search) || student.lastName.toLowerCase().includes(search)
          })
        )
      }, [search, students]);
    
    const getGrades = (grades) => {
        let avg = 0;
        grades.forEach(element => {
            avg += Number(element);
        });
        return ((avg / grades.length).toFixed(3));
    }

    const toggleDisplay = (id) => {
        if (displayTests.includes(id)) {
            setDisplayTests(displayTests.filter(studentId => studentId !== id))
        } else {
            let newDisplay = [...displayTests]
            newDisplay.push(id);
            setDisplayTests(newDisplay);
        }
    }
    return ( 
        <div className="full-container">
            <ul className="card-container">
            <div className="form">
                <input type="text" placeholder="Search by name" id="searchInput" onChange={e => setSearch(e.target.value)}/>
            </div>
            
                {filteredResults.map(student => {
                    return (
                        <div key={student.id} className="studentCard">
                            <img src={student.pic} alt='' className='studentPic'/>
                            <h1>{student.firstName.toUpperCase()} {student.lastName.toUpperCase()}</h1>
                            <button className="expand" onClick={() => toggleDisplay(student.id)}>{displayTests.includes(student.id) ? '-' : '+'}</button>
                            <div className="studentInfo">
                                <p> Email: {student.email}</p>
                                <p> Skill: {student.skill}</p>
                                <p>Average: {getGrades(student.grades)}%</p>
                            </div>
                            <div className="gradesGroup">    
                                {displayTests.includes(student.id) ? (
                                    <ul className="gradesList">
                                        {student.grades.map((grade, index) => <li key={grade.id}>Test {index + 1}: {grade}%</li>)}
                                    </ul>) : null}
                            <hr></hr>
                            </div>
                        </div>
                    )
                })}
                </ul>
        </div>
    )
}

export default Students;