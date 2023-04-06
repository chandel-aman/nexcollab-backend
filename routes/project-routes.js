const router = require("express").Router();

const projectsController = require("../controller/project-controller");

//Create Project API
router.post("/:userId/createpro", projectsController.addProject);

//Add access API
router.post("/:userId/:projectName/add", projectsController.addAccess);

//Remove access API
router.delete("/:userId/:porjectName/removeAccess", projectsController.removeAccess);

//Save Project API
router.post("/:userId/:projectName", projectsController.saveProject);

//Version Control Api
router.get("/:userId/:projectName/:versionId", projectsController.getVersion);

// router.use(checkAuth);

//Get All Projects  API
router.get("/:userId", projectsController.getProjects);

//Get Single Project  API
router.get("/:userId/:projectName", projectsController.getSingleProject);


//Update User API
// router.get("/:userId/:projectName/:version", usersController.updateUser);

module.exports = router;
