const noteModel = require('../models/note.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')



async function createNote(req,res){
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"You are not logged in"
        })
    }

    const decoded = await jwt.verify(token,process.env.JWT_SECRET);

    const {title, discription, urgency = "low"} = req.body

    const note = await noteModel.create({
        title,
        discription,
        urgency,
        createdBy: decoded.id
    })

    res.status(201).json({
        message: "Note created Successfully.",
        title,
        discription,
        urgency,
        createdBy: decoded.id
    })

}
async function deleteNote(req, res) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const noteId = req.params.id;
        const userId = decoded.id;

        const deletedNote = await noteModel.findOneAndDelete({
            _id: noteId,
            createdBy: userId
        });

        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: "Note not found or you are not authorized to delete it."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Note successfully deleted.",
            data: deletedNote
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal error"
        });
    }
}

async function getAllNotes(req, res){
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const userId = decoded.id;

        const allNotes = await noteModel.find({
            createdBy: userId
        });


        return res.status(200).json({
            message: "Note fetched successfully.",
            data: allNotes
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal error"
        });
    }
}

async function updateNote(req, res){
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "You are not logged in"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const noteId = req.params.id;
        const userId = decoded.id;
        const {title, discription, urgency} = req.body

        const updateNote = await noteModel.findOneAndUpdate(
            {_id: noteId, createdBy: userId},
            {title, discription, urgency}
        );

        if (!updateNote) {
            return res.status(404).json({
                message: "Note not found or you are not authorized to update it."
            });
        }

        return res.status(200).json({
            message: "Note successfully updated.",
            data: updateNote
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            message: "Internal error"
        });
    }
}


module.exports = {createNote, deleteNote, getAllNotes, updateNote}