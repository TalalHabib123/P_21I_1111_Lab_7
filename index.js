const express = require('express');

const app = express();
let tasks = [];
let users = [];

app.use(express.json());

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category } = req.body;

    if (!title || !description || !dueDate || !category) {
        return res.status(400).json({ error: 'Please provide title, description, due date, and category for the task.' });
    }

    const task = {
        id: tasks.length + 1,
        title,
        description,
        dueDate,
        category,
        status: 'incomplete' // default status
    };

    tasks.push(task);

    return res.status(201).json(task);
});

app.put('/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const task = tasks.find(task => task.id === Number(id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    if (!status || (status !== 'complete' && status !== 'incomplete')) {
        return res.status(400).json({ error: 'Please provide a valid status (complete or incomplete).' });
    }

    task.status = status;

    return res.status(200).json(task);
});

app.put('/tasks/:id/category', (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    const task = tasks.find(task => task.id === Number(id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    if (!category) {
        return res.status(400).json({ error: 'Please provide a new category.' });
    }

    task.category = category;

    return res.status(200).json(task);
});


app.listen(3000, () => console.log('Server is running on port 3000'));