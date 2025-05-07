import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import SaleList from '../SaleList';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockSales = [
    {
        _id: '1',
        contractId: { _id: 'c1', number: 'CON-001' },
        furnitureId: { _id: 'f1', name: 'Chair' },
        quantity: 2,
        image: 'test-image.jpg'
    }
];

const mockContracts = [
    { _id: 'c1', number: 'CON-001' },
    { _id: 'c2', number: 'CON-002' }
];

const mockFurniture = [
    { _id: 'f1', name: 'Chair' },
    { _id: 'f2', name: 'Table' }
];

describe('SaleList Style Tests', () => {
    const theme = createTheme();

    beforeEach(() => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        // Mock successful API responses
        fetch.mockImplementation((url) => {
            if (url.includes('/sales')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockSales })
                });
            }
            if (url.includes('/contracts')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockContracts)
                });
            }
            if (url.includes('/furniture')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockFurniture)
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    test('table has correct styles', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const table = screen.getByRole('table');
        expect(table).toHaveStyle({
            width: '100%'
        });
    });

    test('table cells have correct padding', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const cells = screen.getAllByRole('cell');
        cells.forEach(cell => {
            expect(cell).toHaveStyle({
                padding: expect.any(String)
            });
        });
    });

    test('image has correct dimensions', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const image = screen.getByRole('img');
        expect(image).toHaveStyle({
            width: '50px',
            height: '50px',
            objectFit: 'cover'
        });
    });

    test('add button has correct styles', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const addButton = screen.getByRole('button', { name: /add sale/i });
        expect(addButton).toHaveStyle({
            backgroundColor: expect.any(String)
        });
    });

    test('dialog has correct max width', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const dialog = screen.getByRole('dialog');
        expect(dialog).toHaveStyle({
            maxWidth: 'sm'
        });
    });

    test('form fields have correct margin', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const formFields = screen.getAllByRole('textbox');
        formFields.forEach(field => {
            expect(field).toHaveStyle({
                marginTop: expect.any(String),
                marginBottom: expect.any(String)
            });
        });
    });

    test('error alert has correct margin', () => {
        // Mock API error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('API Error'))
        );

        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const alert = screen.getByRole('alert');
        expect(alert).toHaveStyle({
            marginBottom: '16px'
        });
    });

    test('action buttons have correct spacing', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const actionButtons = screen.getAllByRole('button', { name: /edit|delete/i });
        actionButtons.forEach(button => {
            expect(button).toHaveStyle({
                padding: expect.any(String)
            });
        });
    });

    test('table header has correct background color', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const header = screen.getByRole('rowgroup');
        expect(header).toHaveStyle({
            backgroundColor: expect.any(String)
        });
    });

    test('table row has correct hover effect', () => {
        render(
            <ThemeProvider theme={theme}>
                <SaleList />
            </ThemeProvider>
        );

        const row = screen.getByRole('row');
        expect(row).toHaveStyle({
            '&:hover': {
                backgroundColor: expect.any(String)
            }
        });
    });
}); 