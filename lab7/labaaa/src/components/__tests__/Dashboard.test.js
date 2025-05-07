import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from '../Dashboard';

// Mock fetch
global.fetch = jest.fn();

// Mock data
const mockStats = {
    totalCustomers: 10,
    totalFurniture: 50,
    totalContracts: 25,
    totalSales: 100
};

const mockRecentSales = [
    {
        _id: '1',
        date: '2024-03-20',
        contractId: { number: 'CON-001' },
        furnitureId: { name: 'Chair' },
        quantity: 2,
        totalAmount: 200
    }
];

describe('Dashboard Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        fetch.mockImplementation((url) => {
            if (url.includes('/stats')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockStats)
                });
            }
            if (url.includes('/sales/recent')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: mockRecentSales })
                });
            }
            return Promise.reject(new Error('Not found'));
        });
    });

    // Тест 1: Проверка рендеринга статистики
    test('renders statistics correctly', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('10')).toBeInTheDocument(); // Total Customers
        });

        await waitFor(() => {
            expect(screen.getByText('50')).toBeInTheDocument(); // Total Furniture
        });

        await waitFor(() => {
            expect(screen.getByText('25')).toBeInTheDocument(); // Total Contracts
        });

        await waitFor(() => {
            expect(screen.getByText('100')).toBeInTheDocument(); // Total Sales
        });
    });

    // Тест 2: Проверка отображения последних продаж
    test('displays recent sales', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('CON-001')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('Chair')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('2')).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByText('200')).toBeInTheDocument();
        });
    });

    // Тест 3: Проверка обновления данных
    test('refreshes data', async () => {
        render(<Dashboard />);

        const refreshButton = screen.getByTestId('RefreshIcon');
        fireEvent.click(refreshButton);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/stats');
        });

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('http://localhost:5000/api/sales/recent');
        });
    });

    // Тест 4: Проверка обработки ошибок загрузки статистики
    test('handles stats loading error', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Failed to load stats'))
        );

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Error loading statistics')).toBeInTheDocument();
        });
    });

    // Тест 5: Проверка обработки ошибок загрузки продаж
    test('handles sales loading error', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockStats)
            })
        ).mockImplementationOnce(() =>
            Promise.reject(new Error('Failed to load sales'))
        );

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('Error loading recent sales')).toBeInTheDocument();
        });
    });

    // Тест 6: Проверка форматирования дат
    test('formats dates correctly', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('March 20, 2024')).toBeInTheDocument();
        });
    });

    // Тест 7: Проверка форматирования сумм
    test('formats amounts correctly', async () => {
        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('$200.00')).toBeInTheDocument();
        });
    });

    // Тест 8: Проверка пустого состояния
    test('handles empty data', async () => {
        fetch.mockImplementation((url) => {
            if (url.includes('/stats')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        totalCustomers: 0,
                        totalFurniture: 0,
                        totalContracts: 0,
                        totalSales: 0
                    })
                });
            }
            if (url.includes('/sales/recent')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ data: [] })
                });
            }
            return Promise.reject(new Error('Not found'));
        });

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('No recent sales')).toBeInTheDocument();
        });
    });

    // Тест 9: Проверка анимаций загрузки
    test('shows loading animations', async () => {
        render(<Dashboard />);

        expect(screen.getByTestId('CircularProgress')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByTestId('CircularProgress')).not.toBeInTheDocument();
        });
    });

    // Тест 10: Проверка производительности
    test('loads data efficiently', async () => {
        const startTime = performance.now();

        render(<Dashboard />);

        await waitFor(() => {
            expect(screen.getByText('10')).toBeInTheDocument();
        });

        const endTime = performance.now();
        const loadTime = endTime - startTime;

        // Проверяем, что загрузка выполняется достаточно быстро
        expect(loadTime).toBeLessThan(2000); // менее 2 секунд
    });
}); 