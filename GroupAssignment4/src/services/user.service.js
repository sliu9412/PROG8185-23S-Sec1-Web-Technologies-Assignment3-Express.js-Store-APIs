/**
 * User service business logic
 */
const User = require('../models/user.model');
const AppError = require('../exception/app.exception');

const createUser = async (userData) => {
    const { email, username } = userData;
    await validateExistingUser(email, username);
    // create new user
    const newUser = await create(userData);
    console.log('New User was created successfully', newUser);
    return newUser;
};

const updateUser = async (userID, userData) => {
    const actualUser = await findUserByID(userID);
    try {
        const { name, email, username, password, shippingAddress } = userData;
        // Update user data
        actualUser.name = name;
        actualUser.email = email;
        actualUser.username = username;
        actualUser.password = password;
        actualUser.shippingAddress = shippingAddress;
        await actualUser.save();
        return actualUser;
    } catch (err) {
        throw new AppError('Error updating user', 500).withOriginalStack(err);
    }
}

const findAllUsers = async () => {
    return User.find();
}

const findUserByID = async (userID) => {
    const user = await User.findById(userID);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
}

const findUserByIDAndDelete = async (userID) => {
    const user = await User.findByIdAndDelete(userID);
    if (!user) {
        throw new AppError('User not found', 404);
    }
    return user;
}

const create = async (userData) => {
    try {
        const { name, email, username, password, shippingAddress } = userData;
        const newUser = new User({
            name,
            email,
            username,
            password,
            shippingAddress,
        });
        await newUser.save();
        return newUser;
    } catch (err) {
        throw new AppError('Error creating user', 500).withOriginalStack(err);
    }
};

const validateExistingUser = async (email, username) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new AppError('Email or username already exists', 409);
    }
};

const findByUsernameAndPassword = async (username, password) => {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
        throw new AppError('Invalid credentials', 401);
    }
    if (existingUser.password !== password) {
        throw new AppError('Invalid credentials', 401);
    }
    return existingUser;
};

module.exports = {
    createUser,
    updateUser,
    findUserByID,
    findAllUsers,
    findByUsernameAndPassword,
    findUserByIDAndDelete,
};
