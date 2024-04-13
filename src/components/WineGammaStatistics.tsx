import React, { useMemo } from 'react';
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from 'mantine-react-table';
import data from '../data/Wine-Data.json';

// Define a type for gamma statistics
type GammaStatistics = {
  [key: string]: {
    Mean: number;
    Median: number;
    Mode: number;
  };
};

export default function WineStatistics() {
  // Function to calculate Gamma property
  function calculateGamma(entry: any): number {
    const { Ash, Hue, Magnesium } = entry;
    return (Ash * Hue) / Magnesium;
  }

  // Function to calculate mean
  function calculateMean(dataPoints: number[]): number {
    const mean = dataPoints.reduce((sum, value) => sum + value, 0) / dataPoints.length;
    return Math.round(mean * 1000) / 1000;
  }

  // Function to calculate median
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

  // Function to calculate mode
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

  // Calculate class-wise mean, median, and mode of Gamma
  const gammaStatistics: GammaStatistics = {};
  data.forEach(entry => {
    const alcoholClass = entry.Alcohol.toString();
    const gamma = calculateGamma(entry);
    if (!gammaStatistics[alcoholClass]) {
      gammaStatistics[alcoholClass] = {
        Mean: 0,
        Median: 0,
        Mode: 0,
      };
    }
    gammaStatistics[alcoholClass].Mean += gamma;
    gammaStatistics[alcoholClass].Median = gamma;
    gammaStatistics[alcoholClass].Mode = gamma;
  });

  // Calculate mean, median, and mode for each class
  for (const alcoholClass in gammaStatistics) {
    const dataPoints = [gammaStatistics[alcoholClass].Mean];
    gammaStatistics[alcoholClass].Mean = calculateMean(dataPoints);
    gammaStatistics[alcoholClass].Median = calculateMedian(dataPoints);
    gammaStatistics[alcoholClass].Mode = calculateMode(dataPoints);
  }

  // Prepare data for the table
  const statisticsData = Object.entries(gammaStatistics).map(([alcoholClass, { Mean, Median, Mode }]) => ({
    Measure: `Class ${alcoholClass}`,
    "Gamma Mean": Mean,
    "Gamma Median": Median,
    "Gamma Mode": Mode
  }));

  // Define columns for the table
  const statisticsColumns: MRT_ColumnDef<typeof statisticsData[0]>[] = useMemo(
    () => [
      { id: 'Measure', header: 'Measure', accessorFn: (row) => row.Measure },
      { id: 'Gamma Mean', header: 'Gamma Mean', accessorFn: (row) => row["Gamma Mean"] },
      { id: 'Gamma Median', header: 'Gamma Median', accessorFn: (row) => row["Gamma Median"] },
      { id: 'Gamma Mode', header: 'Gamma Mode', accessorFn: (row) => row["Gamma Mode"] },
    ],
    []
  );

  // Initialize the table hook
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

  // Return the table component
  return <MantineReactTable table={statisticsTable} />;
}
