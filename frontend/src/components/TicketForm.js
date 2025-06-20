import React, { useState } from 'react';
import axios from 'axios';

function TicketForm({ onTicketAdded }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Open'
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/tickets', form);
      onTicketAdded(res.data);
      setForm({ title: '', description: '', status: 'Open' });
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '1rem 0' }}>
      <h2>Create New Ticket</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
      /><br /><br />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
      /><br /><br />
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Closed">Closed</option>
      </select><br /><br />
      <button type="submit">Submit Ticket</button>
    </form>
  );
}

export default TicketForm;
