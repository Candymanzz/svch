import React from 'react';

const ReservationsList = ({ reservations, handleDelete }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Table</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {reservations.map(reservation => (
                    <tr key={reservation.id}>
                        <td>Table {reservation.tableId}</td>
                        <td>{reservation.date}</td>
                        <td>{reservation.time}</td>
                        <td>{reservation.name}</td>
                        <td>{reservation.phone}</td>
                        <td>
                            <button onClick={() => handleDelete(reservation.id)}>
                                Cancel
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ReservationsList; 