import db_connection from "../DB/connection.js";
import { globalResponse } from "./middlewares/global-response.middleware.js";
import { rollbackSavedDocuments } from "./middlewares/rollback-saved-Documents.js";
import { rollbackUploadedFiles } from "./middlewares/rollback-uploaded-files.middleware.js";
import * as routers from "./modules/index.routes.js";

export const initiateApp = (app, express) => {
  const port = process.env.port;

  app.use(express.json());

  app.use("/user", routers.userRouters);
  app.use("/product", routers.productRouters);
  app.use("/comment", routers.commentRouters);
  app.use("/like", routers.likeRouters);
  app.use("/reply", routers.replyRouters);
  app.use(globalResponse, rollbackUploadedFiles, rollbackSavedDocuments);

  db_connection();
  app.listen(port, () => {
    console.log(`app listening on ${port}`);
  });
};
