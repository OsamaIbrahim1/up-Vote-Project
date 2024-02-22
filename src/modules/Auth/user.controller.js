import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../../../DB/models/user.models.js";
import sendEmailService from "../services/send-email.service.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";

//=========================== sign Up ============================//
/**
 * * destructure the required data from the request body
 * * check if the user already exists in the database using the email
 * * create token for the user
 * * send confirmation email to the user and check if sent
 * * hash password and check password is hashed
 * * create new document in the database
 * * response success
 */
export const signUp = async (req, res, next) => {
  // * destructure the required data from the request body
  const { firstName, lastName, username, email, password, gender, role, age } =
    req.body;
  ({
    firstName,
    lastName,
    username,
    email,
    password,
    gender,
    role,
    age,
  });

  // * check if the user already exists in the database using the email
  const isEmailDuplicated = await User.findOne({ email });
  if (isEmailDuplicated)
    return next(
      new Error(`Email already exists, Please try another email`, {
        cause: 409,
      })
    );

  // * create token for the user
  const usertoken = jwt.sign({ email }, process.env.JWT_SECRET_VERFICATION, {
    expiresIn: "2m",
  });

  // * send confirmation email to the user and check if sent
  const isEmailSent = await sendEmailService({
    to: email,
    subject: "Email Verification",
    message: `
      <h2>please clich on this link to verfiy your email</h2>
      <a href="http://localhost:3000/user/verify-email?token=${usertoken}">Verify Email</a>
      `,
  });
  if (!isEmailSent) {
    return next(
      new Error("Email is not sent, please try again later", { cause: 500 })
    );
  }

  // * hash password and check password is hashed
  const hashedPassword = bcryptjs.hashSync(password, +process.env.SALT_ROUNDS);
  if (!hashedPassword) {
    return next(new Error(`password not hashed`, { cause: 404 }));
  }

  // * create new document in the database
  const objectUser = {
    firstName,
    lastName,
    username,
    email,
    password: hashedPassword,
    gender,
    role,
    age,
  };
  const newUser = await User.create(objectUser);
  req.savedDocuments = { model: User, _id: newUser._id };
  if (!newUser) return next(new Error(`user not created`, { cause: 404 }));

  // * response success
  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser,
  });
};

//============================= Verify Email =============================//
/**
 * * destructure token from query and decode token
 * * get user by email , isEmailVerified  = false and update isEmailVerified = true
 * * response successfully
 */
export const verifyEmail = async (req, res, next) => {
  // * destructure token from query and decode token
  const { token } = req.query;
  const decodedData = jwt.verify(token, process.env.JWT_SECRET_VERFICATION);
  // * get user by email , isEmailVerified  = false and update isEmailVerified = true
  const user = await User.findOneAndUpdate(
    { email: decodedData.email, isEmailVerified: false },
    { isEmailVerified: true },
    { new: true }
  );
  if (!user) return next(new Error(`user not found`, { cause: 404 }));

  // * response successfully
  res.status(201).json({
    success: true,
    message: "Email verified successfully,please try to login",
  });
};

//============================= sign In =============================//
/**
 * * destructure data from body
 * * email check
 * * hash password
 * * generate new token
 * * response successfully
 */
export const signIn = async (req, res, next) => {
  // * destructure data from body
  const { email, password } = req.body;

  // * email check
  const isEmailExists = await User.findOne({ email, isEmailVerified: true });
  if (!isEmailExists)
    return next(new Error("invalid login credentials", { cause: 404 }));

  // * hash password
  const isPasswordMatched = bcryptjs.compareSync(
    password,
    isEmailExists.password
  );
  if (!isPasswordMatched)
    return next(new Error("invalid login credentials", { cause: 404 }));

  // * generate new token
  const token = jwt.sign(
    {
      id: isEmailExists._id,
      userEmail: isEmailExists.email,
      role: isEmailExists.role,
    },
    process.env.LOGIN_SIGNATURE,
    {
      expiresIn: "1h",
    }
  );

  // * response successfully
  res.status(200).json({ message: "User LoggedIn successfully", token });
};

//============================= update Account =============================//
/**
 * * destructure data from body and authUser
 * * update email
 * * update firstName and lastName and username and gender and role and age
 * * response successfully
 */
export const updateAccount = async (req, res, next) => {
  // * destructure data from body and authUser
  const { _id, oldEmail } = req.authUser;
  const { firstName, lastName, username, email, gender, role, age } = req.body;

  // * update email
  if (email) {
    if (email === oldEmail) {
      return next("email is the same olde email, Enter new email", {
        cause: 400,
      });
    }
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return next("email is already exists, enter new email", { cause: 400 });
    }
  }

  // * update firstName and lastName and username and gender and role and age
  const updateUser = await User.findByIdAndUpdate(
    { _id },
    { firstName, lastName, username, email, gender, role, age },
    { new: true }
  );
  if (!updateUser) {
    return next("Account is not updated", { cause: 400 });
  }

  // * response successfully
  res.status(200).json({
    success: true,
    message: "Account updated successfully",
    data: updateAccount,
  });
};

//============================= delete Account =============================//
/**
 * * destructure the user data from request headers
 * * find the user and delete them from the database
 * * response successfully
 */
export const deleteAccount = async (req, res, next) => {
  // * destructure the user data from request headers
  const { _id } = req.authUser;

  // * find the user and delete them from the database
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  // * response successfully
  res.status(200).json({ message: "Successfully deleted", data: user });
};

//============================= Get User Profile =============================//
/**
 * * destructure data from authUser
 * * find data user
 * * response successfully
 */
export const getUserProfile = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  // * find data user
  const user = await User.findById(_id, "-password -isEmailVerified -_id");
  if (!user) {
    return next("user not found", { cause: 404 });
  }

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "get data successfully", data: user });
};

//============================= upload Image for user =============================//
/**
 *
 */
export const uploadImage = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  const user = await User.findById(_id);
  if (!user) {
    return next("user not found", { cause: 404 });
  }

  // * check if user not uploade image
  if (!req.file) {
    return next("enter one Image please.", { cause: 400 });
  }
  // * folder Id
  const folderId = generateUniqueString(5);

  // * upload image
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `${process.env.MAIN_FOLDER}/users/${folderId}`,
    });
  user.Image = { secure_url, public_id };
  user.folderId = folderId;

  // * save changes
  await user.save();

  req.folder = `${process.env.MAIN_FOLDER}/users/${folderId}`;

  // * response successfully
  res.status(200).json({ success: true, message: "upload successfully" });
};
