import axios from "axios";
import Comment from "../../../DB/models/comment.model.js";
import Product from "../../../DB/models/product.model.js";
import Reply from "../../../DB/models/reply.model.js";

//============================ add comment ==============================//
/**
 * * destructure data from body and query and authUser
 * * check if product is already exists
 * * create new comment
 * * response successfully
 */
export const addComment = async (req, res, next) => {
  // * destructure data from body and query and authUser
  const { _id } = req.authUser;
  const { content } = req.body;
  const { productId } = req.query;

  // * check if product is already exists
  const product = await Product.findById(productId);
  if (!product) {
    return next("Product not found", { cause: 404 });
  }

  // * create new comment
  const commentObj = {
    content,
    addedBy: _id,
    productId,
  };
  const comment = await Comment.create(commentObj);
  if (!comment) {
    return next("Comment not created", { cause: 400 });
  }

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "Comment added comment", data: comment });
};

//============================ delete comment ==============================//
/**
 * * destructure data from query and authUser
 * * delete comment
 * * response successfully
 */
export const deleteComment = async (req, res, next) => {
  // * destructure data from query and authUser
  const { _id } = req.authUser;
  const { commentId } = req.query;

  // * delete comment
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    addedBy: _id,
  });
  if (!comment) {
    return next("Comment not deleted", { cause: 400 });
  }

  // const await Reply.deleteMany({ replyOnId: commentId });

  // * response successfully
  res.status(200).json({ success: true, message: "comment deleted" });
};

//============================ update comment ==============================//
/**
 * * destructure data from body and query and authUser
 * * check if comment is already existing
 * * update comment
 * * save comment
 * * response successfully
 */
export const updateComment = async (req, res, next) => {
  // * destructure data from body and query and authUser
  const { commentId } = req.query;
  const { _id } = req.authUser;
  const { content } = req.body;

  // * check if comment is already existing
  const comment = await Comment.findOne({ _id: commentId, addedBy: _id });
  if (!comment) {
    return next("comment not found", { cause: 404 });
  }

  // * update comment
  comment.content = content;

  // * save comment
  await comment.save();

  // * response successfully
  res.status(200).json({
    success: true,
    message: "comment updated successfully",
    data: comment,
  });
};

//============================ like and unlike comment ==============================//
/**
 * * destructure data from authUser and body and params
 * * call like API
 *
 */
export const likeComment = async (req, res, next) => {
  // * destructure data from authUser and body and params
  const { commentId } = req.params;
  const { onModel } = req.body;
  const { accesstoken } = req.headers;

  // * call like API
  axios({
    method: "post",
    url: `http://localhost:3000/like/addLike/${commentId}`,
    data: { onModel },
    headers: { accesstoken },
  })
    .then((response) => {
      res.status(200).json({ success: true, response: response.data });
    })
    .catch((error) => {
      res.status(500).json({ catch: error.data });
    });
};
