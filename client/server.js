const express = require('express');
const path = require('path');
const app = express();
const port = 4567;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public', 'views')); // Updated path

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

app.get('/college/id/:id', async (req, res) => {
    const collegeId = req.params.id;
    try {
        const college = await getCollegeById(collegeId);
        const courses = await getCoursesByCollegeId(collegeId);
        if (college) {
            res.render('college', { college, courses });
        } else {
            res.status(404).send('College not found');
        }
    } catch (error) {
        console.error('Error fetching college or courses:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/college/update-rating', (req, res) => {
    res.render('update-college-rating');
});

app.get('/college/name/:name', async (req, res) => {
    const { name } = req.params;
    try {
        const response = await fetch(`http://localhost:6969/college/name/${name}`);
        const college = await response.json();
        res.json(college);
    } catch (error) {
        console.error('Error fetching college:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/college/update-rating', async (req, res) => {
    const { name, newRating } = req.body;
    try {
        const response = await fetch('http://localhost:6969/college/update-rating', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, newRating })
        });
        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error updating rating:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/college/edit/:id', async (req, res) => {
    const collegeId = req.params.id;
    try {
        const response = await fetch(`http://localhost:6969/college/id/${collegeId}`);
        const college = await response.json();
        res.render('edit-college', { college });
    } catch (error) {
        console.error('Error fetching college:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/college/edit/:id', async (req, res) => {
    const collegeId = req.params.id;
    const { name, location, banner_image, rating } = req.body;
    try {
        await fetch('http://localhost:6969/college/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: collegeId, name, location, banner_image, rating }),
        });
        res.redirect(`/college/id/${collegeId}`);
    } catch (error) {
        console.error('Error updating college:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/college/delete/:id', async (req, res) => {
    const collegeId = req.params.id;
    try {
        await fetch('http://localhost:6969/college/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: collegeId }),
        });
        res.redirect('/search');
    } catch (error) {
        console.error('Error deleting college:', error.message);
        res.status(500).send('Internal Server Error');
    }
});


app.get('/course/id/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await getCourseById(courseId);
        if (course) {
            res.render('course', { course });
        } else {
            res.status(404).send('Course not found');
        }
    } catch (error) {
        console.error('Error fetching course:', error.message);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/course/create', async (req, res) => {
    try {
        const response = await fetch('http://localhost:6969/college/list');
        const colleges = await response.json();
        res.render('create-course', { colleges });
    } catch (error) {
        console.error('Error fetching colleges:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/course/create', async (req, res) => {
    const { name, description, rating, college_id } = req.body;
    try {
        await fetch('http://localhost:6969/create-course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description, rating, college_id })
        });
        res.redirect(`/college/id/${college_id}`);
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/course/delete/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        await fetch('http://localhost:6969/course/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: courseId }),
        });
        res.redirect('/search');
    } catch (error) {
        console.error('Error deleting course:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/course/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    try {
        const courseResponse = await fetch(`http://localhost:6969/course/${courseId}`);
        const course = await courseResponse.json();

        const collegesResponse = await fetch('http://localhost:6969/college/list');
        const colleges = await collegesResponse.json();

        res.render('edit-course', { course, colleges });
    } catch (error) {
        console.error('Error fetching course or colleges:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
app.post('/course/edit/:id', async (req, res) => {
    const courseId = req.params.id;
    const { name, description, rating, college_id } = req.body;
    try {
        await fetch('http://localhost:6969/course/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: courseId, name, description, rating, college_id })
        });
        res.redirect(`/course/id/${courseId}`);
    } catch (error) {
        console.error('Error updating course:', error.message);
        res.status(500).send('Internal Server Error');
    }
});
async function main() {
    console.clear();
    app.listen(port, () => {
        console.log(`Client server running at http://localhost:${port}`);
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
        return null; // Ensure null is returned on error
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