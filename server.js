if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false, limit: '150mb' }));
const fs = require('fs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());

//  * VARIABLES
let login = false;
let header = '';
let redir = false;
const fn = __dirname + '/projects/projects.json'

// * CHECKS

if (fs.existsSync('projects')) {
    if (fs.existsSync(fn)) {
        console.log(true)
    } else {
        const data = {
            proj: []
        }
        fs.writeFileSync(fn, JSON.stringify(data))
    }
} else {
    const data = {
        proj: []
    }
    fs.mkdirSync(__dirname + '/projects');
    fs.writeFileSync(fn, JSON.stringify(data))
}

// * FUNCTIONS

function check(req, res, next) {
    if (redir) {
        next()
    } else {
        return
    }
}

function checklogin(req, res, next) {
    if (login) {
        next()
    } else {
        res.redirect('/login')
    }
}

//  * GET

app.get('/', checklogin, async (req, res) => {
    if (fs.existsSync(fn)) {
        fs.readFile(fn, 'utf8', async (err, file) => {
            if (err) {
                res.render('index', { data: '' });
            } else if (file == '') {
                res.render('index', { data: '' });
            } else {
                const tasks = await JSON.parse(file)
                res.render('index', { data: tasks });
            }
        });
    }
});

app.get('/task', check, (req, res) => {
    fs.readFile(fn, 'utf8', async (err, file) => {
        if (err) {
            res.render('index', { data: '' });
        } else if (file == '') {
            res.render('index', { data: '' });
        } else {
            const tasks = await JSON.parse(file)
            const deets = await tasks.proj.find(e => e.title === header);
            if (deets && deets !== '') {
                res.render('task', { data: deets });
            } else {
                res.redirect('/error')
            }
        }
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

// * API

app.get('/api/projects', (req, res) => {
    fs.readFile(fn, 'utf8', async (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else if (file == '') {
            res.sendStatus(404);
        } else {
            const rData = await JSON.parse(file)
            if (req.query.title && req.query.title !== '') {
                const query = rData.proj.find(e => e.title === req.query.title);
                res.json(query);
            } else {
                res.json(rData.proj);
            }
        }
    });
});

//  * POST

app.post('/login', (req, res) => {
    const user = req.body.user
    const pass = req.body.pass
    if (user === 'avishek8' && pass === 'Avis5hek1991') {
        login = true
        res.redirect('/');
    } else {
        res.sendStatus(401);
    }
});

app.post('/logout', (req, res) => {
    login = false
    res.sendStatus(204);
});

app.post('/save', (req, res) => {
    const writeData = req.body //JSON.stringify(req.body)
    fs.readFile(fn, 'utf8', async (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else if (file == '') {
            res.sendStatus(404);
        } else {
            const rData = await JSON.parse(file)
            const sIndex = await rData.proj.findIndex(e => e.title === writeData.title);
            rData.proj[sIndex] = writeData
            fs.writeFileSync(fn, JSON.stringify(rData))
            res.sendStatus(200)
        }
    });
});

app.post('/add', (req, res) => {
    const title = req.query.title
    fs.readFile(fn, 'utf8', async (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else if (file == '') {
            res.sendStatus(404);
        } else {
            const rData = await JSON.parse(file)
            const obj = {
                "title": title,
                "tasks": []
            }
            rData.proj.push(obj)
            fs.writeFileSync(fn, JSON.stringify(rData))
            res.sendStatus(200)
        }
    });
});

app.post('/del', (req, res) => {
    const title = req.query.title;
    fs.readFile(fn, 'utf8', async (err, file) => {
        if (err) {
            res.sendStatus(404);
        } else if (file == '') {
            res.sendStatus(404);
        } else {
            let rData = await JSON.parse(file)
            rData.proj = rData.proj.filter(e => e.title !== title)
            fs.writeFileSync(fn, JSON.stringify(rData))
            res.sendStatus(200)
        }
    });
});

app.post('/:title', (req, res) => {
    header = req.params.title
    redir = true;
    res.redirect('/task');
});

// * ADD 404 page
app.get('/:id', (req, res) => {
    res.render('error');
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Listening on http://localhost:3000');
});