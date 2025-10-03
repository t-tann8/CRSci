/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function DashboardGraph({
    data,
    year,
}: {
    data: any;
    year: number;
}) {
    // data = [
    //     { year: 2022, month: 1, count: 10 },
    //     { year: 2022, month: 2, count: 8 },
    //     { year: 2022, month: 3, count: 12 },
    //     { year: 2022, month: 4, count: 15 },
    //     { year: 2022, month: 5, count: 9 },
    //     { year: 2022, month: 6, count: 11 },
    //     { year: 2022, month: 7, count: 14 },
    //     { year: 2022, month: 8, count: 13 },
    //     { year: 2022, month: 9, count: 16 },
    //     { year: 2022, month: 10, count: 18 },
    //     { year: 2022, month: 11, count: 7 },
    //     { year: 2022, month: 12, count: 10 },

    //     { year: 2023, month: 1, count: 11 },
    //     { year: 2023, month: 2, count: 9 },
    //     { year: 2023, month: 3, count: 13 },
    //     { year: 2023, month: 4, count: 14 },
    //     { year: 2023, month: 5, count: 10 },
    //     { year: 2023, month: 6, count: 12 },
    //     { year: 2023, month: 7, count: 15 },
    //     { year: 2023, month: 8, count: 11 },
    //     { year: 2023, month: 9, count: 17 },
    //     { year: 2023, month: 10, count: 19 },
    //     { year: 2023, month: 11, count: 8 },
    //     { year: 2023, month: 12, count: 12 },

    //     { year: 2024, month: 1, count: 12 },
    //     { year: 2024, month: 2, count: 10 },
    //     { year: 2024, month: 3, count: 14 },
    //     { year: 2024, month: 4, count: 13 },
    //     { year: 2024, month: 5, count: 11 },
    //     { year: 2024, month: 6, count: 15 },
    //     { year: 2024, month: 7, count: 16 },
    //     { year: 2024, month: 8, count: 14 },
    //     { year: 2024, month: 9, count: 18 },
    //     { year: 2024, month: 10, count: 20 },
    //     { year: 2024, month: 11, count: 9 },
    //     { year: 2024, month: 12, count: 13 },
    // ];
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const filterData = data.filter(
        (item: { year: number; month: number; count: number }) =>
            item.year === year
    );

    const updatedData = React.useMemo(
        () =>
            filterData.map(
                (item: { year: number; month: number; count: number }) => ({
                    ...item,
                    Month: monthNames[item.month - 1],
                    Users: item.count,
                })
            ),
        [filterData]
    );

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <AreaChart
                    data={updatedData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <defs>
                        <linearGradient
                            id="colorUsers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#F59A3B"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#F59A3B"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="Users"
                        stroke="#F59A3B"
                        fillOpacity={1}
                        fill="url(#colorUsers)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
