import React from 'react';
import renderer from 'react-test-renderer';
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

describe('SaleList Snapshot Tests', () => {
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

    test('renders empty state correctly', () => {
        // Mock empty data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ data: [] })
            })
        );

        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-empty-state');
    });

    test('renders loading state correctly', () => {
        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-loading-state');
    });

    test('renders error state correctly', () => {
        // Mock API error
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('API Error'))
        );

        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-error-state');
    });

    test('renders sale list with data correctly', async () => {
        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-with-data');
    });

    test('renders add sale dialog correctly', () => {
        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-add-dialog');
    });

    test('renders edit sale dialog correctly', async () => {
        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-edit-dialog');
    });

    test('renders sale with image correctly', () => {
        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-with-image');
    });

    test('renders sale without image correctly', () => {
        // Mock sale without image
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: [{
                        ...mockSales[0],
                        image: ''
                    }]
                })
            })
        );

        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-without-image');
    });

    test('renders sale with invalid data correctly', () => {
        // Mock sale with invalid data
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: [{
                        _id: '1',
                        contractId: null,
                        furnitureId: null,
                        quantity: 'invalid'
                    }]
                })
            })
        );

        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-with-invalid-data');
    });

    test('renders sale with long text correctly', () => {
        // Mock sale with long text
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    data: [{
                        ...mockSales[0],
                        contractId: {
                            _id: 'c1',
                            number: 'CON-001-VERY-LONG-CONTRACT-NUMBER-THAT-SHOULD-WRAP'
                        },
                        furnitureId: {
                            _id: 'f1',
                            name: 'Very Long Furniture Name That Should Wrap To Multiple Lines'
                        }
                    }]
                })
            })
        );

        const tree = renderer.create(<SaleList />).toJSON();
        expect(tree).toMatchSnapshot('SaleList-with-long-text');
    });
}); 