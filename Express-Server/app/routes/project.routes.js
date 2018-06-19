module.exports = (app) => {
    const projects = require('../controllers/project.controller.js');

    app.post('/projects',projects.create);

    app.get('/projects',projects.findAll);

    app.get('/projects/:projectId',projects.findOne);

    app.get('/projects/:projectId/:month/:year',projects.getValuesByDate);

    app.put('/projects/:projectId',projects.update);

    app.delete('/projects/:projectId',projects.delete);
}
