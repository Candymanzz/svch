import React from 'react';

const DownloadButtons = ({ downloadReservations }) => {
    return (
        <div className="download-buttons">
            <button onClick={() => downloadReservations('application/json')}>
                Download JSON
            </button>
            <button onClick={() => downloadReservations('application/xml')}>
                Download XML
            </button>
            <button onClick={() => downloadReservations('text/html')}>
                Download HTML
            </button>
        </div>
    );
};

export default DownloadButtons; 