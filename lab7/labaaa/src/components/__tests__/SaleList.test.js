import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SaleList from '../SaleList';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockSales = [
    {
        _id: '1',
        saleNumber: 'S001',
        customer: 'John Doe',
        furniture: 'Chair',
        date: '2024-03-20',
        quantity: 2,
        totalAmount: 2000
    },
    {
        _id: '2',
        saleNumber: 'S002',
        customer: 'Jane Smith',
        furniture: 'Table',
        date: '2024-03-21',
        quantity: 1,
        totalAmount: 1500
    }
];

describe('SaleList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockImplementation((url) => {
            if (url.includes('/sales') && !url.includes('/sales/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockSales)
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: Initial Rendering
    test('renders sale list with data', async () => {
        render(<SaleList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'S001' })).toBeInTheDocument();
        });

        // Verify all data is displayed correctly
        expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '2' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '$2000' })).toBeInTheDocument();
    });

    // Test 2: Add Sale
    test('adds new sale', async () => {
        const newSale = {
            saleNumber: 'S003',
            customer: 'New Customer',
            furniture: 'New Furniture',
            date: '2024-03-22',
            quantity: 3,
            totalAmount: 3000
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newSale)
            })
        );

        render(<SaleList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add sale/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /sale number/i }), newSale.saleNumber);
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), newSale.customer);
        await userEvent.type(screen.getByRole('textbox', { name: /furniture/i }), newSale.furniture);
        await userEvent.type(screen.getByRole('textbox', { name: /date/i }), newSale.date);
        await userEvent.type(screen.getByRole('spinbutton', { name: /quantity/i }), newSale.quantity.toString());
        await userEvent.type(screen.getByRole('textbox', { name: /total amount/i }), newSale.totalAmount.toString());

        // Submit form
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify API call
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/sales',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSale)
            })
        );
    });

    // Test 3: Edit Sale
    test('edits existing sale', async () => {
        render(<SaleList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'S001' })).toBeInTheDocument();
        });

        // Click edit button
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);

        // Verify form is populated
        expect(screen.getByRole('textbox', { name: /sale number/i })).toHaveValue('S001');
        expect(screen.getByRole('textbox', { name: /customer/i })).toHaveValue('John Doe');

        // Update data
        const updatedData = {
            saleNumber: 'S001-UPDATED',
            customer: 'John Doe Updated',
            furniture: 'Chair Updated',
            date: '2024-03-23',
            quantity: 4,
            totalAmount: 4000
        };

        await userEvent.clear(screen.getByRole('textbox', { name: /sale number/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /sale number/i }), updatedData.saleNumber);

        // Mock update API call
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(updatedData)
            })
        );

        // Submit updates
        await userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Verify API call
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/sales/1',
            expect.objectContaining({
                method: 'PUT'
            })
        );
    });

    // Test 4: Delete Sale
    test('deletes sale', async () => {
        window.confirm = jest.fn(() => true);

        render(<SaleList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'S001' })).toBeInTheDocument();
        });

        // Mock delete API call
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Deleted successfully' })
            })
        );

        // Click delete button
        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        await userEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/sales/1',
            expect.objectContaining({
                method: 'DELETE'
            })
        );
    });

    // Test 5: Error Handling
    test('handles API errors appropriately', async () => {
        // Test network error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<SaleList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch sales/i)).toBeInTheDocument();
        });

        // Test API error response
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 500,
                json: () => Promise.resolve({ error: 'Server error' })
            })
        );

        // Test form submission error
        await userEvent.click(screen.getByRole('button', { name: /add sale/i }));
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to save sale/i)).toBeInTheDocument();
        });
    });

    // Test 6: Form Validation
    test('validates form fields', async () => {
        render(<SaleList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add sale/i }));

        // Test required fields
        const requiredFields = screen.getAllByRole('textbox');
        requiredFields.forEach(field => {
            expect(field).toBeRequired();
        });

        // Test quantity validation
        const quantityInput = screen.getByRole('spinbutton', { name: /quantity/i });
        await userEvent.type(quantityInput, '-1');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/quantity must be positive/i)).toBeInTheDocument();

        // Test amount validation
        const amountInput = screen.getByRole('textbox', { name: /total amount/i });
        await userEvent.type(amountInput, '-100');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/amount must be positive/i)).toBeInTheDocument();
    });

    // Test 7: Date Format Validation
    test('validates date format', async () => {
        render(<SaleList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add sale/i }));

        const dateInput = screen.getByRole('textbox', { name: /date/i });

        // Test invalid date format
        await userEvent.type(dateInput, 'invalid-date');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/invalid date format/i)).toBeInTheDocument();

        // Test valid date
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, '2024-03-20');
        expect(dateInput).toHaveValue('2024-03-20');
    });

    // Test 8: Sale Number Format
    test('validates sale number format', async () => {
        render(<SaleList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add sale/i }));

        const numberInput = screen.getByRole('textbox', { name: /sale number/i });

        // Test invalid format
        await userEvent.type(numberInput, 'invalid');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/invalid sale number format/i)).toBeInTheDocument();

        // Test valid format
        await userEvent.clear(numberInput);
        await userEvent.type(numberInput, 'S001');
        expect(numberInput).toHaveValue('S001');
    });

    // Test 9: Loading State
    test('handles loading state', async () => {
        // Initial render with loading
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockSales)
            }), 100))
        );

        render(<SaleList />);

        // Verify loading state
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Wait for data
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'S001' })).toBeInTheDocument();
        });

        // Verify loading is removed
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test 10: Empty State
    test('handles empty state', async () => {
        // Test empty state
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        render(<SaleList />);

        // Verify empty state message
        await waitFor(() => {
            expect(screen.getByText(/no sales found/i)).toBeInTheDocument();
        });

        // Verify no data is displayed
        expect(screen.queryByRole('cell')).not.toBeInTheDocument();
    });
}); 