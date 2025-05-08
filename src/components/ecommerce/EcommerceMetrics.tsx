// src/components/dashboard/EcommerceMetrics.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpIcon, ArrowDownIcon, GroupIcon } from "../../icons";
import Badge from "../ui/badge/Badge";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAllUsers, selectAllUsers } from "../../store/slice/user";
import { fetchAllServiceProviders } from "../../store/slice/serviceProvider";
import { fetchSummary, selectDashboardSummary } from "../../store/slice/adminDashboard";
import { FaRupeeSign } from "react-icons/fa";

export default function EcommerceMetrics() {
  const dispatch = useDispatch<AppDispatch>();

  // fetch user/provider counts and summary
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllServiceProviders());
    dispatch(fetchSummary());
  }, [dispatch]);

  // customer/provider counts
  const allUsers = useSelector((state: RootState) => selectAllUsers(state));
  const customersCount = allUsers.filter((u) => u.role?.toLowerCase() === "customer").length;
  const providerCount = allUsers.filter((u) => u.role?.toLowerCase() === "serviceprovider").length;

  // get totalRevenue from summary slice
  const summary = useSelector((state: RootState) => selectDashboardSummary(state));
  const totalRevenue = summary?.totalRevenue ?? 0;

  // dummy growth values
  const customerDelta = 11.01;
  const providerDelta = -4.3;
  const revenueDelta = 5.6; // or compute a real delta if you have historical

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
      {/* Customers Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Customers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{customersCount.toLocaleString()}</h4>
          </div>
          {/* <Badge color={customerDelta >= 0 ? "success" : "error"}>
            {customerDelta >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(customerDelta).toFixed(2)}%
          </Badge> */}
        </div>
      </div>

      {/* Service Providers Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Service Providers</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">{providerCount.toLocaleString()}</h4>
          </div>
          {/* <Badge color={providerDelta >= 0 ? "success" : "error"}>
            {providerDelta >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(providerDelta).toFixed(2)}%
          </Badge> */}
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <FaRupeeSign className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              {totalRevenue.toLocaleString(undefined, {
                style: "currency",
                currency: "NPR",
              })}
            </h4>
          </div>
          {/* <Badge color={revenueDelta >= 0 ? "success" : "error"}>
            {revenueDelta >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
            {Math.abs(revenueDelta).toFixed(2)}%
          </Badge> */}
        </div>
      </div>
    </div>
  );
}
