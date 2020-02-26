// import { SchemaFactory } from "dotup-ts-mongoose";
// import { AccountModel } from "../models/AccountModel";
// import { AccountProfileSchema, LinkedAccountSchema } from "./SubSchemas";

// const factory = new SchemaFactory<AccountModel>("Accounts");
// factory
//   // .addField("name", String, true, true)
//   .addField("email", String, true, true)
//   // .addField("ext", String)
//   .addField("password", String)
//   // .addField("url", String)
//   .addField("passwordResetToken", String)
//   .addField("passwordResetExpires", Date)
//   // .addField("tokens", Schema.Types.Mixed)
//   .addField("profile", AccountProfileSchema)
//   .addField("linkedAccounts", [LinkedAccountSchema]);

// // factory.addSchemaDefinition({
// //   "root": [{ type: Schema.Types.ObjectId, ref: "folders" }]
// // });

// export const UserEntity = factory.CreateModel();
