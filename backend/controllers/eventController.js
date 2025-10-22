import Event from "../models/eventModel.js";

export const addEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;
    const event = await Event.create({ title, description, date, filePath });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getEvents = async (req, res) => {
  const events = await Event.find({ isDeleted: false }).sort({ date: -1 });
  res.json(events);
};

export const getDeletedEvents = async (req, res) => {
  const events = await Event.find({ isDeleted: true });
  res.json(events);
};

export const softDeleteEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { isDeleted: true });
  res.json({ message: "Event soft deleted" });
};

export const restoreEvent = async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { isDeleted: false });
  res.json({ message: "Event restored" });
};

export const deleteEvent = async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ message: "Event permanently deleted" });
};
