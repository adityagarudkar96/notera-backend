const express = require('express')
const noteController = require('../controllers/note.controller')


const router = express.Router();

router.post('/create', noteController.createNote)
router.delete('/delete/:id', noteController.deleteNote)
router.get('/', noteController.getAllNotes)
router.patch('/update/:id', noteController.updateNote)



module.exports = router;