const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Use session middleware with PrismaSessionStore
app.use(
    session({
        cookie: {
            maxAge: 4 * 7 * 24 * 60 * 60 * 1000 //7 * 24 * 60 * 60 * 1000 // week in ms
        },
        secret: "some secret", // Change this to a secure and random string
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Define the local strategy for passport
passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            // Find the user by email in the database
            const user = await prisma.user.findUnique({ where: { email } });
            // If no user is found, return false
            if (!user) {
                return done(null, false);
            }
            // Compare the password with the hashed password in the database
            const match = await bcrypt.compare(password, user.passwordHash);
            // If the password does not match, return false
            if (!match) {
                return done(null, false);
            }
            // If the password matches, return the user
            return done(null, user);
        } catch (error) {
            // If there is an error, return it
            return done(error);
        }
    })
);

// Define how to serialize and deserialize the user for passport
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Define a helper function to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

// Define a route to register a new user
app.post("/register", async (req, res) => {
    try {
        // Get the email and password from the request body
        const { email, password } = req.body;
        // Validate the email and password
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        // Check if the email already exists in the database
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create a new user in the database with the email and hashed password
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash: hashedPassword,
                firstName: "aaa",
                lastName: "bbb",
                fullName: "aaa bbb",
                role: "DEVELOPER"
            },
        });
        // Return the created user without the password
        delete user.password;
        res.status(201).json(user);
    } catch (error) {
        // If there is an error, return it
        res.status(500).json({ message: error.message });
    }
});

// Define a route to login a user using passport local strategy
app.post("/login", passport.authenticate("local"), (req, res) => {
    // Return the logged in user without the password
    const user = req.user;
    delete user.password;
    res.status(200).json(user);
});

// Define a route to logout a user using passport method
app.post("/logout", isAuthenticated, (req, res) => {
    req.logout();
    res.status(200).json({ message: "Logged out" });
});

// Define a route to get the current user using passport method
app.get("/me", isAuthenticated, (req, res) => {
    // Return the current user without the password
    const user = req.user;
    delete user.password;
    res.status(200).json(user);
});

// Define a route to get some protected data using the isAuthenticated helper function
app.post("/logout", isAuthenticated, (req, res) => {
    req.logout((err) => {
        if (err) {
            // Handle the error here
            return res.status(500).json({ error: "Logout error" });
        }
        res.status(200).json({ message: "Logged out" });
    });
});


// Start the server on port 3000
app.listen(4500, () => {
    console.log("Server listening on port 4500");
});