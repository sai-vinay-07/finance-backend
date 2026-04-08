const Record = require('../models/financelRecords');

// create new financial record
const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body;

        const newRecord = new Record({
            amount, type, category, date, notes,
            user: req.user._id,
            isDeleted: false,
            createdAt: Date.now()
        });

        await newRecord.save();

        res.status(201).json({ message: 'Record created successfully' });
    } catch (error) {
        console.error('Create record error:', error);
        res.status(500).json({ message: 'Server error creating record' });
    }
};

// get records with optional filters and pagination
const getRecords = async (req, res) => {
    try {
        const { startDate, endDate, category, type, page = 1, limit = 10 } = req.query;

        if (startDate && isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({ message: 'Invalid startDate' });
        }
        if (endDate && isNaN(new Date(endDate).getTime())) {
            return res.status(400).json({ message: 'Invalid endDate' });
        }

        // build query for user's active records
        let query = { user: req.user._id, isDeleted: false };

        // add date range filter
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (category) query.category = category;
        if (type) query.type = type;

        const pageNum = Math.max(1, parseInt(page));
        const pageSize = parseInt(limit) || 10;
        const skip = (pageNum - 1) * pageSize;

        const total = await Record.countDocuments(query);
        const records = await Record.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(pageSize);

        res.status(200).json({
            data: records,
            total, page: pageNum,
            totalPages: Math.ceil(total / pageSize)
        });
    } catch (error) {
        console.error('Get records error:', error);
        res.status(500).json({ message: 'Server error getting records' });
    }
};

// update record if user owns it or admin
const updateRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const record = await Record.findById(id);

        if (!record) return res.status(404).json({ message: 'Record not found' });
        if (record.isDeleted) return res.status(400).json({ message: 'Record deleted already' });

        // admin or owner only
        if (record.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // update provided fields
        Object.keys(updates).forEach(key => {
            record[key] = updates[key];
        });

        await record.save();
        res.status(200).json({ message: 'Record updated' });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ message: 'Server error updating' });
    }
};

// soft delete - set flag only
const deleteRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await Record.findById(id);

        if (!record) return res.status(404).json({ message: 'Not found' });
        if (record.isDeleted) return res.status(400).json({ message: 'Already deleted' });

        // admin or owner
        if (record.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        record.isDeleted = true;
        await record.save();

        res.status(200).json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Server error deleting' });
    }
};

module.exports = { createRecord, getRecords, updateRecord, deleteRecord };

