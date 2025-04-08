document.getElementById('studentForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const student = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value
    };

    try {
        const response = await fetch('http://localhost:5000/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert(data.message);

        fetchStudents(); // Refresh student list
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit the form. Please try again.');
    }
});

// Add event listener for the "Clear Form" button
document.getElementById('clearForm').addEventListener('click', function() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('email').value = '';
    document.getElementById('course').value = '';
});

async function fetchStudents() {
    try {
        const response = await fetch('http://localhost:5000/students');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const students = await response.json();
        console.log('Fetched students:', students); // Log the fetched data

        const studentList = document.getElementById('studentList');
        studentList.innerHTML = '';

        if (students.length === 0) {
            studentList.innerHTML = '<li>No students registered yet.</li>'; // Handle empty list
        } else {
            students.forEach(student => {
                const li = document.createElement('li');
                li.textContent = `${student.name} - ${student.age} - ${student.email} - ${student.course}`;
                studentList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching students:', error);
        alert('Failed to fetch students. Please try again.');
    }
}

// Fetch students when the page loads
fetchStudents();
