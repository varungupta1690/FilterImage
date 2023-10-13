import express from 'express';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import bodyParser from 'body-parser';

(async () => {

  // Begin the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // regex to verify image_url format
  const image_url_regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpeg|jpg|gif|png|svg)/

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // middleware checking url and returing message to try filteredimage url
  app.use(function (req, res, next) {
    if (req.path != '/filteredimage') {
      res.send("try GET /filteredimage?image_url={{}}")
    }
    next()
  })

  app.get("/filteredimage", async (req, res) => {
    //
    let { image_url } = req.query;
    
    // return error if parameter is missing
    if (!image_url) {
      res.status(400).send("image url missing")
    }else {

      // return error if image url format is incorrect
      console.log(image_url.match(image_url_regex))
      if (!image_url.match(image_url_regex)) {
        res.status(400).send("image url format is incorrect, example url : https://some_domain(like google.com)/probably_some_more_paths/image_name.png/jpg/gif")
      }else {
        
        try {
          let image_response = await filterImageFromURL(image_url)
          // if image reader does not fail return image else return error
          if(image_response != "no image found"){
            res.status(200).sendFile(image_response, async callback=>{
              await deleteLocalFiles([image_response])
            })
          } else {
            res.status(200).send("no image found in the given url")
          }
        } catch (err) {
          // other errors
          console.error(err)
          res.status(200).send("image processing failed")
        }
      }
    }

    //
  } );
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  
  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();