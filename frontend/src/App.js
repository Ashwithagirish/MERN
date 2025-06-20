import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [tickets, setTickets] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        createdBy: '',
        search: '',
        priority: 'Low',
    });
    const [filter, setFilter] = useState({
        status: 'All',
        priority: 'All',
    });

    const fetchTickets = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/tickets', formData);
            setTickets([...tickets, response.data]);
            setFormData({
                title: '',
                description: '',
                createdBy: '',
                search: '',
                priority: 'Low',
            });
        } catch (error) {
            console.error('Error creating ticket:', error);
        }
    };

    const handleSearch = (query) => {
        const search = query.toLowerCase().trim();

        if (!search) {
            fetchTickets();
            return;
        }

        const result = tickets.filter(ticket =>
            ticket.title.toLowerCase().includes(search) ||
            ticket.description.toLowerCase().includes(search) ||
            ticket.createdBy.toLowerCase().includes(search)
        );

        setTickets(result);
    };

    const handleDelete = async (ticketId) => {
        try {
            await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`);
            setTickets(tickets.filter((ticket) => ticket._id !== ticketId));
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const handlePriorityChange = async (ticketId, newPriority) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/tickets/${ticketId}`, {
                priority: newPriority,
            });
            const updated = response.data;
            setTickets((prev) =>
                prev.map((ticket) =>
                    ticket._id === ticketId ? { ...ticket, priority: updated.priority } : ticket
                )
            );
        } catch (error) {
            console.error('Error updating priority:', error);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        try {
            const response = await axios.patch(`http://localhost:5000/api/tickets/${ticketId}`, {
                status: newStatus,
            });
            const updated = response.data;
            setTickets((prev) =>
                prev.map((ticket) =>
                    ticket._id === ticketId ? { ...ticket, status: updated.status } : ticket
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const filteredTickets = tickets.filter((ticket) => {
        const statusMatch = filter.status === 'All' || ticket.status === filter.status;
        const priorityMatch = filter.priority === 'All' || ticket.priority === filter.priority;
        return statusMatch && priorityMatch;
    });

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Low': return '#aafaae';
            case 'Medium': return '#fcee68';
            case 'High': return '#fc8181';
            default: return '#fff';
        }
    };

    return (
        <div className="App">
            <h1>Ticket Raising Platform</h1>

            <form onSubmit={handleSubmit}>
                <label>Title:
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                </label>
                <label>Description:
                    <textarea name="description" value={formData.description} onChange={handleInputChange} />
                </label>
                <label>Created By:
                    <input type="text" name="createdBy" value={formData.createdBy} onChange={handleInputChange} />
                </label>
                <label>Priority:
                    <select name="priority" value={formData.priority} onChange={handleInputChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>

            <h2>FILTERS AND SEARCH</h2>
            <label>Status:
                <select name="status" value={filter.status} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                </select>
            </label>

            <label>Priority:
                <select name="priority" value={filter.priority} onChange={handleFilterChange}>
                    <option value="All">All</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
            </label>

            <label>Search:
                <input
                    type="text"
                    name="search"
                    value={formData.search}
                    onChange={(e) => {
                        setFormData({ ...formData, search: e.target.value });
                        handleSearch(e.target.value);
                    }}
                />
            </label>

            <h2>Tickets</h2>
            <div className="card-container">
                {filteredTickets.map((ticket) => (
                    <div
                        key={ticket._id}
                        className="card"
                        style={{ backgroundColor: getPriorityColor(ticket.priority) }}
                    >
                        <div className="card-content">
                            <strong>{ticket.title}</strong><br />
                            {ticket.description}<br />
                            (Created by: {ticket.createdBy})
                        </div>

                        <div className="card-actions">
                            <span>Priority: {ticket.priority}</span><br /><br />
                            <label>Update Priority:
                                <select
                                    value={ticket.priority}
                                    onChange={(e) =>
                                        handlePriorityChange(ticket._id, e.target.value)
                                    }
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </label>
                            <label>Update Status:
                                <select
                                    value={ticket.status}
                                    onChange={(e) =>
                                        handleStatusChange(ticket._id, e.target.value)
                                    }
                                >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                            </label>
                            <button onClick={() => handleDelete(ticket._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
