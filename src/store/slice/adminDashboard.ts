import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosinstance";
import { setMessage } from "./message";

// DTO Interfaces
export interface SummaryDto {
  totalRequests: number;
  totalRevenue: number;
}

export interface TimeSeriesDto {
  period: string;
  count: number;
}

export interface RevenueDto {
  period: string;
  amount: number;
}

export interface ProviderPerformanceDto {
  providerId: string;
  name: string;
  completedJobs: number;
}

export interface StatusBreakdownDto {
  status: string;
  count: number;
}

// Slice State
interface AdminDashboardState {
  summary: SummaryDto | null;
  requests: TimeSeriesDto[];
  revenue: RevenueDto[];
  topProviders: ProviderPerformanceDto[];
  statusBreakdown: StatusBreakdownDto[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminDashboardState = {
  summary: null,
  requests: [],
  revenue: [],
  topProviders: [],
  statusBreakdown: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSummary = createAsyncThunk<SummaryDto>("adminDashboard/fetchSummary", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/dashboard/summary");
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching summary";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRequests = createAsyncThunk<TimeSeriesDto[], string | undefined>("adminDashboard/fetchRequests", async (groupBy = "day", thunkAPI) => {
  try {
    const res = await api.get(`/admin/dashboard/requests?groupBy=${groupBy}`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching requests";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRevenue = createAsyncThunk<RevenueDto[], string | undefined>("adminDashboard/fetchRevenue", async (groupBy = "month", thunkAPI) => {
  try {
    const res = await api.get(`/admin/dashboard/revenue?groupBy=${groupBy}`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching revenue";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchTopProviders = createAsyncThunk<ProviderPerformanceDto[], number | undefined>("adminDashboard/fetchTopProviders", async (take = 5, thunkAPI) => {
  try {
    const res = await api.get(`/admin/dashboard/top-providers?take=${take}`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching top providers";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchStatusBreakdown = createAsyncThunk<StatusBreakdownDto[]>("adminDashboard/fetchStatusBreakdown", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/dashboard/status-breakdown");
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching status breakdown";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

// Slice
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Summary
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action: PayloadAction<SummaryDto>) => {
        state.summary = action.payload;
        state.loading = false;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Requests
      .addCase(fetchRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRequests.fulfilled, (state, action: PayloadAction<TimeSeriesDto[]>) => {
        state.requests = action.payload;
        state.loading = false;
      })
      .addCase(fetchRequests.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Revenue
      .addCase(fetchRevenue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRevenue.fulfilled, (state, action: PayloadAction<RevenueDto[]>) => {
        state.revenue = action.payload;
        state.loading = false;
      })
      .addCase(fetchRevenue.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Top Providers
      .addCase(fetchTopProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProviders.fulfilled, (state, action: PayloadAction<ProviderPerformanceDto[]>) => {
        state.topProviders = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopProviders.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // Status Breakdown
      .addCase(fetchStatusBreakdown.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatusBreakdown.fulfilled, (state, action: PayloadAction<StatusBreakdownDto[]>) => {
        state.statusBreakdown = action.payload;
        state.loading = false;
      })
      .addCase(fetchStatusBreakdown.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default adminDashboardSlice.reducer;

// Selectors
export const selectDashboardSummary = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.summary;
export const selectDashboardRequests = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.requests;
export const selectDashboardRevenue = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.revenue;
export const selectDashboardTopProviders = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.topProviders;
export const selectDashboardStatusBreakdown = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.statusBreakdown;
export const selectDashboardLoading = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.loading;
export const selectDashboardError = (state: { adminDashboard: AdminDashboardState }) => state.adminDashboard.error;
