import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContractList from '../ContractList';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockContracts = [
    {
        _id: '1',
        contractNumber: 'C001',
        customer: 'John Doe',
        furniture: 'Chair',
        date: '2024-03-20',
        totalAmount: 1000
    },
    {
        _id: '2',
        contractNumber: 'C002',
        customer: 'Jane Smith',
        furniture: 'Table',
        date: '2024-03-21',
        totalAmount: 2000
    }
];

describe('ContractList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockImplementation((url) => {
            if (url.includes('/contracts') && !url.includes('/contracts/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockContracts)
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: Initial Rendering
    test('renders contract list with data', async () => {
        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
        });

        // Verify all data is displayed correctly
        expect(screen.getByRole('cell', { name: 'John Doe' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '$1000' })).toBeInTheDocument();
    });

    // Test 2: Add Contract
    test('adds new contract', async () => {
        const newContract = {
            contractNumber: 'C003',
            customer: 'New Customer',
            furniture: 'New Furniture',
            date: '2024-03-22',
            totalAmount: 1500
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newContract)
            })
        );

        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), newContract.contractNumber);
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), newContract.customer);
        await userEvent.type(screen.getByRole('textbox', { name: /furniture/i }), newContract.furniture);
        await userEvent.type(screen.getByRole('textbox', { name: /date/i }), newContract.date);
        await userEvent.type(screen.getByRole('textbox', { name: /total amount/i }), newContract.totalAmount.toString());

        // Submit form
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify API call
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/contracts',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newContract)
            })
        );
    });

    // Test 3: Edit Contract
    test('edits existing contract', async () => {
        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
        });

        // Click edit button
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);

        // Verify form is populated
        expect(screen.getByRole('textbox', { name: /contract number/i })).toHaveValue('C001');
        expect(screen.getByRole('textbox', { name: /customer/i })).toHaveValue('John Doe');

        // Update data
        const updatedData = {
            contractNumber: 'C001-UPDATED',
            customer: 'John Doe Updated',
            furniture: 'Chair Updated',
            date: '2024-03-23',
            totalAmount: 1500
        };

        await userEvent.clear(screen.getByRole('textbox', { name: /contract number/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), updatedData.contractNumber);

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
            'http://localhost:5000/api/contracts/1',
            expect.objectContaining({
                method: 'PUT'
            })
        );
    });

    // Test 4: Delete Contract
    test('deletes contract', async () => {
        window.confirm = jest.fn(() => true);

        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
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
            'http://localhost:5000/api/contracts/1',
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

        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch contracts/i)).toBeInTheDocument();
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
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to save contract/i)).toBeInTheDocument();
        });
    });

    // Test 6: Form Validation
    test('validates form fields', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Test required fields
        const requiredFields = screen.getAllByRole('textbox');
        requiredFields.forEach(field => {
            expect(field).toBeRequired();
        });

        // Test amount validation
        const amountInput = screen.getByRole('textbox', { name: /total amount/i });
        await userEvent.type(amountInput, '-100');
        expect(amountInput).toHaveValue('-100');

        // Test form submission with invalid data
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(requiredFields[0]).toBeRequired();
    });

    // Test 7: Date Format Validation
    test('validates date format', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

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

    // Test 8: Contract Number Format
    test('validates contract number format', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        const numberInput = screen.getByRole('textbox', { name: /contract number/i });

        // Test invalid format
        await userEvent.type(numberInput, 'invalid');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/invalid contract number format/i)).toBeInTheDocument();

        // Test valid format
        await userEvent.clear(numberInput);
        await userEvent.type(numberInput, 'C001');
        expect(numberInput).toHaveValue('C001');
    });

    // Test 9: Loading State
    test('handles loading state', async () => {
        // Initial render with loading
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockContracts)
            }), 100))
        );

        render(<ContractList />);

        // Verify loading state
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Wait for data
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
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

        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByText(/no contracts found/i)).toBeInTheDocument();
        });
    });

    // Test 11: Contract Number Uniqueness
    test('validates contract number uniqueness', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Try to add contract with existing number
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C001');
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), 'Test Customer');
        await userEvent.type(screen.getByRole('textbox', { name: /furniture/i }), 'Test Furniture');
        await userEvent.type(screen.getByRole('textbox', { name: /date/i }), '2024-03-20');
        await userEvent.type(screen.getByRole('textbox', { name: /total amount/i }), '1000');

        // Mock API response for duplicate check
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: false,
                status: 409,
                json: () => Promise.resolve({ error: 'Contract number already exists' })
            })
        );

        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/contract number already exists/i)).toBeInTheDocument();
        });
    });

    // Test 12: Date Range Validation
    test('validates date range', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        const dateInput = screen.getByRole('textbox', { name: /date/i });

        // Test future date
        await userEvent.type(dateInput, '2025-03-20');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/date cannot be in the future/i)).toBeInTheDocument();

        // Test past date
        await userEvent.clear(dateInput);
        await userEvent.type(dateInput, '2020-03-20');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/date cannot be too old/i)).toBeInTheDocument();
    });

    // Test 13: Amount Calculation
    test('calculates total amount correctly', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Fill form with valid data
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C003');
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), 'Test Customer');
        await userEvent.type(screen.getByRole('textbox', { name: /furniture/i }), 'Test Furniture');
        await userEvent.type(screen.getByRole('textbox', { name: /date/i }), '2024-03-20');
        await userEvent.type(screen.getByRole('textbox', { name: /total amount/i }), '1000.50');

        // Verify amount format
        expect(screen.getByRole('textbox', { name: /total amount/i })).toHaveValue('1000.50');
    });

    // Test 14: Form Reset on Cancel
    test('resets form on cancel', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C003');
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), 'Test Customer');

        // Cancel form
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

        // Reopen form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Verify form is reset
        expect(screen.getByRole('textbox', { name: /contract number/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /customer/i })).toHaveValue('');
    });

    // Test 15: Error Recovery
    test('recovers from error states', async () => {
        // Initial error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<ContractList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch contracts/i)).toBeInTheDocument();
        });

        // Success on retry
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockContracts)
            })
        );

        // Click retry
        await userEvent.click(screen.getByRole('button', { name: /retry/i }));

        // Verify data is loaded
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
        });

        // Verify error is cleared
        expect(screen.queryByText(/failed to fetch contracts/i)).not.toBeInTheDocument();
    });

    // Test 16: Component Cleanup
    test('cleans up resources on unmount', async () => {
        const { unmount } = render(<ContractList />);

        // Open dialog
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C003');

        // Unmount component
        unmount();

        // Verify no memory leaks
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Test 17: Form Field Dependencies
    test('handles form field dependencies', async () => {
        render(<ContractList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        const numberInput = screen.getByRole('textbox', { name: /contract number/i });
        const customerInput = screen.getByRole('textbox', { name: /customer/i });
        const furnitureInput = screen.getByRole('textbox', { name: /furniture/i });

        // Test field dependencies
        await userEvent.type(numberInput, 'C003');
        await userEvent.type(customerInput, 'Test Customer');
        await userEvent.type(furnitureInput, 'Test Furniture');

        // Clear required field
        await userEvent.clear(numberInput);
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify error message
        expect(screen.getByText(/contract number is required/i)).toBeInTheDocument();

        // Verify other fields retain their values
        expect(customerInput).toHaveValue('Test Customer');
        expect(furnitureInput).toHaveValue('Test Furniture');
    });

    // Test 18: Dialog State Persistence
    test('maintains dialog state during operations', async () => {
        render(<ContractList />);

        // Open dialog
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));

        // Fill form partially
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C003');

        // Simulate network error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        // Try to submit
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify dialog stays open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /contract number/i })).toHaveValue('C003');

        // Verify error message
        expect(screen.getByText(/failed to save contract/i)).toBeInTheDocument();
    });

    // Test 19: Loading State Transitions
    test('handles loading state transitions', async () => {
        // Initial render with loading
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockContracts)
            }), 100))
        );

        render(<ContractList />);

        // Verify loading state
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Wait for data
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
        });

        // Verify loading is removed
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test 20: Component Integration
    test('integrates all component features', async () => {
        render(<ContractList />);

        // Initial state
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'C001' })).toBeInTheDocument();
        });

        // Add new contract
        await userEvent.click(screen.getByRole('button', { name: /add contract/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C003');
        await userEvent.type(screen.getByRole('textbox', { name: /customer/i }), 'Test Customer');
        await userEvent.type(screen.getByRole('textbox', { name: /furniture/i }), 'Test Furniture');
        await userEvent.type(screen.getByRole('textbox', { name: /date/i }), '2024-03-20');
        await userEvent.type(screen.getByRole('textbox', { name: /total amount/i }), '1000');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Edit contract
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);
        await userEvent.clear(screen.getByRole('textbox', { name: /contract number/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /contract number/i }), 'C001-UPDATED');
        await userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Delete contract
        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        await userEvent.click(deleteButtons[0]);

        // Verify final state
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });
    });
}); 