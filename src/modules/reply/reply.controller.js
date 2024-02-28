import axios from "axios";
import Comment from "../../../DB/models/comment.model.js";
import Reply from "../../../DB/models/reply.model.js";

//============================ add reply ==============================//
/**
 * * destructure data from body and authUser and query
 * * check if the reply for (comment or reply)
 * * check if comment is already exists
 * * check if reply is already exists
 * * create reply
 * * response successfully
 */
export const addReply = async (req, res, next) => {
  // * destructure data from body and authUser and query
  const { _id } = req.authUser;
  const { content, onModel } = req.body;
  const { replyOnId } = req.query;

  // * check if the reply for (comment or reply)
  if (onModel === "Comment") {
    // * check if comment is already exists
    const comment = await Comment.findById(replyOnId);
    if (!comment) return next("Comment not found", { cause: 404 });
  } else if (onModel === "Reply") {
    // * check if reply is already exists
    const checkReply = await Reply.findById(replyOnId);
    if (!checkReply) return next("Reply not found", { cause: 404 });
  }

  // * create reply
  const reply = await Reply.create({
    content,
    addedBy: _id,
    onModel,
    replyOnId,
  });

  // * response successfully
  res.status(201).json({
    success: true,
    message: "reply created successfully",
    data: reply,
  });
};

//============================ delete reply ==============================//
/**
 * * destructure data from query and authUser
 * * delete comment
 * * delete all replies for this reply
 * * response successfully
 */
export const deleteReply = async (req, res, next) => {
  // * destructure data from query and authUser
  const { _id } = req.authUser;
  const { replyId } = req.query;

  // * delete comment
  const reply = await Reply.findOneAndDelete({
    _id: replyId,
    addedBy: _id,
  });
  if (!reply) {
    return next("Comment not deleted", { cause: 400 });
  }

  // * delete all replies for this reply
  await Reply.deleteMany({ replyOnId: replyId });

  // * response successfully
  res.status(200).json({ success: true, message: "reply deleted" });
};

//============================ update reply ==============================//
/**
 * * destructure data from query and authUser and body
 * * check if reply is already existing
 * * update reply
 * * save reply 
 * * response successfully
 */
export const updateReply = async (req, res, next) => {
  // * destructure data from query and authUser and body
  const { content } = req.body;
  const { replyId } = req.query;
  const { _id } = req.authUser;

  // * check if reply is already existing
  const reply = await Reply.findOne({ _id: replyId, addedBy: _id });
  if (!reply) {
    return next("reply not found", { cause: 404 });
  }

  // * update reply
  reply.content = content;

  // * save reply
  await reply.save();

  // * response successfully
  res.status(200).json({
    success: true,
    message: "comment updated successfully",
    data: reply,
  });
};

//============================ like and unlike reply ==============================//
/**
 * * destructure data from params and body and headers
 * * call like API
 */
export const likeReply = async (req, res, next) => {
  // * destructure data from query and body and params
  const { replyId } = req.params;
  const { onModel } = req.body;
  const { accesstoken } = req.headers;

  // * call like API
  axios({
    method: "post",
    url: `http://localhost:3000/like/addLike/${replyId}`,
    data: {
      onModel,
    },
    headers: {
      accesstoken,
    },
  })
    .then((response) => {
      res.status(200).json({ response: response.data });
    })
    .catch((err) => {
      res.status(500).json({ catch: err.data });
    });
};
