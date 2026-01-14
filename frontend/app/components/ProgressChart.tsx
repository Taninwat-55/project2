'use client';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TooltipItem
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface ProgressChartProps {
    labels: string[];
    data: number[];
    label: string;
    color?: string;
    unit?: string;
    showFill?: boolean;
}

export default function ProgressChart({
    labels,
    data,
    label,
    color = '#f97316', // Orange accent color
    unit = '',
    showFill = true
}: ProgressChartProps) {
    const chartData = {
        labels,
        datasets: [
            {
                label,
                data,
                borderColor: color,
                backgroundColor: showFill ? `${color}20` : 'transparent',
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#1a1a1a',
                pointBorderWidth: 2,
                fill: showFill,
                tension: 0.3, // Smooth curves
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                titleColor: '#ffffff',
                bodyColor: '#a1a1aa',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function (context: TooltipItem<'line'>) {
                        const value = context.parsed.y ?? 0;
                        return `${value}${unit ? ' ' + unit : ''}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#71717a',
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                    drawBorder: false
                },
                ticks: {
                    color: '#71717a',
                    font: {
                        size: 11
                    },
                    callback: function (value: number | string) {
                        return `${value}${unit ? ' ' + unit : ''}`;
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index' as const
        }
    };

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-[var(--muted-foreground)]">
                <p>No data available yet. Start logging to see your progress!</p>
            </div>
        );
    }

    return (
        <div className="h-64">
            <Line data={chartData} options={options} />
        </div>
    );
}
