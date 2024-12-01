const sqlite3 = require('sqlite3');

async function dropAllTables() {
    console.log('Dropping all tables...');
    const db = new sqlite3.Database('./database.db', (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            try {
                db.serialize(() => {
                    db.run(`DROP TABLE IF EXISTS colleges`, (err) => {
                        if (err) {
                            console.error('Error dropping colleges table:', err.message);
                        } else {
                            console.log('Colleges table dropped successfully.');
                        }
                    });
                    db.run(`DROP TABLE IF EXISTS courses`, (err) => {
                        if (err) {
                            console.error('Error dropping courses table:', err.message);
                        } else {
                            console.log('Courses table dropped successfully.');
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

dropAllTables();