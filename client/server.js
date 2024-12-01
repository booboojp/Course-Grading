const express = require('express');
const path = require('path');
const app = express();
const port = 4567;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/college/create', (req, res) => {
    res.render('create-college');
});

app.post('/college/create', async (req, res) => {
    const { name, location, banner_image, rating } = req.body;
    try {
        await fetch('http://localhost:6969/college/create-college', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, location, banner_image, rating })
        });
        res.redirect('/search');
    } catch (error) {
        console.error('Error creating college:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/college/id/:id', async (req, res) => {
    const collegeId = req.params.id;
    try {
        const college = await getCollegeById(collegeId);
        const courses = await getCoursesByCollegeId(collegeId);
        res.render('college', { college, courses });
    } catch (error) {
        console.error('Error fetching college or courses:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/course/id/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await getCourseById(courseId);
        res.render('course', { course });
    } catch (error) {
        console.error('Error fetching course:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

async function main() {
    console.clear();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();

async function getCollegeById(id) {
    try {
        const response = await fetch(`http://localhost:6969/college/id/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const college = await response.json();
        return college;
    } catch (error) {
        console.error('Error fetching college:', error.message);
        return null;
    }
}

async function getCoursesByCollegeId(collegeId) {
    try {
        const response = await fetch(`http://localhost:6969/college/id/${collegeId}/courses`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const courses = await response.json();
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error.message);
        return [];
    }
}

async function getCourseById(id) {
    try {
        const response = await fetch(`http://localhost:6969/course/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const course = await response.json();
        return course;
    } catch (error) {
        console.error('Error fetching course:', error.message);
        return null;
    }
}