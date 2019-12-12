import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import 'babel-polyfill';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        // validate: {
        //     validator: username => User.doesNotExist({ username }),
        //     message: "Username has already been registered"
        // }
    },
    password: {
        type: String,
        required: true
    },
    surveys_assigned: {
        type: [{ survey_id: { type: mongoose.Types.ObjectId, ref:'survey'}, survey_status: String }],
        default: []
    },
    created_surveys: {
        type: [{ type: mongoose.Types.ObjectId, ref:'survey'}],
        default: []
    },
    role: {
        type: String,
        default: 'user'
    },
    manager: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    positionTitle: String,
    companyName: String,
    startDate: String

});

UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.generatePassword = function(pass){
    return bcrypt.hashSync(pass, bcrypt.genSaltSync(8), null);
}

UserSchema.pre('save', () => {
    if (this.isModified('password')) {
        this.password = generatePassword(this.password);
      }
});

UserSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.password); 
}

const User = mongoose.model('user', UserSchema);
export default User;
