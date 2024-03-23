const express = require('express');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Route for compiling and running Python code
app.post('/compile-run', (req, res) => {
    const code = req.body.code;

    if (!code) {
        return res.status(400).json({ success: false, error: 'No code provided.' });
    }

    // Write code to a temporary Python file
    const fileName = 'temp.py';
    fs.writeFileSync(fileName, code);

    // Execute the Python file
    exec(`python ${fileName}`, (error, stdout, stderr) => {
        // Delete the temporary Python file
        fs.unlinkSync(fileName);

        if (error) {
            return res.json({ success: false, error: stderr });
        }
        return res.json({ success: true, output: stdout });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
