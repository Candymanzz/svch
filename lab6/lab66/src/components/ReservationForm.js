import React from 'react';

const ReservationForm = ({ tables, formData, handleInputChange, handleSubmit }) => {
    const handleTableChange = (e) => {
        const value = parseInt(e.target.value);
        handleInputChange({
            target: {
                name: 'tableId',
                value: value
            }
        });
    };

    return (
        <section className="reservation-form">
            <h2>Make a Reservation</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Table:</label>
                    <select
                        name="tableId"
                        value={formData.tableId}
                        onChange={handleTableChange}
                        required
                    >
                        <option value="">Select a table</option>
                        {tables.map(table => (
                            <option key={table.id} value={table.id}>
                                Table {table.id} (Capacity: {table.capacity})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Time:</label>
                    <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Make Reservation</button>
            </form>
        </section>
    );
};

export default ReservationForm; 