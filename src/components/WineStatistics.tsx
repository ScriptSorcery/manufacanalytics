import React, { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import data from '../data/Wine-Data.json';

export default function WineStatistics() {
  function calculateMean(dataPoints: number[]): number {
    const mean = dataPoints.reduce((sum, value) => sum + value, 0) / dataPoints.length;
    return Math.round(mean * 1000) / 1000;
  }

  function calculateMedian(dataPoints: number[]): number {
    const sortedData = [...dataPoints].sort((a, b) => a - b);
    const n = sortedData.length;
    let median;
    if (n % 2 === 0) {
      median = (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    } else {
      median = sortedData[Math.floor(n / 2)];
    }
    return Math.round(median * 1000) / 1000;
  }

  function calculateMode(dataPoints: number[]): number {
    const frequency: Record<number, number> = {};
    dataPoints.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
    });

    let modes: number[] = [];
    let maxFrequency = 0;

    for (const value in frequency) {
      if (frequency[value] > maxFrequency) {
        modes = [parseInt(value)];
        maxFrequency = frequency[value];
      } else if (frequency[value] === maxFrequency) {
        modes.push(parseInt(value));
      }
    }

    const mode = modes[0]; // We'll return the first mode if there are multiple modes

    return mode !== undefined ? Math.round(mode * 1000) / 1000 : mode;
  }

  // Calculate mean, median, and mode of Flavanoids for each class of wine
  const statistics: Record<string, { Mean: number; Median: number; Mode: number }> = {};
  data.forEach(entry => {
    const alcoholClass = entry.Alcohol.toString();
    if (!statistics[alcoholClass]) {
      statistics[alcoholClass] = {
        Mean: 0,
        Median: 0,
        Mode: 0
      };
    }
    const flavanoidsData = parseFloat(entry.Flavanoids.toString());
    if (!isNaN(flavanoidsData)) {
      statistics[alcoholClass].Mean += flavanoidsData;
      statistics[alcoholClass].Median = flavanoidsData;
      statistics[alcoholClass].Mode = flavanoidsData;
    }
  });

  // Calculate mean, median, and mode
  for (const alcoholClass in statistics) {
    const dataPoints = [statistics[alcoholClass].Mean];
    statistics[alcoholClass].Mean = calculateMean(dataPoints);
    statistics[alcoholClass].Median = calculateMedian(dataPoints);
    statistics[alcoholClass].Mode = calculateMode(dataPoints);
  }

  // Prepare data for the table, swapping columns and rows
  const statisticsData = Object.entries(statistics).map(([alcoholClass, { Mean, Median, Mode }]) => ({
    Class: alcoholClass,
    "Mean": Mean,
    "Median": Median,
    "Mode": Mode
  }));

  const statisticsColumns: MRT_ColumnDef<typeof statisticsData[0]>[] = useMemo(
    () => [
      { id: 'Class', header: 'Measure', accessorFn: (row) => `Class ${row.Class}`, sortable: false },
      { id: 'Mean', header: 'Flavanoids Mean', accessorFn: (row) => row.Mean , sortable: false},
      { id: 'Median', header: 'Flavanoids Median', accessorFn: (row) => row.Median, sortable: false },
      { id: 'Mode', header: 'Flavanoids Mode', accessorFn: (row) => row.Mode, sortable: false },
    ],
    []
  );

  const statisticsTable = useMantineReactTable({
    columns: statisticsColumns,
    data: statisticsData,
    enableHiding: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableGlobalFilter: false,
    enableFullScreenToggle: false,
    enableColumnActions: false,
    enableSorting: false
  });

  return <MantineReactTable table={statisticsTable} />;
}
