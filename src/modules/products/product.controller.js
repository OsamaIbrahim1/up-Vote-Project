import axios from "axios";
import Comment from "../../../DB/models/comment.model.js";
import Product from "../../../DB/models/product.model.js";
import User from "../../../DB/models/user.models.js";
import Likes from "../../../DB/models/like.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generate-Unique-String.js";

//========================= add product =======================//
/**
 * * destructure data from body and authUser
 * * find user
 * * check Images
 * * upload image
 * * create new product
 * * response successfully
 */
export const addProduct = async (req, res, next) => {
  // * destructure data from body and authUser
  const { title, caption } = req.body;
  const { _id } = req.authUser;

  // * find user
  const user = await User.findById(_id);
  if (!user) return next(`user not found`, { cause: 404 });

  // * check Images
  if (!req.files?.length) {
    return next("please upload one image at least", { cause: 400 });
  }

  // * upload image
  let Images = [];
  let publicIdsArr = [];
  const oldFolder = user.Image.public_id;
  const newfolder = oldFolder.split(`${user.folderId}/`)[0];
  const folderId = generateUniqueString(5);
  for (const file of req.files) {
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: `${newfolder}/${user.folderId}/Products/${folderId}`,
      });
    publicIdsArr.push(public_id);
    Images.push({ secure_url, public_id, folderId });
  }
  req.folder = `${newfolder}/${user.folderId}/Products/${folderId}`;

  // * create new product
  const productObj = {
    title,
    caption,
    Images,
    addedBy: _id,
  };
  const newProduct = await Product.create(productObj);
  req.savedDocuments = { model: Product, _id: newProduct._id };

  // * response successfully
  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: newProduct,
  });
};

//========================= update product =======================//
/**
 * * destructure data from body and authUser and query
 * * ckeck if product exists already
 * * update title and caption
 * * update image
 * * save changes
 * * response successfully
 */
export const updateProduct = async (req, res, next) => {
  // * destructure data from body and authUser and query
  const { title, caption, oldPublicId } = req.body;
  const { _id } = req.authUser;
  const { productId } = req.query;

  // * ckeck if product exists already
  const product = await Product.findOne({ addedBy: _id, _id: productId });
  if (!product) {
    return next("product not found", { cause: 404 });
  }

  // * update title and caption
  if (title) product.title = title;
  if (caption) product.caption = caption;

  // * update image
  if (oldPublicId) {
    if (!req.file) {
      return next("upload one image please", { cause: 400 });
    }

    const folderPath = product.Images[0].public_id.split(
      `${product.Images[0].folderId}/`
    )[0];
    const newPublicId = oldPublicId.split(`${product.Images[0].folderId}/`)[1];
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(req.file.path, {
        folder: folderPath + `${product.Images[0].folderId}`,
        public_id: newPublicId,
      });
    product.Images.map((image) => {
      if (image.public_id === oldPublicId) {
        image.public_id = public_id;
        image.secure_url = secure_url;
      }
    });
  }

  // * save changes
  await product.save();

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "updated successfully", data: product });
};

//========================= delete product =======================//
/**
 * * destructure data from authUser query
 * * find product
 * * delete images
 * * delete product from database
 * * response successfully
 */
export const deleteProduct = async (req, res, next) => {
  // * destructure data from authUser query
  const { _id } = req.authUser;
  const { productId } = req.query;

  // * find product
  const product = await Product.findOne({ _id: productId, addedBy: _id });
  if (!product) {
    return next("Product not found", { cause: 404 });
  }

  // * delete images
  const publicId = product.Images[0].public_id.split(
    `${product.Images[0].folderId}/`
  )[0];
  await cloudinaryConnection().api.delete_resources_by_prefix(
    `${publicId}${product.Images[0].folderId}`
  );
  await cloudinaryConnection().api.delete_folder(
    `${publicId}${product.Images[0].folderId}`
  );

  // * delete product from database
  const productDeleted = await Product.findByIdAndDelete({ _id: productId });
  if (!productDeleted) {
    return next("delete product failed.", { cause: 400 });
  }

  // * delete product's comments
  await Comment.deleteMany({ productId });

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "Product deleted successfully" });
};

//========================= like and unlike products =======================//
/**
 * * destructure data from body and query and headers
 * * Call like API
 */
export const likeProduct = async (req, res, next) => {
  // * destructure data from body and query and headers
  const { productId } = req.query;
  const { onModel } = req.body;
  const { accesstoken } = req.headers;

  // * Call like API
  axios({
    method: "post",
    url: `http://localhost:3000/like/addlike/${productId}`,
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

//========================= get all products =======================//
/**
 * * get all products
 * * get all products with there comments
 * * response successfully
 */
export const getAllProducts = async (req, res, next) => {
  // * get all products
  const products = Product.find().cursor();

  // * get all products with there comments
  let finalResult = [];
  for (
    let doc = await products.next();
    doc != null;
    doc = await products.next()
  ) {
    const comments = await Comment.find({ productId: doc._id });
    const docObject = doc.toObject();
    docObject.comments = comments;
    finalResult.push(docObject);
  }

  // * response successfully
  res.status(200).json({ message: "done", products: finalResult });
};

//============================= get all likes for product =====================//
/**
 * * destructure data from query
 * * get all likes for product
 * * response successfully
 */
export const getAllLikesForProduct = async (req, res, next) => {
  // * destructure data from query
  const { productId } = req.query;

  // * get all likes for product
  const likes = await Likes.find({ likeDoneOnId: productId })
    .populate([
      {
        path: "likeDoneOnId",
      },
    ])
    .select("likedBy likeDoneOnId onModel -_id");

  // * response successfully
  res
    .status(200)
    .json({ sucess: true, message: "get all like for products", data: likes });
};

//============================= get product and all comments and all replies  =====================//
/**
 * * destructure data from query
 * * get product and comments and reply
 * * response successfully
 */
export const getProduct = async (req, res, next) => {
  // * destructure data from query
  const { productId } = req.query;

  // * get product and comments and reply
  const product = await Product.find().populate([
    {
      path: "comments",
      populate: [{ path: "replies", populate: [{ path: "replies" }] }],
    },
  ]);

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "found product", data: product });
};