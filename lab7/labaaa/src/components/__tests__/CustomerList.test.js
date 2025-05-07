import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CustomerList from '../CustomerList';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockCustomers = [
    {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        address: '123 Main St'
    },
    {
        _id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '098-765-4321',
        address: '456 Oak St'
    }
];

describe('CustomerList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockImplementation((url) => {
            if (url.includes('/customers') && !url.includes('/customers/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockCustomers)
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: Initial Rendering
    test('renders customer list with data', async () => {
        render(<CustomerList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
        });

        // Verify all data is displayed correctly
        expect(screen.getByRole('cell', { name: 'john@example.com' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '123-456-7890' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '123 Main St' })).toBeInTheDocument();
    });

    // Test 2: Add Customer
    test('adds new customer', async () => {
        const newCustomer = {
            name: 'New Customer',
            email: 'new@example.com',
            phone: '555-555-5555',
            address: '789 Pine St'
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newCustomer)
            })
        );

        render(<CustomerList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), newCustomer.name);
        await userEvent.type(screen.getByRole('textbox', { name: /email/i }), newCustomer.email);
        await userEvent.type(screen.getByRole('textbox', { name: /phone/i }), newCustomer.phone);
        await userEvent.type(screen.getByRole('textbox', { name: /address/i }), newCustomer.address);

        // Submit form
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify API call
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/customers',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCustomer)
            })
        );
    });

    // Test 3: Edit Customer
    test('edits existing customer', async () => {
        render(<CustomerList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
        });

        // Click edit button
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);

        // Verify form is populated
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('John Doe');
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('john@example.com');

        // Update data
        const updatedData = {
            name: 'John Doe Updated',
            email: 'john.updated@example.com',
            phone: '111-222-3333',
            address: 'Updated Address'
        };

        await userEvent.clear(screen.getByRole('textbox', { name: /name/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), updatedData.name);

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
            'http://localhost:5000/api/customers/1',
            expect.objectContaining({
                method: 'PUT'
            })
        );
    });

    // Test 4: Delete Customer
    test('deletes customer', async () => {
        window.confirm = jest.fn(() => true);

        render(<CustomerList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
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
            'http://localhost:5000/api/customers/1',
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

        render(<CustomerList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch customers/i)).toBeInTheDocument();
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
        await userEvent.click(screen.getByRole('button', { name: /add customer/i }));
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to save customer/i)).toBeInTheDocument();
        });
    });

    // Test 6: Form Validation
    test('validates form fields', async () => {
        render(<CustomerList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

        // Test required fields
        const requiredFields = screen.getAllByRole('textbox');
        requiredFields.forEach(field => {
            expect(field).toBeRequired();
        });

        // Test email validation
        const emailInput = screen.getByRole('textbox', { name: /email/i });
        await userEvent.type(emailInput, 'invalid-email');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();

        // Test phone validation
        const phoneInput = screen.getByRole('textbox', { name: /phone/i });
        await userEvent.type(phoneInput, 'invalid-phone');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/invalid phone format/i)).toBeInTheDocument();
    });

    // Test 7: Email Format Validation
    test('validates email format', async () => {
        render(<CustomerList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

        const emailInput = screen.getByRole('textbox', { name: /email/i });

        // Test invalid email formats
        const invalidEmails = ['test', 'test@', 'test@test', '@test.com'];
        for (const email of invalidEmails) {
            await userEvent.clear(emailInput);
            await userEvent.type(emailInput, email);
            await userEvent.click(screen.getByRole('button', { name: /add/i }));
            expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        }

        // Test valid email
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'test@example.com');
        expect(emailInput).toHaveValue('test@example.com');
    });

    // Test 8: Phone Format Validation
    test('validates phone format', async () => {
        render(<CustomerList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add customer/i }));

        const phoneInput = screen.getByRole('textbox', { name: /phone/i });

        // Test invalid phone formats
        const invalidPhones = ['123', '123-456', '123-456-789', 'abc-def-ghij'];
        for (const phone of invalidPhones) {
            await userEvent.clear(phoneInput);
            await userEvent.type(phoneInput, phone);
            await userEvent.click(screen.getByRole('button', { name: /add/i }));
            expect(screen.getByText(/invalid phone format/i)).toBeInTheDocument();
        }

        // Test valid phone
        await userEvent.clear(phoneInput);
        await userEvent.type(phoneInput, '123-456-7890');
        expect(phoneInput).toHaveValue('123-456-7890');
    });

    // Test 9: Loading State
    test('handles loading state', async () => {
        // Initial render with loading
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockCustomers)
            }), 100))
        );

        render(<CustomerList />);

        // Verify loading state
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Wait for data
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
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

        render(<CustomerList />);

        await waitFor(() => {
            expect(screen.getByText(/no customers found/i)).toBeInTheDocument();
        });
    });
}); 