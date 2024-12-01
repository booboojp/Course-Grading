const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

/**
 * MAIN AND college DATABASE FUNCTIONS
 */


async function checkAndCreateDatabase() {
    console.log('Checking if database exists...');
    const dbPath = './database.db';
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }

    if (fs.existsSync(dbPath)) {
        console.log('Database already exists.');
    } else {
        console.log('Database does not exist. Creating now...');
        try {
            await new Promise((resolve, reject) => {
                const db = new sqlite3.Database(dbPath, (err) => {
                    if (err) {
                        console.error('Error creating database:', err.message);
                        reject(err);
                    } else {
                        console.log('Database created successfully.');
                        resolve();
                    }
                });
            });
        } catch (error) {
            console.error('Unexpected error:', error.message);
        } finally {
            console.log('Finished checking and creating database.');
        }
    }
}
async function createCollegesTable() {
    console.log('Creating colleges table...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`CREATE TABLE IF NOT EXISTS colleges (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    location TEXT NOT NULL,
                    banner_image TEXT NOT NULL,
                    rating REAL NOT NULL
                )`, (err) => {
                    if (err) {
                        console.error('Error creating colleges table:', err.message);
                    } else {
                        console.log('colleges table created successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function dropAllTables() {
    console.log('Dropping all tables...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DROP TABLE IF EXISTS colleges`, (err) => {
                    if (err) {
                        console.error('Error dropping tables:', err.message);
                    } else {
                        console.log('All tables dropped successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewAllTables() {
    console.log('Viewing all tables...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.all(`SELECT name FROM sqlite_master WHERE type='table'`, (err, tables) => {
                    if (err) {
                        console.error('Error retrieving tables:', err.message);
                    } else {
                        console.log('Tables:', JSON.stringify(tables, null, 2));
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function createCollege(name, location, banner_image, rating) {
    console.log('Creating a new college...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`INSERT INTO colleges (name, location, banner_image, rating) VALUES (?, ?, ?, ?)`, [name, location, banner_image, rating], (err) => {
                    if (err) {
                        console.error('Error creating college:', err.message);
                    } else {
                        console.log('college created successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function deleteCollege(name) {
    console.log('Deleting a college...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DELETE FROM colleges WHERE name = ?`, [name], (err) => {
                    if (err) {
                        console.error('Error deleting college:', err.message);
                    } else {
                        console.log('college deleted successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewCollegeByName(name) {
    console.log('Viewing a college by name...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.get(`SELECT * FROM colleges WHERE name = ?`, [name], (err, college) => {
                    if (err) {
                        console.error('Error retrieving college:', err.message);
                    } else {
                        console.log('college:', JSON.stringify(college, null, 2));
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewCollegeByLocation(location) {
    console.log('Viewing colleges by location...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.all(`SELECT * FROM colleges WHERE location = ?`, [location], (err, colleges) => {
                    if (err) {
                        console.error('Error retrieving colleges:', err.message);
                    } else {
                        console.log('colleges:', JSON.stringify(colleges, null, 2));
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewCollegeByRating(rating) {
    console.log('Viewing colleges by rating...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.all(`SELECT * FROM colleges WHERE rating = ?`, [rating], (err, colleges) => {
                    if (err) {
                        console.error('Error retrieving colleges:', err.message);
                    } else {
                        console.log('colleges:', JSON.stringify(colleges, null, 2));
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewCollegeById(id) {
    console.log('Viewing a college by id...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.get(`SELECT * FROM colleges WHERE id = ?`, [id], (err, college) => {
                        if (err) {
                            console.error('Error retrieving college:', err.message);
                            reject(err);
                        } else {
                            console.log('college:', JSON.stringify(college, null, 2));
                            resolve(college);
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error.message);
                    reject(error);
                } finally {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                }
            }
        });
    });
}
async function deleteAllColleges() {
    console.log('Deleting all colleges...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DELETE FROM colleges`, (err) => {
                    if (err) {
                        console.error('Error deleting all colleges:', err.message);
                    } else {
                        console.log('All colleges deleted successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewAllColleges() {
    console.log('Viewing all colleges...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.all(`SELECT * FROM colleges`, (err, colleges) => {
                        if (err) {
                            console.error('Error retrieving colleges:', err.message);
                            reject(err);
                        } else {
                            console.log('colleges:', JSON.stringify(colleges, null, 2));
                            resolve(colleges);
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error.message);
                    reject(error);
                } finally {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                }
            }
        });
    });
}


/**
 * COURSE DATABASE FUNCTIONS
 */


async function createCoursesTable() {
    console.log('Creating courses table...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.serialize(() => {
                    db.run(`CREATE TABLE IF NOT EXISTS courses (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        description TEXT,
                        college_id INTEGER,
                        FOREIGN KEY (college_id) REFERENCES colleges(id)
                    )`, (err) => {
                        if (err) {
                            console.error('Error creating courses table:', err.message);
                        } else {
                            console.log('Courses table created successfully.');
                        }
                    });
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}

async function createCourse(name, description, college_id) {
    console.log('Creating a new course...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`INSERT INTO courses (name, description, college_id) VALUES (?, ?, ?)`, [name, description, college_id], (err) => {
                    if (err) {
                        console.error('Error creating course:', err.message);
                    } else {
                        console.log('Course created successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}

async function deleteCourse(name) {
    console.log('Deleting a course...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DELETE FROM courses WHERE name = ?`, [name], (err) => {
                    if (err) {
                        console.error('Error deleting course:', err.message);
                    } else {
                        console.log('Course deleted successfully.');
                    }
                });
            } catch (error) {
                console.error('Unexpected error:', error.message);
            } finally {
                db.close((err) => {
                    if (err) {
                        console.error('Error closing database:', err.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            }
        }
    });
}
async function viewAllCourses() {
    console.log('Viewing all courses...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.all(`SELECT * FROM courses`, (err, courses) => {
                        if (err) {
                            console.error('Error retrieving courses:', err.message);
                            reject(err);
                        } else {
                            console.log('Courses:', JSON.stringify(courses, null, 2));
                            resolve(courses);
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error.message);
                    reject(error);
                } finally {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                }
            }
        });
    });
}
async function viewAllCoursesByCollegeId(college_id) {
    console.log('Viewing all courses by college id...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.all(`SELECT * FROM courses WHERE college_id = ?`, [college_id], (err, courses) => {
                        if (err) {
                            console.error('Error retrieving courses:', err.message);
                            reject(err);
                        } else {
                            console.log('Courses:', JSON.stringify(courses, null, 2));
                            resolve(courses);
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error.message);
                    reject(error);
                } finally {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                }
            }
        });
    });
}
async function viewCourseById(id) {
    console.log('Viewing a course by id...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.get(`SELECT * FROM courses WHERE id = ?`, [id], (err, course) => {
                        if (err) {
                            console.error('Error retrieving course:', err.message);
                            reject(err);
                        } else {
                            console.log('Course:', JSON.stringify(course, null, 2));
                            resolve(course);
                        }
                    });
                } catch (error) {
                    console.error('Unexpected error:', error.message);
                    reject(error);
                } finally {
                    db.close((err) => {
                        if (err) {
                            console.error('Error closing database:', err.message);
                        } else {
                            console.log('Database connection closed.');
                        }
                    });
                }
            }
        });
    });
}




module.exports = {
    checkAndCreateDatabase,
    createCollegesTable,
    dropAllTables,
    viewAllTables,
    createCollege,
    deleteCollege,
    viewCollegeByName,
    viewCollegeByLocation,
    viewCollegeByRating,
    viewCollegeById,
    deleteAllColleges,
    viewAllColleges,
    createCoursesTable,
    createCourse,
    deleteCourse,
    viewAllCourses,
    viewAllCoursesByCollegeId,
    viewCourseById
};