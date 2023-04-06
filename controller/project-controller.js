const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user model
const User = require("../models/user");
//project model
const Project = require("../models/project");

const mongoose = require("mongoose");

//Project Images RELATED API

//Add Project
const addProject = async (req, res) => {
  try {
    const projectNameExist = await Project.findOne({
      projectName: req.body.projectName,
    });
    if (projectNameExist) {
      res.status(400).send({ message: "Project Name Already Exists" });
      return;
    }
    let user;
    user = await User.findById(req.params.userId);
    const project = new Project({
      projectName: req.body.projectName,
      description: req.body.description,
      currentFile: req.body.projectName,
      creator: req.params.userId,
      access: {
        userId: req.params.userId,
        username: user.username,
      },
    });

    await project.save();
    user.projects.push(project);

    await user.save();

    res.status(200).send({ message: "Project Successfully Created" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//Get all the projects for the user
const getProjects = async (req, res) => {
  let userWithProjects;

  try {
    // const results = await Project.findById();
    userWithProjects = await User.findById(req.params.userId).populate(
      "projects"
    );
    res.status(200).send({
      project: userWithProjects.projects,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//adding access to different user
const addAccess = async (req, res) => {
  let project;
  let user;

  try {
    project = await Project.findOne({ projectName: req.params.projectName });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
  if (project.creator.toString() !== req.params.userId) {
    return res.status(401).send({
      message: "You are not allowed add access",
    });
  }

  let accessExist = project.access.find(
    (project) => project.username === req.body.addUserAccess
  );
  if (accessExist) {
    return res.status(400).send({ message: "User Access Already Exists" });
  }

  try {
    user = await User.findOne({ username: req.body.addUserAccess });
    user.projects.push(project._id);
    project.access.push({
      userId: user._id.toString(),
      username: user.username,
    });
  } catch (err) {
    return res.status(404).send({ message: "User not Found" });
  }

  try {
    await project.save();
    await user.save();
    res.status(200).send({
      message: "Access Add Successfully",
    });
  } catch (err) {
    res.status(500).send({
      message: "Something went wrong,could not update place",
    });
  }
};

//removing the access of user from a project
const removeAccess = async (req, res, next) => {
  const { userId, projectId } = req.body;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    //removing the user id from the access array of the project
    await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { access: { userId: userId } } },
      { new: true },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );

    //removing the project id from the user's project lists
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { projects: projectId } },
      { new: true },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      }
    );

    await session.commitTransaction();
    console.log("Removed access");
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message:
        "Something went wrong, could not remove the user access for the given project!",
    });
  }

  res.send({ message: "Successfully removed the user!" });
};

//fetching a single project using the userid and populating it with the projects
const getSingleProject = async (req, res) => {
  let userWithProjects;

  try {
    userWithProjects = await User.findById(req.params.userId).populate(
      "projects"
    );
    // console.log("userID", req.params.userId);
    // console.log("projectName", req.params.projectName);
    res.status(200).send({
      project: userWithProjects.projects.find(
        (project) => project.projectName === req.params.projectName
      ),
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//Save Project Api
const saveProject = async (req, res) => {
  try {
    await Project.findOneAndUpdate(
      { projectName: req.params.projectName },
      {
        currentFile: req.body.currentFile,
        $push: {
          version: {
            time: new Date(),
            fileName: req.body.prevFile,
          },
        },
      }
    );
    res.status(200).send({ message: "Code Successfully Saved" });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

//fetching all the version of the projects available
const getVersion = async (req, res) => {
  let userWithProjects;

  try {
    userWithProjects = await User.findById(req.params.userId).populate(
      "projects"
    );
    const test = await Project.findOne({
      projectName: req.params.projectName,
    });

    res.status(200).send({
      version: test.version.find((ver) => ver._id == req.params.versionId),
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

const prevVersion = async (req, res) => {
  const userId = req.params.projectName;
  try {
    await Project.findOne(
      { projectName: req.params.projectName },
      (err, project) => {
        if (err) {
          res.status(500).send({ message: err });
        }
        if (project) {
          const version = project.version.find(
            (v) => v.time.toString() === targetTime.toString()
          );
          // console.log(version.fileName);
          res.status(200).send(version.fileName);
        }
      }
    );
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.addProject = addProject;
exports.addAccess = addAccess;
exports.getProjects = getProjects;
exports.getSingleProject = getSingleProject;
exports.getVersion = getVersion;
exports.saveProject = saveProject;
exports.removeAccess = removeAccess;
