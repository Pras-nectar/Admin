const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const Address = require("./Address")

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["Doctor", "Customer", "Admin", "SuperAdmin"]
    },
    username: {
        type: String
    },
    phoneNo: {
        type: Number,
        required: true,
        //unique: true
    },
    doctor: {
        doctorName: {
            type: String,
            // required: true
        },
        picture: {
            type: String,
        },
        specialization: {
            type: String,
            // required: true
        },
        rating: {
            type: Number,
            // required: true
        },
        comments: [
            String
        ],
        consultations: {
            type: Number,
            // required: true
        },
        experience: {
            type: String,
            // required: true
        },
        about: {
            type: String,
            // required: true,
            // minlength: 10
        },
        documents: [
            String
        ],
        isApproved: {
            type: Boolean,
            default: false
        },
    },

    recentlyViewed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],

    isPhoneNoVerified: {
        type: Boolean,
        default: false
    },

    address: [
        {
            ref: 'Address',
            type: mongoose.Schema.Types.ObjectId
        }
    ]
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
        })

    })

})

UserSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Address.deleteMany({
            _id: {
                $in: doc.address
            }
        })
    }
})

UserSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err)
            }
            if (!isMatch) {
                return reject(err)
            }
            resolve(true)
        })
    })

}

UserSchema.methods.getInfo = function () {
    let user = { ...this }._doc;
    delete user.password;
    delete user.recentlyViewed;
    delete user.address;
    return user;
}

const User = mongoose.model('User', UserSchema);
module.exports = User;