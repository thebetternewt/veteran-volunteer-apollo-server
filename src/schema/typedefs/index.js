import need from "./need";
import needTypes from "./needTypes";
import recipientProfile from "./recipientProfile";
import request from "./request";
import root from "./root";
import user from "./user";
import volunteerProfile from "./volunteerProfile";

export default [
  root,
  user,
  recipientProfile,
  volunteerProfile,
  need,
  request,
  ...needTypes
];
