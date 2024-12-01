const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

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

async function createCollagesTable() {
    console.log('Creating collages table...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`CREATE TABLE IF NOT EXISTS collages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    location TEXT NOT NULL,
                    banner_image TEXT NOT NULL,
                    rating REAL NOT NULL
                )`, (err) => {
                    if (err) {
                        console.error('Error creating collages table:', err.message);
                    } else {
                        console.log('Collages table created successfully.');
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
                db.run(`DROP TABLE IF EXISTS collages`, (err) => {
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
async function createCollage(name, location, banner_image, rating) {
    console.log('Creating a new collage...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`INSERT INTO collages (name, location, banner_image, rating) VALUES (?, ?, ?, ?)`, [name, location, banner_image, rating], (err) => {
                    if (err) {
                        console.error('Error creating collage:', err.message);
                    } else {
                        console.log('Collage created successfully.');
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

async function deleteCollage(name) {
    console.log('Deleting a collage...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DELETE FROM collages WHERE name = ?`, [name], (err) => {
                    if (err) {
                        console.error('Error deleting collage:', err.message);
                    } else {
                        console.log('Collage deleted successfully.');
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

async function viewCollageByName(name) {
    console.log('Viewing a collage by name...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.get(`SELECT * FROM collages WHERE name = ?`, [name], (err, collage) => {
                    if (err) {
                        console.error('Error retrieving collage:', err.message);
                    } else {
                        console.log('Collage:', JSON.stringify(collage, null, 2));
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
async function viewCollageByLocation(location) {
    console.log('Viewing collages by location...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.all(`SELECT * FROM collages WHERE location = ?`, [location], (err, collages) => {
                    if (err) {
                        console.error('Error retrieving collages:', err.message);
                    } else {
                        console.log('Collages:', JSON.stringify(collages, null, 2));
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

async function viewCollageByRating(rating) {
    console.log('Viewing collages by rating...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.all(`SELECT * FROM collages WHERE rating = ?`, [rating], (err, collages) => {
                    if (err) {
                        console.error('Error retrieving collages:', err.message);
                    } else {
                        console.log('Collages:', JSON.stringify(collages, null, 2));
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
async function deleteAllCollages() {
    console.log('Deleting all collages...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.run(`DELETE FROM collages`, (err) => {
                    if (err) {
                        console.error('Error deleting all collages:', err.message);
                    } else {
                        console.log('All collages deleted successfully.');
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
async function viewAllCollages() {
    console.log('Viewing all collages...');
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {
                try {
                    db.all(`SELECT * FROM collages`, (err, collages) => {
                        if (err) {
                            console.error('Error retrieving collages:', err.message);
                            reject(err);
                        } else {
                            console.log('Collages:', JSON.stringify(collages, null, 2));
                            resolve(collages);
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
// async function main() {
//     console.clear();
//     console.log('\n\n\n\n\nStarting database operations...');
//     await checkAndCreateDatabase().then(() => {
//         deleteAllCollages();
//     });
//     await createCollagesTable();
//     //await viewAllTables();
//     //await viewCollageByName('Sample Collage 1');
//     //await viewAllTables();
//     await createCollage('Sample Collage 1', 'Sample Location 1', 'https://via.placeholder.com/150', 3);
//     await createCollage('Sample Collage 2', 'Sample Location 2', 'https://via.placeholder.com/150', 4);
//     await createCollage('Sample Collage 3', 'Sample Location 2', 'https://via.placeholder.com/150', 5);
//     // await viewCollageByLocation('Sample Location 2');
//     // await viewCollageByRating(3);
//     await viewAllCollages();
//     //await deleteCollage('Sample Collage');
//     //await viewAllTables();

// }

// main().catch(console.error);


module.exports = {
    checkAndCreateDatabase,
    createCollagesTable,
    dropAllTables,
    viewAllTables,
    createCollage,
    deleteCollage,
    viewCollageByName,
    viewCollageByLocation,
    viewCollageByRating,
    deleteAllCollages,
    viewAllCollages
};