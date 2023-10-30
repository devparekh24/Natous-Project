const mongoose = require('mongoose');
const crypto = require('crypto')
const validator = require('validator');
const bycrypt = require('bcryptjs')
const { default: isEmail } = require('validator/lib/isEmail');

//schema fields = name, password, confirm password, email, photo

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must has a name']
    },
    email: {
        type: String,
        required: [true, 'User must has an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']

    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Password is indeed!'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'please confirm your password!'],
        validate: {
            //this is only work on create() and save()
            validator: function (el) {
                return el === this.password;
            },
            message: 'It is always match with password!'
        }
    },
    photo: {
        type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
})

userSchema.pre('save', async function (next) {

    //if password is actually modified this fn will run 
    if (!this.isModified('password')) return next();

    //hash the password with cost of 12
    this.password = await bycrypt.hash(this.password, 12);

    //delete the confirmpassword field
    this.confirmPassword = undefined;
    next();
})

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next();
})

//userPassword is always in hashed(its DB password) while candidatePassword is readable password(its req body password)
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bycrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {

        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)

        console.log(changedTimeStamp, JWTTimestamp)
        return changedTimeStamp > JWTTimestamp;
    }
    return false;
}

userSchema.methods.resetTokenForCreatePassword = function () {

    const resetToken = crypto.randomBytes(32).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    console.log({ resetToken }, this.passwordResetToken)

    // // otp generation
    // const {
    //     randomInt,
    // } = require('node:crypto');

    // randomInt(0, 1000000, (err, n) => {
    //     if (err) throw err;
    //     console.log(`Random number chosen from (0, to 100K): ${n}`);
    // });

    return resetToken;
}

const User = mongoose.model('User', userSchema)
module.exports = User;