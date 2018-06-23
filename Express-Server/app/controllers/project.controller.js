
const Project = require('../models/project.model.js');

exports.create = (req, res) => {
    if (!req.body.Title) {
        return res.status(400).send({
            message: "Name can not be Empty"
        });
    }

    const project = new Project({
        Title: req.body.Title,
        Goals: req.body.Goals,
        Expenses: req.body.Expenses,
        Revenue: req.body.Revenue,
        Users: req.body.Users
    });

    project.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating the project."
            });
        });

};

exports.findAll = (req, res) => {
    Project.find()
        .then(projects => {
            res.send(projects);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while retrieving projects"
            });
        });
};

exports.findOne = (req, res) => {
    Project.findById(req.params.projectId)
        .then(project => {
            if (!project) {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            res.send(project);

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            return res.status(500).send({
                message: "Error retrieving project with id " + rep.params.projectId
            });
        });
};

exports.getValuesByDate = (req, res) => {
    Project.find({"Expenses.Date" : {$gte: new Date(req.params.year, req.params.month)}}).then( Exp => {
      console.log(Exp);
    }
    );

    Project.findById(req.params.projectId)
    // select * From Expenses where Expenses.Date < req.para.Enddate and Expenses.Date > req.para.Startdate
        .then(project => {
            var result = { Expenses: [], Revenue: [], Goals: [] };
            if (!project) {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }

            project.Expenses.map(ex => {
                if (ex.Date.getMonth() == req.params.month - 1 && ex.Date.getFullYear() == req.params.year) {
                    result.Expenses.push(ex)
                }
            });

            project.Goals.map(ex => {
                if (ex.Date.getMonth() == req.params.month - 1 && ex.Date.getFullYear() == req.params.year) {
                    result.Goals.push(ex)
                }
            });

            project.Revenue.map(ex => {
                if (ex.Date.getMonth() == req.params.month - 1 && ex.Date.getFullYear() == req.params.year) {
                    result.Revenue.push(ex)
                }
            });



            res.send(result)

        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            return res.status(500).send({
                message: "Error retrieving project with id " + rep.params.projectId
            });
        });

}

exports.update = (req, res) => {
    if (!req.body.Title) {
        return res.status(400).send({
            message: "Project Name can not be empty"
        });
    }

    Project.findByIdAndUpdate(req.params.projectId, {
        Title: req.body.Title,
        Goals: req.body.Goals,
        Expenses: req.body.Expenses,
        Revenue: req.body.Revenue,
        Users: req.body.Users
    }, { new: true })
        .then(project => {
            if (!project) {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            res.send(project);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            return res.status(500).send({
                message: "Error updating project with id " + req.params.projectId
            });
        });
};

exports.delete = (req, res) => {
    Project.findByIdAndRemove(req.params.projectId)
        .then(project => {
            if (!project) {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            res.send({ message: "Project deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Project not found with id " + req.params.projectId
                });
            }
            return res.status(500).send({
                message: "Could not delete Project with id " + req.params.projectId
            });
        });
};
