import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import * as AdminJSMongoose from "@adminjs/mongoose"; // Corrected import
import User from "../models/User.Model.js";
import  Chat  from "../models/Group.Model.js";
import dotenv from "dotenv";
dotenv.config();

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  resources: [
    { resource: User, options: { parent: { name: "Database" } } },
    { resource: Chat, options: { parent: { name: "Database" } } },
  ],
  rootPath: "/admin", 
});

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      const admin = await User.findOne({ email, role: "admin" });
      if (admin && password==process.env.ADMIN_PASS) {
        return admin;
      }
      return null;
    },
    cookiePassword: process.env.ADMIN_COOKIE_SECRET || "supersecret",
  }, null, {
    resave: false, 
    saveUninitialized: false, 
  });
  


export { adminJs, adminRouter };
