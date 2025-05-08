// src/components/charts/RequestsOverTimeBarChart.tsx
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDispatch, useSelector } from "react-redux";
import ChartTab from "./ChartTab";

import { fetchRequests, selectDashboardRequests } from "../../store/slice/adminDashboard";
import type { RootState, AppDispatch } from "../../store/store";

const TAB_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export default function RequestsOverTimeBarChart() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => selectDashboardRequests(state));

  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  useEffect(() => {
    dispatch(fetchRequests(groupBy));
  }, [dispatch, groupBy]);

  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      type: "bar",
      height: 260,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "50%",
        borderRadius: 4,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.period),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `${val}`,
      },
    },
    grid: {
      borderColor: "#eee",
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      x: { show: false },
      y: {
        formatter: (val: number) => `${val} requests`,
      },
    },
  };

  const series = [
    {
      name: "Requests",
      data: data.map((d) => d.count),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Requests Over Time</h3>
          <p className="text-gray-500 text-sm dark:text-gray-400">Grouped by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</p>
        </div>
        <ChartTab tabs={TAB_OPTIONS} selected={groupBy} onSelect={(val: string) => setGroupBy(val as "day" | "week" | "month")} />
      </div>

      <Chart options={options} series={series} type="bar" height={260} />
    </div>
  );
}
