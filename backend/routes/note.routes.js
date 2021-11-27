const express = require("express");
const Note = require("../models/note.model");

const router = new express.Router();

// Create a new note
router.post("/notes", async (req, res) => {
    const note = new Note(req.body);
    try {
        await note.save();
        res.send({data: note, success: true});
    } catch (error) {
        console.log(error)
        res.status(400).send({error});
    }
})

// Fetch notes by id
router.get("/notes/:userType/:id", async(req, res) => {
    const user_id = req.params.id;
    const user_type = req.params.userType;

    try {
        const notes = await Note.find({ user_id, user_type});
        if(!notes)
            return res.status(404).send({success: false, data: "No notes found"});
        
        res.send({success: true, data: notes});
    } catch(error) {
        res.status(500).send({success: false, error});
    }
})

// Delete note
router.delete("/notes/:id", async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id)
        if (!note) {
        return res.status(404).send({success: false})
        }
        res.send({success: true, note})
       } catch (e) {
        res.status(500).send()
       }
})

module.exports = router