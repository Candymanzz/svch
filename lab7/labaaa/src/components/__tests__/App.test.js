import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock fetch
global.fetch = jest.fn();

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Тест 1: Проверка рендеринга основного макета
    test('renders main layout', () => {
        render(<App />);

        expect(screen.getByText('Furniture Store')).toBeInTheDocument();
        expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    // Тест 2: Проверка навигации по меню
    test('navigates through menu items', async () => {
        render(<App />);

        // Проверяем начальное состояние
        expect(screen.getByText('Dashboard')).toBeInTheDocument();

        // Переходим к клиентам
        const customersLink = screen.getByText('Customers');
        fireEvent.click(customersLink);
        expect(screen.getByText('Customer List')).toBeInTheDocument();

        // Переходим к мебели
        const furnitureLink = screen.getByText('Furniture');
        fireEvent.click(furnitureLink);
        expect(screen.getByText('Furniture List')).toBeInTheDocument();

        // Переходим к контрактам
        const contractsLink = screen.getByText('Contracts');
        fireEvent.click(contractsLink);
        expect(screen.getByText('Contract List')).toBeInTheDocument();

        // Переходим к продажам
        const salesLink = screen.getByText('Sales');
        fireEvent.click(salesLink);
        expect(screen.getByText('Sale List')).toBeInTheDocument();
    });

    // Тест 3: Проверка отображения дашборда
    test('displays dashboard with statistics', async () => {
        render(<App />);

        expect(screen.getByText('Total Customers')).toBeInTheDocument();
        expect(screen.getByText('Total Furniture Items')).toBeInTheDocument();
        expect(screen.getByText('Total Contracts')).toBeInTheDocument();
        expect(screen.getByText('Total Sales')).toBeInTheDocument();
    });

    // Тест 4: Проверка адаптивности меню
    test('handles responsive menu', () => {
        render(<App />);

        // Симулируем мобильное устройство
        window.innerWidth = 600;
        fireEvent(window, new Event('resize'));

        const menuButton = screen.getByLabelText('menu');
        expect(menuButton).toBeInTheDocument();

        // Открываем меню
        fireEvent.click(menuButton);
        expect(screen.getByRole('navigation')).toHaveStyle({ display: 'block' });

        // Закрываем меню
        fireEvent.click(menuButton);
        expect(screen.getByRole('navigation')).toHaveStyle({ display: 'none' });
    });

    // Тест 5: Проверка темной темы
    test('toggles dark theme', () => {
        render(<App />);

        const themeToggle = screen.getByLabelText('toggle dark mode');
        fireEvent.click(themeToggle);

        expect(document.body).toHaveClass('dark-theme');
    });

    // Тест 6: Проверка обработки ошибок маршрутизации
    test('handles invalid routes', () => {
        render(<App />);

        // Симулируем неверный маршрут
        window.history.pushState({}, 'Test page', '/invalid-route');
        fireEvent(window, new Event('popstate'));

        expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    });

    // Тест 7: Проверка сохранения состояния темы
    test('persists theme preference', () => {
        // Устанавливаем темную тему
        localStorage.setItem('theme', 'dark');

        render(<App />);

        expect(document.body).toHaveClass('dark-theme');

        // Переключаем на светлую тему
        const themeToggle = screen.getByLabelText('toggle dark mode');
        fireEvent.click(themeToggle);

        expect(localStorage.getItem('theme')).toBe('light');
    });

    // Тест 8: Проверка анимаций переходов
    test('handles transition animations', async () => {
        render(<App />);

        const customersLink = screen.getByText('Customers');
        fireEvent.click(customersLink);

        await waitFor(() => {
            expect(screen.getByText('Customer List')).toHaveClass('fade-enter');
        });
    });

    // Тест 9: Проверка обработки ошибок загрузки данных
    test('handles data loading errors', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.reject(new Error('Failed to load data'))
        );

        render(<App />);

        await waitFor(() => {
            expect(screen.getByText('Error loading data')).toBeInTheDocument();
        });
    });

    // Тест 10: Проверка производительности
    test('maintains performance during navigation', async () => {
        render(<App />);

        const startTime = performance.now();

        // Выполняем несколько навигаций
        const links = ['Customers', 'Furniture', 'Contracts', 'Sales'];
        for (const link of links) {
            fireEvent.click(screen.getByText(link));
            await waitFor(() => {
                expect(screen.getByText(`${link} List`)).toBeInTheDocument();
            });
        }

        const endTime = performance.now();
        const navigationTime = endTime - startTime;

        // Проверяем, что навигация выполняется достаточно быстро
        expect(navigationTime).toBeLessThan(1000); // менее 1 секунды
    });
}); 