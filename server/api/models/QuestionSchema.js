import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  survey_responses: {
    type: Array,
    default: []
  },
  question_data: {
    type: Object,
    default: {}
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'user'
  }
});

const Question = mongoose.model('question', QuestionSchema);
export default Question;
