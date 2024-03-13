const express = require('express');

const app = express();
let tasks = [];
let users = [];

app.use(express.json());

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide username and password.' });
    }

    const userExists = users.find(user => user.username === username);

    if (userExists) {
        return res.status(400).json({ error: 'Username already exists.' });
    }

    const user = { username, password };
    users.push(user);

    return res.status(201).json(user);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);

    if (!user) {
        return res.status(400).json({ error: 'Invalid username or password.' });
    }

    return res.status(200).json(user);
});

app.post('/tasks', (req, res) => {
    const { title, description, dueDate, category, priority } = req.body;

    if (!title || !description || !dueDate || !category || !priority) {
        return res.status(400).json({ error: 'Please provide title, description, due date, category, and priority for the task.' });
    }

    const task = {
        id: tasks.length + 1,
        title,
        description,
        dueDate,
        category,
        status: 'incomplete', 
        priority
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

app.get('/tasks', (req, res) => {
    const { sort } = req.query;

    let sortedTasks;

    switch (sort) {
        case 'dueDate':
            sortedTasks = [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
            break;
        case 'category':
            sortedTasks = [...tasks].sort((a, b) => a.category.localeCompare(b.category));
            break;
        case 'status':
            sortedTasks = [...tasks].sort((a, b) => a.status.localeCompare(b.status));
            break;
        default:
            sortedTasks = [...tasks];
    }

    return res.status(200).json(sortedTasks);
});

app.put('/tasks/:id/priority', (req, res) => {
    const { id } = req.params;
    const { priority } = req.body;

    const task = tasks.find(task => task.id === Number(id));

    if (!task) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    if (!priority || (priority !== 'High' && priority !== 'Medium' && priority !== 'Low')) {
        return res.status(400).json({ error: 'Please provide a valid priority (High, Medium, or Low).' });
    }

    task.priority = priority;

    return res.status(200).json(task);
});


app.listen(3000, () => console.log('Server is running on port 3000'));