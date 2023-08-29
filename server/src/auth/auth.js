// const express = require("express");
// const app = express();
// const bcrypt = require("bcrypt");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const flash = require("express-flash");
// const session = require("express-session");
// const methodOverride = require("method-override");
// const { PrismaClient } = require("@prisma/client");

// const prisma = new PrismaClient();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(flash());
// app.use(
//     session({
//         // secret: process.env.SESSION_SECRET,
//         secret: "aaaaaa",
//         resave: false,
//         saveUninitialized: false,
//     })
// );
// app.use(passport.initialize());
// app.use(passport.session());
// app.use(methodOverride("_method"));

// passport.use(
//     new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
//         try {
//             const user = await prisma.user.findUnique({ where: { email } });
//             if (!user) {
//                 return done(null, false, { message: "No user found with that email" });
//             }
//             if (await bcrypt.compare(password, user.passwordHash)) {
//                 return done(null, user);
//             } else {
//                 return done(null, false, { message: "Password Incorrect" });
//             }
//         } catch (e) {
//             console.log(e);
//             return done(e);
//         }
//     })
// );

// passport.serializeUser((user, done) => done(null, user.id));
// passport.deserializeUser(async (id, done) => {
//     const user = await prisma.user.findUnique({ where: { id } });
//     return done(null, user);
// });

// app.post("/login", (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//         if (err) return next(err);
//         if (!user) return res.status(401).json({ message: info.message });
//         req.logIn(user, (err) => {
//             if (err) return next(err);
//             return res.status(200).json({ message: "Logged in successfully" });
//         });
//     })(req, res, next);
// });

// app.post("/register", async (req, res) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);
//         const user = await prisma.user.create({
//             data: {
//                 firstName: "aaa",
//                 lastName: "bbb",
//                 fullName: "aaa bbb",
//                 email: req.body.email,
//                 passwordHash: hashedPassword,
//                 role: "DEVELOPER"
//             },
//         });
//         console.log(user); // Display newly registered user in the console
//         res.status(201).json({ message: "User registered successfully" });
//     } catch (e) {
//         console.log(e);
//         res.status(500).json({ message: "Error registering user" });
//     }
// });

// app.get("/", (req, res) => {
//     if (req.isAuthenticated()) {
//         res.status(200).json({ message: `Welcome, ${req.user.name}!` });
//     } else {
//         res.status(401).json({ message: "Not authenticated" });
//     }
// });

// app.delete("/logout", (req, res) => {
//     req.logout();
//     res.status(200).json({ message: "Logged out successfully" });
// });

// app.listen(4500, () => {
//     console.log("Server started on http://localhost:4500");
// });


//////////////////////////////////////////////////////////////////////////
// data: {
//     email,
//     passwordHash: hashedPassword,
//     firstName: "aaa",
//     lastName: "bbb",
//     fullName: "aaa bbb",
//     role: "DEVELOPER"
// },
//////////////////////////////////////////////////////////////////////////

/* 2
// Import the required modules
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Create an instance of express app
const app = express();

// Use JSON parser middleware
app.use(express.json());

// Use session middleware
app.use(
    session({
        secret: "some secret", // Change this to a secure and random string
        resave: false,
        saveUninitialized: false,
    })
);

// Initialize passport and use session middleware
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
    req.logout((err) => {
        if (err) {
            // Handle the error here
            return res.status(500).json({ error: "Logout error" });
        }
        res.status(200).json({ message: "Logged out" });
    });
});


// Define a route to get the current user using passport method
app.get("/me", isAuthenticated, (req, res) => {
    // Return the current user without the password
    const user = req.user;
    delete user.password;
    res.status(200).json(user);
});

// Define a route to get some protected data using the isAuthenticated helper function
app.get("/secret", isAuthenticated, (req, res) => {
    res.status(200).json({ message: "This is a secret message" });
});

// Start the server on port 3000
app.listen(4500, () => {
    console.log("Server listening on port 4500");
});
*/

//////////////////////////////////////////////////////////////////////////

/*
// Define the Session model in your Prisma schema
model Session {
  id        String   @id @default(uuid()) // Use a UUID as the primary key
  sid       String   @unique // Use the session ID as a unique field
  data      String   @db.Text // Use a Text type to store the session data
  expiresAt DateTime // Use a DateTime type to store the expiration date
}
*/




// Import the required modules
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");

// Create an instance of PrismaClient
const prisma = new PrismaClient();

// Create an instance of express app
const app = express();

// Use JSON parser middleware
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

// Initialize passport and use session middleware
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














