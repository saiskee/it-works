import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
    survey_data: {
        type: String,
        default: '{}'
    },
    survey_responses: {
        type: Array,
        default: []
    },
    users_sent_to: {
        type: Array,
        default: []
    },
    expiry_date: {
        type: Date,
        default: Date.now()
    },
    creation_date: {
        type: Date,
        default: Date.now()
    },
});
const Survey = mongoose.model('survey', SurveySchema);
export default Survey;