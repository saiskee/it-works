/* Mailing system for It-Works */
import mongoose from 'mongoose';
import User from '../models/UserSchema';
import Survey from '../models/SurveySchema';
import nodemailer from 'nodemailer';
import {addDays, differenceInDays, subHours, isAfter} from 'date-fns';
import schedule from 'node-schedule';

const SurveyStatus = {
  UNFINISHED: "Unfinished",
  FINISHED: "Finished",
  EXPIRED: "Expired"
};

async function EmailUsers(users, message) {
  // If this was being published we would get a real email...
  // This was mostly taken from the Node Mailer documentation page:
  // https://nodemailer.com/about/
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // Plain text password because we are cool like that.
      user: 'ItWorksRobot@gmail.com',
      pass: 'BestProduct' 
    }
  });

  User.find({ _id: {$in: users} }, (err, users) => {
    if (err) {
      console.log(err);
      return;
    }
    let emails = users.map((user_obj) => user_obj.username);
    // NodeMailer takes its emails as a string list... for some ungodly reason.
    emails = emails.reduce((full_string, email) => full_string += ', ' + email, "");
    transporter.sendMail({
      from: 'ItWorksRobot@gmail.com', // sender address
      to: emails,
      subject: "Update from It Works!", // Subject line
      text: message
    });
  });
}

function EmailUnfinishedUsersForSurvey(surveyId, message) {
  // First find all users assigned to this survey.
  Survey.findOne({ _id: mongoose.Types.ObjectId(surveyId) }, (err, survey) => {
    if (err) {
      console.log(err);
      return;
    }
    let unfinished_users = survey.assigned_to.filter((user) => user.completion_status === "Unfinished");
    unfinished_users = unfinished_users.map((assign_obj) => mongoose.Types.ObjectId(assign_obj.employee));
    EmailUsers(unfinished_users, message);
  });
}

export function scheduleEmailAlerts(surveyId, start_date, end_date, message) {
  // We want to send one email now.
  EmailUnfinishedUsersForSurvey(surveyId, message);
  // Then one in the middle of the time interval.
  let days_to_midpoint = differenceInDays(end_date, start_date);
  if (days_to_midpoint >= 1) {
    schedule.scheduleJob(addDays(start_date, days_to_midpoint), () => EmailUnfinishedUsersForSurvey(surveyId, message));
  }
  // Then finally one an hour before the survey closes (unless that is before the start interval.)
  if (isAfter(subHours(end_date, 1),start_date)) {
    schedule.scheduleJob(subHours(end_date, 1), () => EmailUnfinishedUsersForSurvey(surveyId, message));
  }
}

