// src/components/charts/RevenueOverTimeChart.tsx
import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDispatch, useSelector } from "react-redux";
import ChartTab from "./ChartTab";
import { fetchRevenue, selectDashboardRevenue } from "../../store/slice/adminDashboard";
import type { RootState, AppDispatch } from "../../store/store";

const TAB_OPTIONS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

export default function RevenueOverTimeChart() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector((state: RootState) => selectDashboardRevenue(state));

  const [groupBy, setGroupBy] = useState<"day" | "week" | "month">("day");

  // Fetch on mount + whenever the tab changes
  useEffect(() => {
    dispatch(fetchRevenue(groupBy));
  }, [dispatch, groupBy]);

  // Apex line chart options
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      type: "line",
      height: 240,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 4,
      hover: { sizeOffset: 0 },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: data.map((d) => d.period),
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val) => `NPR ${val.toFixed(0)}`,
      },
    },
    grid: {
      borderColor: "#eee",
      yaxis: { lines: { show: true } },
    },
    tooltip: {
      fixed: { enabled: true, position: "topRight", offsetX: 0, offsetY: -10 },
      x: { show: false },
      y: {
        formatter: (val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data.map((d) => d.amount),
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Revenue Over Time</h3>
          <p className="text-gray-500 text-sm dark:text-gray-400">Grouped by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}</p>
        </div>
        <ChartTab tabs={TAB_OPTIONS} selected={groupBy} onSelect={(val) => setGroupBy(val as "day" | "week" | "month")} />
      </div>

      <Chart options={options} series={series} type="line" height={240} />
    </div>
  );
}
