const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const filesDir = path.join(__dirname, 'files');

// Ensure the files directory exists
if (!fs.existsSync(filesDir)) {
    fs.mkdirSync(filesDir);
}

// Enable CORS for all requests
app.use(cors());

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
    const timestamp = new Date().toISOString();
    const filename = `${timestamp}.txt`;
    const filePath = path.join(filesDir, filename);
    
    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to create file', error: err });
        }
        res.status(200).json({ message: 'File created successfully', filename });
    });
});

// Endpoint to retrieve all text files in the directory
app.get('/files', (req, res) => {
    fs.readdir(filesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve files', error: err });
        }
        const textFiles = files.filter(file => path.extname(file) === '.txt');
        res.status(200).json({ files: textFiles });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
