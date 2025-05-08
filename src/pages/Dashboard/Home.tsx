// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import RequestsOverTimeBarChart from "../../components/ecommerce/RequestsOverTimeBarChart";
// import RevenueOverTimeChart from "../../components/ecommerce/RevenueOverTimeChart";
// import RequestStatusBreakdownChart from "../../components/ecommerce/RequestStatusBreakdownChart";

// import PageMeta from "../../components/common/PageMeta";

// export default function Home() {
//   return (
//     <>
//       <PageMeta title="Home Service Finder Admin Dahsboard" description="Home Service Finder Admin Dahsboard" />
//       <div className="grid grid-cols-12 gap-4 md:gap-6">
//         <div className="col-span-12 space-y-6 xl:col-span-7">
//           <EcommerceMetrics />

//           <RequestsOverTimeBarChart />
//         </div>

//         <div className="col-span-12 xl:col-span-5">
//           <RequestStatusBreakdownChart />
//         </div>

//         <div className="col-span-12">
//           <RevenueOverTimeChart />
//         </div>

//         {/* <div className="col-span-12 xl:col-span-5">
//           <DemographicCard />
//         </div>

//         <div className="col-span-12 xl:col-span-7">
//           <RecentOrders />
//         </div> */}
//       </div>
//     </>
//   );
// }
// pages/home.tsx
// pages/Home.tsx
import React from "react";
import PageMeta from "../../components/common/PageMeta";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import RequestsOverTimeBarChart from "../../components/ecommerce/RequestsOverTimeBarChart";
import RequestStatusBreakdownChart from "../../components/ecommerce/RequestStatusBreakdownChart";
import RevenueOverTimeChart from "../../components/ecommerce/RevenueOverTimeChart";

export default function Home() {
  return (
    <>
      <PageMeta title="Home Service Finder Admin Dashboard" description="Home Service Finder Admin Dashboard" />

      <div className="grid grid-cols-12 gap-6">
        {/* Row 1: full‑width metrics */}
        <div className="col-span-12">
          <EcommerceMetrics />
        </div>

        {/* Row 2: two half‑width charts */}
        <div className="col-span-12 lg:col-span-6">
          <RequestsOverTimeBarChart />
        </div>
        <div className="col-span-12 lg:col-span-6">
          <RequestStatusBreakdownChart />
        </div>

        {/* Row 3: full‑width revenue */}
        <div className="col-span-12">
          <RevenueOverTimeChart />
        </div>
      </div>
    </>
  );
}
