import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Survey"
  },
  expiry_date: {
    type: Date,
    default: Date.now()
  },
  creation_date: {
    type: Date,
    default: Date.now()
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