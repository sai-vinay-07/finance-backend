const express = require('express');
const Record = require('../models/financelRecords');

const createRecord = async(req,res) => {
try {
      const { amount, type, category, date, notes } = req.body;

        const newRecord = new Record({  
            amount,
            type,
            category,
            date,
            notes,
            user: req.user._id,
            isDeleted: false,
            createdAt: Date.now()
         })

         await newRecord.save();

         return res.status(201).json({ message: 'Record created successfully' });

} catch (error) {
    
    console.error('Error creating record:', error);

    return res.status(500).json({ message: 'Internal server error' });

}
}

const getRecords = async(req,res) => {
    try {
        const { startDate, endDate, category, type, page = 1, limit = 10 } = req.query;

        // Validate dates
        if (startDate && isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({ message: 'Invalid startDate format' });
        }
        if (endDate && isNaN(new Date(endDate).getTime())) {
            return res.status(400).json({ message: 'Invalid endDate format' });
        }

        let query = { user: req.user._id, isDeleted: false };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }
        if (category) query.category = category;
        if (type) query.type = type;

        const pageNumber = Math.max(1, parseInt(page, 10) || 1);
        const pageSize = parseInt(limit, 10) || 10;
        const skip = (pageNumber - 1) * pageSize;

        const total = await Record.countDocuments(query);
        const records = await Record.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(pageSize);

        return res.status(200).json({
            data: records,
            total,
            page: pageNumber,
            totalPages: Math.ceil(total / pageSize)
        });

    } catch (error) {
        
        console.error('Error fetching records:', error);

        return res.status(500).json({ message: 'Internal server error' });

    }
}

const updateRecord = async(req,res) => {    

    const { id } = req.params;

    const { amount, type, category, date, notes } = req.body;

    try {
        const record = await Record.findById(id);

        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (record.isDeleted) {
            return res.status(400).json({ message: 'Record is already deleted' });
        }

        if (record.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }           

        record.amount = amount !== undefined ? amount : record.amount;
        record.type = type !== undefined ? type : record.type;
        record.category = category !== undefined ? category : record.category;
        record.date = date !== undefined ? date : record.date;
        record.notes = notes !== undefined ? notes : record.notes;

        await record.save();

        return res.status(200).json({ message: 'Record updated successfully' });

    } catch (error) {
        
        console.error('Error updating record:', error);

        return res.status(500).json({ message: 'Internal server error' });

    }

}

const deleteRecord = async(req,res) => {

    const { id } = req.params;

    try {
        const record = await Record.findById(id);
        
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        if (record.isDeleted) {
            return res.status(400).json({ message: 'Record is already deleted' });
        }

        if (record.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        record.isDeleted = true;
        await record.save();

        return res.status(200).json({ message: 'Record deleted successfully' });

    } catch (error) {
        
        console.error('Error deleting record:', error);

        return res.status(500).json({ message: 'Internal server error' });

    }

}

module.exports = { createRecord, getRecords, updateRecord, deleteRecord }