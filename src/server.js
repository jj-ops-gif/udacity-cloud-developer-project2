import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, isImage} from './util/util.js';
import { unlink } from 'node:fs';

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  app.get( "/filteredimage", (req, res) => {
    const image_url = req.query.image_url;
    if (isImage(image_url)) {
      filterImageFromURL(image_url).then(path_result => {
        res.sendFile(path_result, function (err) {
          if (err) {
            console.log(err);
            res.status(500).json({status: 500, message: "Cannot send file."})
          }
          deleteLocalFiles([path_result]);
        });
      }).catch((error) => {
        console.error("An error occurred:", error);
        res.status(422).json({status: 422, message: "Cannot process the image."})
      });
    } else {
      res.status(400).json({status: 400, message: "Not a valid image URL."})
    }
});

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
