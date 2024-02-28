import Comment from "../../../DB/models/comment.model.js";
import Likes from "../../../DB/models/like.model.js";
import Product from "../../../DB/models/product.model.js";
import Reply from "../../../DB/models/reply.model.js";

//========================= add like =======================//
/**
 * * destructure data from body and authUser and query
 * * check the model {"Product","Comment","Reply"}
 * * check if decument is already exists
 * * check if the user like this document
 * * create new decument
 * * save chenges
 * * response successfully
 */
export const addLike = async (req, res, next) => {
  // * destructure data from body and authUser and params
  const { likeDoneOnId } = req.params;
  const { onModel } = req.body;
  const { _id } = req.authUser;

  // * check the model {"Product","Comment","Reply"}
  let dbModel = "";
  if (onModel === "Product") dbModel = Product;
  if (onModel === "Comment") dbModel = Comment;
  if (onModel === "Reply") dbModel = Reply;

  // * check if decument is already exists
  const decument = await dbModel.findById(likeDoneOnId);
  if (!decument) {
    return next(` ${onModel} is not found'`, { cause: 404 });
  }

  // * check if the user like this document
  const isAlreadyLike = await Likes.findOne({ likedBy: _id, likeDoneOnId });
  if (isAlreadyLike) {
    await Likes.findByIdAndDelete(isAlreadyLike._id);
    decument.numberOfLikes -= 1;
    decument.save();
    return res
      .status(200)
      .json({ message: "unLike Done", count: decument.numberOfLikes });
  }

  // * create new decument
  const decumentObj = {
    likedBy: _id,
    likeDoneOnId,
    onModel,
  };
  const like = await Likes.create(decumentObj);

  // * save chenges
  decument.numberOfLikes += 1;
  decument.save();

  // * response successfully
  res.status(201).json({
    success: true,
    message: "Like Done",
    like,
    data: decument.numberOfLikes,
  });
};

//========================= get user likes history =======================//
/**
 * * destructure data from authUser
 * * generate object to assgin the filter object to it then send it to find method
 * * response successfully
 */
export const getUserLikeHistory = async (req, res, next) => {
  // * destructure data from authUser
  const { _id } = req.authUser;

  // * generate object to assgin the filter object to it then send it to find method
  let queryFilter = {};
  if (req.query.onModel) queryFilter.onModel = req.query.onModel;
  queryFilter.likedBy = _id;

  const likes = await Likes.find(queryFilter).populate({
    path: "likeDoneOnId",
    populate: {
      path: "addedBy",
      select: "username",
    },
  });

  // * response successfully
  res.status(200).json({ message: "done", likes });
};
