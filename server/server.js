const express = require('express');
const databaseFunctions = require('./database');
const app = express();
const port = 6969;
console.clear();
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});


app.get('/college', (req, res) => {
    res.redirect('/college/list');
});
app.get('/college/list', async (req, res) => {
    try {
        await databaseFunctions.viewAllColleges().then((colleges) => {
            res.json(colleges);
        });
    } catch (error) {
        console.error('Error getting colleges:', error.message);
        res.status(500).json({ message: 'Error getting colleges' });
    }
});
app.post('/college/create-college', async (req, res) => {
    const { name, location, banner_image, rating } = req.body;
    try {
        await databaseFunctions.createCollegesTable();
        await databaseFunctions.createCollege(name, location, banner_image, rating);
        res.json({ message: `Created ${name} college successfully` });
    } catch (error) {
        console.error('Error creating college:', error.message);
        res.status(500).json({ message: 'Error creating college' });
    }
});
app.post('/college/update-rating', async (req, res) => {
    const { name, newRating } = req.body;
    try {
        await databaseFunctions.updateCollegeRating(name, newRating);
        res.json({ message: `Updated rating for ${name} successfully` });
    } catch (error) {
        console.error('Error updating rating:', error.message);
        res.status(500).json({ message: 'Error updating rating' });
    }
});
app.post('/college/update', async (req, res) => {
    const { id, name, location, banner_image, rating } = req.body;
    try {
        await databaseFunctions.updateCollege(id, name, location, banner_image, rating);
        res.json({ message: `Updated college '${name}' successfully` });
    } catch (error) {
        console.error('Error updating college:', error.message);
        res.status(500).json({ message: 'Error updating college' });
    }
});
app.post('/college/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await databaseFunctions.deleteCollegeById(id);
        res.json({ message: `Deleted college with ID ${id} successfully` });
    } catch (error) {
        console.error('Error deleting college:', error.message);
        res.status(500).json({ message: 'Error deleting college' });
    }
});
app.post('/college/delete-college', async (req, res) => {
    const { name } = req.body;
    try {
        await databaseFunctions.viewAllColleges();
        await databaseFunctions.viewAllColleges();
        await databaseFunctions.createCollegesTable();
        await databaseFunctions.deleteCollege(name);
        res.json({ message: `Deleted ${name} college successfully` });
    } catch (error) {
        console.error('Error deleting college:', error.message);
        res.status(500).json({ message: 'Error deleting college' });
    }
});
app.get('/college/id/:collegeId', async (req, res) => {
    const { collegeId } = req.params;
    try {
        await databaseFunctions.viewCollegeById(collegeId).then((college) => {
            res.json(college);
        });
    } catch (error) {
        console.error('Error getting college:', error.message);
        res.status(500).json({ message: 'Error getting college' });
    }
});
app.get('/college/name/:name', async (req, res) => {
    const { name } = req.params;
    try {
        await databaseFunctions.viewCollegeByName(name).then((college) => {
            res.json(college);
        });
    } catch (error) {
        console.error('Error getting college:', error.message);
        res.status(500).json({ message: 'Error getting college' });
    }
});






app.get('/college/id/:collegeId/courses', async (req, res) => {
    const { collegeId } = req.params;
    try {
        await databaseFunctions.createCoursesTable();
        await databaseFunctions.viewAllCoursesByCollegeId(collegeId).then((courses) => {
            res.json(courses);
        });2
    } catch (error) {
        console.error('Error getting courses:', error.message);
        res.status(500).json({ message: 'Error getting courses' });
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
app.post('/course/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await databaseFunctions.deleteCourseById(id);
        res.json({ message: `Deleted course with ID ${id} successfully` });
    } catch (error) {
        console.error('Error deleting course:', error.message);
        res.status(500).json({ message: 'Error deleting course' });
    }
});

app.get('/courses', async (req, res) => {
    try {
        await databaseFunctions.viewAllCourses().then((courses) => {
            res.json(courses);
        });
    } catch (error) {
        console.error('Error getting courses:', error.message);
        res.status(500).json({ message: 'Error getting courses' });
    }
});
app.post('/create-course', async (req, res) => {
    const { name, description, rating, college_id } = req.body;
    try {
        await databaseFunctions.createCoursesTable();
        await databaseFunctions.createCourse(name, description, rating, college_id);
        res.json({ message: `Created ${name} Course successfully` });
    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ message: 'Error creating course' });
    }
});
app.post('/course/update', async (req, res) => {
    const { id, name, description, rating, college_id } = req.body;
    try {
        await databaseFunctions.updateCourse(id, name, description, rating, college_id);
        res.json({ message: `Updated course '${name}' successfully` });
    } catch (error) {
        console.error('Error updating course:', error.message);
        res.status(500).json({ message: 'Error updating course' });
    }
});
// get course course/courseID
app.get('/course/:courseId', async (req, res) => {
    const { courseId } = req.params;
    try {
        await databaseFunctions.viewCourseById(courseId).then((course) => {
            res.json(course);
        });
    } catch (error) {
        console.error('Error getting course:', error.message);
        res.status(500).json({ message: 'Error getting course' });
    }
});


/**
 * Sample JSON
 * {
  "name": "Introduction to Programming",
  "description": "A beginner course on programming concepts.",
  "college_id": 1
}
 */





async function main() {
    try {
        await databaseFunctions.checkAndCreateDatabase();
        await databaseFunctions.createCollegesTable();
        await databaseFunctions.createCoursesTable();

        app.listen(port, () => {
            console.log(`\n\n\n\n\n\n\n\n\n\n\n\n\nServer is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log('Error connecting to database:', error);
    }
}

main();