import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import UserService from "..//services/user_service";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient,User } from '@prisma/client'
const prisma = new PrismaClient();


const initializePassport = (app: express.Application) => {
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

    passport.use(
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
            try {
                const user = await UserService.getUserByEmail(email)
                if (!user) {
                    return done(null, false);
                }
                const match = await bcrypt.compare(password, user.passwordHash);
                if (!match) {
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user: any, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await UserService.getUserById(id)
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

export default initializePassport;
