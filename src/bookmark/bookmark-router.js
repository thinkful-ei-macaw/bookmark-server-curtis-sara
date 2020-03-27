const express = require('express')
const uuid =  require('uuid/v4')
const logger = require('../logger')
const bookmarks = require('../store')

const bookmarkRouter = express.Router()
const parser = express.json()
// GET /bookmarks that returns a list of bookmarks

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
      res.json(bookmarks)
  })
// POST /bookmarks that accepts a JSON object representing a bookmark and adds it to the list of bookmarks after validation
  .post(parser, (req, res) => {
      const {title, url, description, rating} = req.body

      if (!title) {
          logger.error(`Title is required`);
          return res
              .status(400)
              .send('Invalid data');
          }

          if (!url) {
          logger.error(`URL is required`);
          return res
              .status(400)
              .send('Invalid data');
          }

          const id = uuid();

          const bookmark = {
          id,
          title,
          url,
          description, 
          rating
          };

          bookmarks.push(bookmark);

          logger.info('Bookmark with id ${id} created.')

          res
          .status(201)
          .location(`http://localhost:8000/bookmark/${id}`)
          .json(bookmark);
  })







// GET /bookmarks/:id that returns a single bookmark with the given ID, return 404 Not Found if the ID is not valid

bookmarkRouter
  .route('/bookmark/:id')
  .get((req, res) => {
    
    const { id } = req.params

    const bookmark = bookmarks.find(item => {
      item.id == id
    })

    if (!bookmark) {
      logger.error(`Bookmark with id ${id} not found`)
      return res
        .status(404)
        .send('Bookmark not found')
    }

    res.json(bookmark)

  })
// DELETE /bookmarks/:id that deletes the bookmark with the given ID.
  .delete((req, res) => {
    const { id } = req.params

    const bookmarkIndex = bookmarks.findIndex(
      item => item.id == id)

    if(bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} not found`)
      return res
        .status(404)
        .send('Bookmark not found')
    }

    bookmarks.splice(bookmarkIndex, 1)
    
    logger.info(`Bookmark with id ${id} deleted`)

    res 
      .status(204)
      .end()
  })