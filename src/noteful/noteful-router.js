'use strict';

const express = require('express');
const xss = require('xss');
const NotefulService = require('./noteful-service');
const notefulRouter = express.Router();
const bodyParser = express.json();

const sanatizeNotes = notes => ({
  id: notes.id,
  title: xss(notes.title),
  modified: notes.modified,
  content: xss(notes.content)
});

const sanatizeFolders = folders => ({
  id: folders.id,
  title: xss(folders.title),
  folderId: folders.folderId
});

notefulRouter
  .route('/api/noteful')
  .get((req, res, next) => {
    Promise.all([NotefulService.getAllNotes(req.app.get('db')), NotefulService.getAllFolders(req.app.get('db'))])
      .then(([notes, folders]) => {
        res.json({notes:notes.map(sanatizeNotes), folders:folders.map(sanatizeFolders)});
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title', 'content', 'folderId']) {
      if (!req.body[field]) {
        return res.status(400).send(`${field} is required`);
      }
    }
    const {
      title,
      content,
      folderId
    } = req.body;
    const newNote = {
      title,
      content,
      folderId
    };
    NotefulService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          // .location(`/api/noteful/note/${note.id}`) //may need to add API
          .json(sanatizeNotes(note));
      })
      .catch(next);
  });

  

notefulRouter
  .route('/api/noteful/note/:note_id')
  .get((req, res, next) => {
    const {note_id} = req.params;
    NotefulService.getNoteById(req.app.get('db'), note_id)
      .then(note => {
        if(!note) {
          return res.status(404).json({
            error: { message : 'Note not found'}
          });
        }
        res.status(200).json(note);
        console.log(note);
        next();
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const {note_id} = req.params;
    NotefulService.deleteNote(req.app.get('db'), note_id)
      .then(note => {
        if(!note) {
          return res.status(404).json({
            error: { message: 'Note not found'}
          });
        }
        res.status(204).end();
        next();
      })
      .catch(next);
  });
  

notefulRouter
  .route('/api/noteful/folder/:folderId')
  .get((req, res, next) => {
    const {folderId} = req.params;
    NotefulService.getFolderById(req.app.get('db'), folderId)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: {
              message: 'Folder not found'
            }
          });
        }
        res.status(200).json(folder);
        next();
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    for (const field of ['title']) {
      if (!req.body[field]) {
        return res.status(400).send(`${field} is required`);
      }
    }
    const { title } = req.body;
    const newFolder = { title };
    NotefulService.insertFolder(req.app.get('db'), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(`/api/noteful/folder/${folder.id}`) //may need to add API
          .json(sanatizeFolders(folder));
      })
      .catch(next);
  })
  .delete((req, res, next) => {
    const { folderId } = req.params;
    NotefulService.deleteNote(req.app.get('db'), folderId)
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: {
              message: 'Folder not found'
            }
          });
        }
        res.status(204).end();
        next();
      })
      .catch(next);
  });
module.exports = notefulRouter;