import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Survey"
  },
  expiry_date: {
    type: Number,
    default: 0
  },
  start_date: {
    type: Number,
    default: 0
  },
  creation_date: {
    type: Number,
    default: new Date().getTime()
  },
  survey_template: {
    type: Object,
    default: {}
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  assigned_to: {
    type: [{employee: {type: mongoose.Types.ObjectId, ref: 'User'}, completion_status: {type: String, default: 'Unfinished'}}],
    default: []
  }
});

const Survey = mongoose.model('survey', SurveySchema);
export default Survey;