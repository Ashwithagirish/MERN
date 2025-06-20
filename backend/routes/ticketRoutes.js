const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.js');

// GET: Fetch all tickets (with optional search, status, and priority filters)
router.get('/tickets', async (req, res) => {
    try {
        const { search, status, priority } = req.query;
        let query = {};

        // Search by keyword in title or description
        if (search) {
            query.$or = [
                { title: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { createdBy: new RegExp(search, 'i') }
            ];
        }

        // Filter by status
        if (status && status !== 'All') {
            query.status = status;
        }

        // Filter by priority
        if (priority && priority !== 'All') {
            query.priority = priority;
        }

        const tickets = await Ticket.find(query);
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
});

// GET: Single ticket by ID
/*router.get('/tickets/:id', getTicket, (req, res) => {
    res.json(res.ticket);
});*/

// POST: Create new ticket
router.post('/tickets', async (req, res) => {
    const ticket = new Ticket({
        title: req.body.title,
        description: req.body.description,
        createdBy: req.body.createdBy,
        status: 'Open',  // default status
        priority: req.body.priority || 'Low',  // default priority
    });

    try {
        const newTicket = await ticket.save();
        res.status(201).json(newTicket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// PATCH: Update ticket fields by ID
// PATCH /tickets/:id - update ticket by ID
router.patch('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return the updated document
        );

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



// DELETE: Delete ticket by ID
router.delete('/tickets/:id', async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        await ticket.deleteOne();
        res.json({ message: 'Ticket deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Middleware: Fetch ticket by ID
/*async function getTicket(req, res, next) {
    let ticket;
    try {
        ticket = await Ticket.findById(req.params.id);
        if (ticket == null) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    res.ticket = ticket;
    next();
}*/

module.exports = router;
