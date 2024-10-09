// controllers/usersController.js

const usersStorage = require("../storages/usersStorage");

exports.usersListGet = (req, res) => {
    res.render("index", {
        title: "User List",
        users: usersStorage.getUsers(),
    });
};

exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create User",
    });
};

exports.usersSearchGet = (req, res) => {
    const email = req.query.email;
    const user = usersStorage.getUserByEmail(email);
    if (user) {
        res.render("search", {
            title: "Search Results",
            user: user
        });
    }
    else {
        res.render("search", {
            title: "Search Results",
            user: null
        });
    }
}

// Creating new User
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const atErr = "must contain @ symbol.";
const dotErr = "must contain . symbol.";
const emailErr = "must be a valid email.";
const numErr = "must be numeric.";
const ageErr = "must be a number between 18 and 120";
const bioErr = "must be 200 characters or less";

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10}).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10}).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
        .contains('@').withMessage(`Email ${atErr}`)
        .contains('.').withMessage(`Email ${dotErr}`)
        .isEmail().withMessage(`Email ${emailErr}`),
    body("age").optional({nullable: true, checkFalsy: true})
        .trim()
        .isNumeric().withMessage(`Age ${numErr}`)
        .custom(async value => {
            if ( value < 18 || value > 120 ) {
                throw new Error(`Age ${ageErr}`);
            }
        }),
    body("bio").optional({nullable: true, checkFalsy: true})
        .isLength({ min: 1, max: 200 }).withMessage(bioErr)
];

exports.usersCreatePost = [
    validateUser,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("createUser", {
                title: "Create User",
                errors: errors.array()
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.addUser({ firstName, lastName, email, age , bio});
        res.redirect("/");
    }
];

exports.usersUpdateGet = (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    res.render("updateUser", {
        title: "Update user",
        user: user,
    });
};

exports.usersUpdatePost = [
    validateUser,
    (req, res) => {
        const user = usersStorage.getUser(req.params.id);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("updateUser", {
                title: "Update user",
                user: user,
                errors: errors.array(),
            });
        }
        const { firstName, lastName, email, age, bio } = req.body;
        usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
        res.redirect("/");
    }
];

exports.usersDeletePost = (req, res) => {
    usersStorage.deleteUser(req.params.id);
    res.redirect("/");
}