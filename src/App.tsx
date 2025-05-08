// import { BrowserRouter as Router, Routes, Route } from "react-router";
// import SignIn from "./pages/AuthPages/SignIn";

// import NotFound from "./pages/OtherPage/NotFound";
// import UserProfiles from "./pages/UserProfiles";
// import Videos from "./pages/UiElements/Videos";
// import Images from "./pages/UiElements/Images";
// import Alerts from "./pages/UiElements/Alerts";
// import Badges from "./pages/UiElements/Badges";
// import Avatars from "./pages/UiElements/Avatars";
// import Buttons from "./pages/UiElements/Buttons";
// import LineChart from "./pages/Charts/LineChart";
// import BarChart from "./pages/Charts/BarChart";
// import Calendar from "./pages/Calendar";
// import DisplayCustomer from "./pages/Customer/DisplayCustomer";
// import DisplayServiceProvider from "./pages/ServiceProvider/DisplayServiceProvider";
// import FormElements from "./pages/Forms/FormElements";
// import Blank from "./pages/Blank";
// import AppLayout from "./layout/AppLayout";
// import { ScrollToTop } from "./components/common/ScrollToTop";
// import Home from "./pages/Dashboard/Home";
// import DisplayRoles from "./pages/Role/DisplayRole";
// import DisplayServiceCategory from "./pages/ServiceCategory/DisplayServiceCategory";
// import DisplayServiceLists from "./pages/ServiceList/DisplayServiceLists";

// export default function App() {
//   return (
//     <>
//       <Router>
//         <ScrollToTop />
//         <Routes>
//           {/* Dashboard Layout */}
//           <Route element={<AppLayout />}>
//             <Route index path="/" element={<Home />} />

//             {/* Others Page */}
//             <Route path="/profile" element={<UserProfiles />} />
//             <Route path="/calendar" element={<Calendar />} />
//             <Route path="/blank" element={<Blank />} />

//             {/* Forms */}
//             <Route path="/form-elements" element={<FormElements />} />

//             {/* Tables */}
//             <Route path="/customer-management" element={<DisplayCustomer />} />

//             <Route path="/serviceProvider-management" element={<DisplayServiceProvider />} />

//             <Route path="/role-management" element={<DisplayRoles />} />

//             <Route path="/serviceCategory-management" element={<DisplayServiceCategory />} />

//             <Route path="/serviceList-management" element={<DisplayServiceLists />} />

//             {/* Ui Elements */}
//             <Route path="/alerts" element={<Alerts />} />
//             <Route path="/avatars" element={<Avatars />} />
//             <Route path="/badge" element={<Badges />} />
//             <Route path="/buttons" element={<Buttons />} />
//             <Route path="/images" element={<Images />} />
//             <Route path="/videos" element={<Videos />} />

//             {/* Charts */}
//             <Route path="/line-chart" element={<LineChart />} />
//             <Route path="/bar-chart" element={<BarChart />} />
//           </Route>

//           {/* Auth Layout */}
//           <Route path="/signin" element={<SignIn />} />

//           {/* Fallback Route */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </Router>
//     </>
//   );
// }
// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "./components/common/PrivateRoute";
import SignIn from "./pages/AuthPages/SignIn";
import NotFound from "./pages/OtherPage/NotFound";
import AppLayout from "./layout/AppLayout";
import Home from "./pages/Dashboard/Home";
import DisplayCustomer from "./pages/Customer/DisplayCustomer";
import DisplayServiceProvider from "./pages/ServiceProvider/DisplayServiceProvider";
import DisplayRoles from "./pages/Role/DisplayRole";
import DisplayServiceCategory from "./pages/ServiceCategory/DisplayServiceCategory";
import DisplayServiceLists from "./pages/ServiceList/DisplayServiceLists";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/signin" element={<SignIn />} />

        {/* All protected routes go inside this PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Tables */}
            <Route path="/customer-management" element={<DisplayCustomer />} />
            <Route path="/serviceProvider-management" element={<DisplayServiceProvider />} />
            <Route path="/role-management" element={<DisplayRoles />} />
            <Route path="/serviceCategory-management" element={<DisplayServiceCategory />} />
            <Route path="/serviceList-management" element={<DisplayServiceLists />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
