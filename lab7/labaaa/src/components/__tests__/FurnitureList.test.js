import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FurnitureList from '../FurnitureList';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockFurniture = [
    {
        _id: '1',
        name: 'Chair',
        model: 'Model A',
        characteristics: 'Comfortable chair',
        price: 100,
        image: 'chair.jpg'
    },
    {
        _id: '2',
        name: 'Table',
        model: 'Model B',
        characteristics: 'Dining table',
        price: 200,
        image: 'table.jpg'
    }
];

describe('FurnitureList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockImplementation((url) => {
            if (url.includes('/furniture') && !url.includes('/furniture/')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockFurniture)
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    // Test 1: Initial Rendering and Data Loading
    test('renders furniture list with data and handles loading state', async () => {
        render(<FurnitureList />);

        // Check loading state (if implemented)
        // expect(screen.getByRole('progressbar')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Verify all data is displayed correctly
        expect(screen.getByRole('cell', { name: 'Model A' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Comfortable chair' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '$100' })).toBeInTheDocument();

        // Verify second item
        expect(screen.getByRole('cell', { name: 'Table' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: 'Model B' })).toBeInTheDocument();
    });

    // Test 2: Dialog Operations and Form State
    test('handles dialog operations and form state correctly', async () => {
        render(<FurnitureList />);

        // Open dialog
        const addButton = screen.getByRole('button', { name: /add furniture/i });
        await userEvent.click(addButton);

        // Verify dialog content
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        expect(screen.getByText(/add new furniture/i)).toBeInTheDocument();

        // Verify form fields
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const modelInput = screen.getByRole('textbox', { name: /model/i });
        const characteristicsInput = screen.getByRole('textbox', { name: /characteristics/i });
        const priceInput = screen.getByRole('textbox', { name: /price/i });

        expect(nameInput).toBeInTheDocument();
        expect(modelInput).toBeInTheDocument();
        expect(characteristicsInput).toBeInTheDocument();
        expect(priceInput).toBeInTheDocument();

        // Test form state changes
        await userEvent.type(nameInput, 'Test Chair');
        expect(nameInput).toHaveValue('Test Chair');

        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue('');

        // Close dialog
        const closeButton = screen.getByRole('button', { name: /cancel/i });
        await userEvent.click(closeButton);

        // Verify dialog is closed
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Test 3: Form Validation and Submission
    test('validates and submits form data correctly', async () => {
        const newFurniture = {
            name: 'New Chair',
            model: 'Model X',
            characteristics: 'Modern design',
            price: '150',
            image: 'new-chair.jpg'
        };

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(newFurniture)
            })
        );

        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), newFurniture.name);
        await userEvent.type(screen.getByRole('textbox', { name: /model/i }), newFurniture.model);
        await userEvent.type(screen.getByRole('textbox', { name: /characteristics/i }), newFurniture.characteristics);
        await userEvent.type(screen.getByRole('textbox', { name: /price/i }), newFurniture.price);

        // Submit form
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify API call
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/furniture',
            expect.objectContaining({
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFurniture)
            })
        );
    });

    // Test 4: Edit Functionality with Validation
    test('edits existing furniture with validation', async () => {
        render(<FurnitureList />);

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Click edit button
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);

        // Verify edit form is populated
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Chair');
        expect(screen.getByRole('textbox', { name: /model/i })).toHaveValue('Model A');

        // Test form validation during edit
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue('');

        // Try to submit empty form
        await userEvent.click(screen.getByRole('button', { name: /save/i }));
        expect(nameInput).toBeRequired();

        // Fill form with valid data
        const updatedData = {
            name: 'Updated Chair',
            model: 'Model Z',
            characteristics: 'Very comfortable',
            price: '120'
        };

        await userEvent.type(nameInput, updatedData.name);
        expect(nameInput).toHaveValue(updatedData.name);

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
            'http://localhost:5000/api/furniture/1',
            expect.objectContaining({
                method: 'PUT'
            })
        );
    });

    // Test 5: Delete Functionality with Error Handling
    test('handles delete operations with error cases', async () => {
        window.confirm = jest.fn(() => true);

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Test successful delete
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: 'Deleted successfully' })
            })
        );

        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        await userEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(fetch).toHaveBeenCalledWith(
            'http://localhost:5000/api/furniture/1',
            expect.objectContaining({
                method: 'DELETE'
            })
        );

        // Test delete with error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Delete failed'))
        );

        await userEvent.click(deleteButtons[0]);
        await waitFor(() => {
            expect(screen.getByText(/failed to delete furniture/i)).toBeInTheDocument();
        });
    });

    // Test 6: Comprehensive Error Handling
    test('handles various API errors appropriately', async () => {
        // Test network error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch furniture/i)).toBeInTheDocument();
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
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        await waitFor(() => {
            expect(screen.getByText(/failed to save furniture/i)).toBeInTheDocument();
        });

        // Test invalid response format
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(null)
            })
        );

        await waitFor(() => {
            expect(screen.getByText(/no furniture items found/i)).toBeInTheDocument();
        });
    });

    // Test 7: Empty State and Loading
    test('handles empty and loading states', async () => {
        // Test empty state
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByText(/no furniture items found/i)).toBeInTheDocument();
        });

        // Test loading state with delay
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture)
            }), 100))
        );

        // Trigger refresh
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });
    });

    // Test 8: Form Field Validation
    test('validates form fields properly', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Test required fields
        const requiredFields = screen.getAllByRole('textbox');
        requiredFields.forEach(field => {
            expect(field).toBeRequired();
        });

        // Test price validation
        const priceInput = screen.getByRole('textbox', { name: /price/i });
        await userEvent.type(priceInput, '-100');
        expect(priceInput).toHaveValue('-100');

        // Test form submission with invalid data
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(requiredFields[0]).toBeRequired();
    });

    // Test 9: Multiple Data Formats and Edge Cases
    test('handles different API response formats and edge cases', async () => {
        // Test with wrapped data format
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    furniture: mockFurniture
                })
            })
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Test with single object response
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture[0])
            })
        );

        // Test with malformed data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ invalid: 'data' })
            })
        );

        // Trigger refresh
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

        await waitFor(() => {
            expect(screen.getByText(/no furniture items found/i)).toBeInTheDocument();
        });
    });

    // Test 10: UI State Management
    test('maintains proper UI state during operations', async () => {
        render(<FurnitureList />);

        // Verify initial state
        expect(screen.getByRole('button', { name: /add furniture/i })).toBeEnabled();

        // Test dialog state
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        // Test form state
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        await userEvent.type(nameInput, 'Test Chair');
        expect(nameInput).toHaveValue('Test Chair');

        // Test cancel operation
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Test form reset
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');

        // Test error state
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Test error'))
        );

        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        await waitFor(() => {
            expect(screen.getByText(/failed to save furniture/i)).toBeInTheDocument();
        });
    });

    // Test 11: Component Lifecycle
    test('handles component lifecycle correctly', async () => {
        const { unmount } = render(<FurnitureList />);

        // Verify initial fetch
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/furniture');

        // Test unmounting
        unmount();

        // Verify cleanup
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Test 12: Data Refresh
    test('refreshes data after operations', async () => {
        render(<FurnitureList />);

        // Initial load
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Add new item
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'New Item');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify refresh
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/furniture');

        // Edit item
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);
        await userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Verify refresh
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/furniture');

        // Delete item
        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        await userEvent.click(deleteButtons[0]);

        // Verify refresh
        expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/furniture');
    });

    // Test 13: Form Input Handling
    test('handles form input changes correctly', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Test all form fields
        const fields = {
            name: 'Test Name',
            model: 'Test Model',
            characteristics: 'Test Characteristics',
            price: '100',
            image: 'test.jpg'
        };

        for (const [field, value] of Object.entries(fields)) {
            const input = screen.getByRole('textbox', { name: new RegExp(field, 'i') });
            await userEvent.type(input, value);
            expect(input).toHaveValue(value);
        }

        // Test clearing fields
        const nameInput = screen.getByRole('textbox', { name: /name/i });
        await userEvent.clear(nameInput);
        expect(nameInput).toHaveValue('');
    });

    // Test 14: API Response Format Handling
    test('handles various API response formats', async () => {
        // Test empty array response
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve([])
            })
        );

        render(<FurnitureList />);
        await waitFor(() => {
            expect(screen.getByText(/no furniture items found/i)).toBeInTheDocument();
        });

        // Test wrapped data format
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: mockFurniture })
            })
        );

        render(<FurnitureList />);
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Test results format
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ results: mockFurniture })
            })
        );

        render(<FurnitureList />);
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Test furniture format
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ furniture: mockFurniture })
            })
        );

        render(<FurnitureList />);
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Test single object response
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture[0])
            })
        );

        render(<FurnitureList />);
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });
    });

    // Test 15: Error Message Handling
    test('displays appropriate error messages', async () => {
        const errorCases = [
            { error: 'Network error', message: /failed to fetch furniture/i },
            { error: 'Server error', message: /failed to save furniture/i },
            { error: 'Delete error', message: /failed to delete furniture/i }
        ];

        for (const { error, message } of errorCases) {
            fetch.mockImplementationOnce(() =>
                Promise.reject(new Error(error))
            );

            render(<FurnitureList />);

            await waitFor(() => {
                expect(screen.getByText(message)).toBeInTheDocument();
            });
        }
    });

    // Test 16: Dialog Close Handling
    test('handles dialog close scenarios', async () => {
        render(<FurnitureList />);

        // Test close via cancel button
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Test close via backdrop click
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        const dialog = screen.getByRole('dialog');
        await userEvent.click(dialog);
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

        // Test close after successful submission
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Item');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Test 17: Table Rendering
    test('renders table correctly with various data', async () => {
        // Test with all fields present
        const completeData = [
            { ...mockFurniture[0], price: 0 },
            { ...mockFurniture[1], price: 999999 }
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(completeData)
            })
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Verify table headers
        expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /model/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /characteristics/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /price/i })).toBeInTheDocument();
        expect(screen.getByRole('columnheader', { name: /actions/i })).toBeInTheDocument();

        // Verify complete data
        completeData.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(item.model)).toBeInTheDocument();
            expect(screen.getByText(item.characteristics)).toBeInTheDocument();
            expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
        });

        // Test with missing optional fields
        const partialData = [
            { ...mockFurniture[0], characteristics: '' },
            { ...mockFurniture[1], model: '' }
        ];

        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(partialData)
            })
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });

        // Verify partial data
        partialData.forEach(item => {
            expect(screen.getByText(item.name)).toBeInTheDocument();
            expect(screen.getByText(`$${item.price}`)).toBeInTheDocument();
        });

        // Verify empty fields are handled
        expect(screen.getByText('')).toBeInTheDocument();
    });

    // Test 18: Form Reset
    test('resets form after operations', async () => {
        render(<FurnitureList />);

        // Test reset after cancel
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Item');
        await userEvent.click(screen.getByRole('button', { name: /cancel/i }));
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');

        // Test reset after successful submission
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Item');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
    });

    // Test 19: Error State Management
    test('manages error states correctly', async () => {
        render(<FurnitureList />);

        // Test error display
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Test error'))
        );

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch furniture/i)).toBeInTheDocument();
        });

        // Test error clearing
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture)
            })
        );

        await waitFor(() => {
            expect(screen.queryByText(/failed to fetch furniture/i)).not.toBeInTheDocument();
        });
    });

    // Test 20: Component Integration
    test('integrates all component features', async () => {
        render(<FurnitureList />);

        // Initial state
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Add new item
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'New Item');
        await userEvent.type(screen.getByRole('textbox', { name: /model/i }), 'New Model');
        await userEvent.type(screen.getByRole('textbox', { name: /characteristics/i }), 'New Characteristics');
        await userEvent.type(screen.getByRole('textbox', { name: /price/i }), '150');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Edit item
        const editButtons = screen.getAllByTestId('EditIcon');
        await userEvent.click(editButtons[0]);
        await userEvent.clear(screen.getByRole('textbox', { name: /name/i }));
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Updated Item');
        await userEvent.click(screen.getByRole('button', { name: /save/i }));

        // Delete item
        const deleteButtons = screen.getAllByTestId('DeleteIcon');
        await userEvent.click(deleteButtons[0]);

        // Verify final state
        await waitFor(() => {
            expect(screen.getByRole('table')).toBeInTheDocument();
        });
    });

    // Test 21: Image Upload Handling
    test('handles image upload correctly', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Test image input
        const imageInput = screen.getByLabelText(/image/i);
        const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
        await userEvent.upload(imageInput, file);

        expect(imageInput.files[0]).toBe(file);
        expect(imageInput.files).toHaveLength(1);
    });

    // Test 22: Price Format Validation
    test('validates price format correctly', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        const priceInput = screen.getByRole('textbox', { name: /price/i });

        // Test invalid price formats
        await userEvent.type(priceInput, 'abc');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/price must be a number/i)).toBeInTheDocument();

        // Test negative price
        await userEvent.clear(priceInput);
        await userEvent.type(priceInput, '-100');
        await userEvent.click(screen.getByRole('button', { name: /add/i }));
        expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();

        // Test valid price
        await userEvent.clear(priceInput);
        await userEvent.type(priceInput, '100.50');
        expect(priceInput).toHaveValue('100.50');
    });

    // Test 23: Error Boundary Handling
    test('handles component errors gracefully', async () => {
        // Mock console.error to prevent error output in tests
        const originalError = console.error;
        console.error = jest.fn();

        // Force an error in the component
        fetch.mockImplementationOnce(() => {
            throw new Error('Test error');
        });

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
        });

        // Restore console.error
        console.error = originalError;
    });

    // Test 24: Data Refresh on Error
    test('refreshes data after error recovery', async () => {
        // First render with error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch furniture/i)).toBeInTheDocument();
        });

        // Retry with success
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture)
            })
        );

        // Click retry button
        await userEvent.click(screen.getByRole('button', { name: /retry/i }));

        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });
    });

    // Test 25: Form Field Dependencies
    test('handles form field dependencies correctly', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        const nameInput = screen.getByRole('textbox', { name: /name/i });
        const modelInput = screen.getByRole('textbox', { name: /model/i });
        const priceInput = screen.getByRole('textbox', { name: /price/i });

        // Test field dependencies
        await userEvent.type(nameInput, 'Test Chair');
        await userEvent.type(modelInput, 'Test Model');
        await userEvent.type(priceInput, '100');

        // Clear required field
        await userEvent.clear(nameInput);
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify error message
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();

        // Verify other fields retain their values
        expect(modelInput).toHaveValue('Test Model');
        expect(priceInput).toHaveValue('100');
    });

    // Test 26: Dialog State Persistence
    test('maintains dialog state during operations', async () => {
        render(<FurnitureList />);

        // Open dialog
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Fill form partially
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Chair');

        // Simulate network error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        // Try to submit
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify dialog stays open
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('Test Chair');

        // Verify error message
        expect(screen.getByText(/failed to save furniture/i)).toBeInTheDocument();
    });

    // Test 27: Component Cleanup
    test('cleans up resources on unmount', async () => {
        const { unmount } = render(<FurnitureList />);

        // Open dialog
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Chair');

        // Unmount component
        unmount();

        // Verify no memory leaks
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Test 28: Form Reset on Error
    test('resets form on submission error', async () => {
        render(<FurnitureList />);

        // Open form
        await userEvent.click(screen.getByRole('button', { name: /add furniture/i }));

        // Fill form
        await userEvent.type(screen.getByRole('textbox', { name: /name/i }), 'Test Chair');
        await userEvent.type(screen.getByRole('textbox', { name: /model/i }), 'Test Model');

        // Simulate error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        // Submit form
        await userEvent.click(screen.getByRole('button', { name: /add/i }));

        // Verify form is reset
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /model/i })).toHaveValue('');
    });

    // Test 29: Loading State Transitions
    test('handles loading state transitions correctly', async () => {
        // Initial render with loading
        fetch.mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture)
            }), 100))
        );

        render(<FurnitureList />);

        // Verify loading state
        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        // Wait for data
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Verify loading is removed
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Test 30: Error Recovery
    test('recovers from error states correctly', async () => {
        // Initial error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Network error'))
        );

        render(<FurnitureList />);

        await waitFor(() => {
            expect(screen.getByText(/failed to fetch furniture/i)).toBeInTheDocument();
        });

        // Success on retry
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFurniture)
            })
        );

        // Click retry
        await userEvent.click(screen.getByRole('button', { name: /retry/i }));

        // Verify data is loaded
        await waitFor(() => {
            expect(screen.getByRole('cell', { name: 'Chair' })).toBeInTheDocument();
        });

        // Verify error is cleared
        expect(screen.queryByText(/failed to fetch furniture/i)).not.toBeInTheDocument();
    });
});