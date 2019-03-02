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
  .route('/api')
  .get((req, res, next) => {
    Promise.all([NotefulService.getAllNotes(req.app.get('db')), NotefulService.getAllFolders(req.app.get('db'))])
      .then(([notes, folders]) => {
        res.json({notes:notes.map(sanatizeNotes), folders:folders.map(sanatizeFolders)});
      })
      .catch(next);
  });


notefulRouter
  .route('/api/note')
  .get((req, res, next) => {
    NotefulService.getAllNotes(req.app.get('db'))
      .then(note => {
        res.json(note.map(sanatizeNotes));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, content, folderid } = req.body;
    const newNote = { title, content, folderid };
    if(!title || !content || !folderid)
      return res.status(400).json({error: {message: 'please provide a title, some content, and the folder'}});
    NotefulService.insertNote(req.app.get('db'), newNote)
      .then(note => {
        res
          .status(201)
          .location(`/api/note/${note.id}`) //may need to add API
          .json(sanatizeNotes(note));
      })
      .catch(next);
  });
  

  

notefulRouter
  .route('/api/note/:note_id')
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
  .route('/api/folder/:folderId')
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
  
  .delete((req, res, next) => {
    const { folderId } = req.params;
    NotefulService.deleteFolder(req.app.get('db'), folderId)
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

notefulRouter
  .route('/api/folder/')
  .get((req, res, next) => {
    NotefulService.getAllFolders(req.app.get('db'))
      .then(folder => {
        res.json(folder.map(sanatizeFolders));
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title } = req.body;
    const newFolder = { title };
    if(!title)
      return res.status(400).json({error: {message: 'please provide folder title'}});
    NotefulService.insertFolder(req.app.get('db'), newFolder)
      .then(folder => {
        res
          .status(201)
          .location(`/api/folder/${folder.id}`) //may need to add API
          .json(sanatizeFolders(folder));
      })
      .catch(next);
  });

module.exports = notefulRouter;