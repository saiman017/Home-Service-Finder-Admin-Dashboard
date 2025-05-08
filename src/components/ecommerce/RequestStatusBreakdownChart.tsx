// src/components/charts/RequestStatusBreakdownChart.tsx
import React, { useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatusBreakdown, selectDashboardStatusBreakdown } from "../../store/slice/adminDashboard";
import type { RootState, AppDispatch } from "../../store/store";

export default function RequestStatusBreakdownChart() {
  const dispatch = useDispatch<AppDispatch>();
  const breakdown = useSelector((state: RootState) => selectDashboardStatusBreakdown(state));

  useEffect(() => {
    dispatch(fetchStatusBreakdown());
  }, [dispatch]);

  const labels = breakdown.map((b) => b.status);
  const series = breakdown.map((b) => b.count);
  const total = series.reduce((sum, v) => sum + v, 0);

  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    labels,
    colors: ["#465FFF", "#FBBF24", "#EF4444"],
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      labels: { colors: "#6B7280" },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "14px",
              color: "#374151",
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: "24px",
              color: "#111827",
              offsetY: 10,
              formatter: (val) => `${val} reqs`,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              color: "#6B7280",
              formatter: () => `${total}`,
            },
          },
        },
      },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} reqs`,
      },
    },
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">Request Status Breakdown</h3>
      <Chart options={options} series={series} type="donut" height={300} />
    </div>
  );
}
