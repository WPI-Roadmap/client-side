
import * as React from 'react';
import { CompactTable } from '@table-library/react-table-library/compact';
import { useTheme } from '@table-library/react-table-library/theme';
import { getTheme } from '@table-library/react-table-library/baseline';

import data from '../DataParse/dummy.json'
import processData from './dataProcessor';  // Adjust the path based on your file structure


async function fetchData() {
    try {
        // Read the JSON file
        const response = await fetch("./dummy.json");
        if (!response.ok) {
            throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }

        const data = await response.json();
        processData(data);
    } catch (error) {
        console.error('Error:', error);
    }
}
fetchData();

const nodes = [
    {
        id: '0',
        name: 'Shopping List',
        deadline: new Date(2020, 1, 15),
        type: 'TASK',
        isComplete: true,
        nodes: 3,
    },
];


const key = 'Compact Table';

const Component = () => {
    const data = { nodes };

    const theme = useTheme(getTheme());

    const COLUMNS = [
        { label: 'Task', renderCell: (item) => item.name },
        {
            label: 'Deadline',
            renderCell: (item) =>
                item.deadline.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }),
        },
        { label: 'Type', renderCell: (item) => item.type },
        {
            label: 'Complete',
            renderCell: (item) => item.isComplete.toString(),
        },
        { label: 'Tasks', renderCell: (item) => item.nodes?.length },
    ];

    return <CompactTable columns={COLUMNS} data={data} theme={theme} />;
};

export default Component;