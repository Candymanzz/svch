import React from 'react';
import { Button } from '@mui/material';

const ExportData = () => {
    const handleExport = () => {
        const items = JSON.parse(localStorage.getItem('items') || '[]');
        const dataStr = JSON.stringify(items, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'items.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ mt: 2 }}
        >
            Экспортировать данные в файл
        </Button>
    );
};

export default ExportData; 