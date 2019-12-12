import express from 'express';
import User from '../models/UserSchema';
import 'babel-polyfill'
import {parseError} from '../../util/helper'
import mongoose from 'mongoose';


const employeeRoutes = express.Router();

employeeRoutes.get('', async (req, res) => {
  const {userId} = req.session.user;
  const employees = await User.find({manager: mongoose.Types.ObjectId(userId)});
  res.send(employees.map(employee => ({fullName: employee.fullName, empId: employee._id})));
});


export default employeeRoutes;