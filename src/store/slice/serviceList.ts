import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosinstance";
import { setMessage } from "./message";

export interface ServiceList {
  id: string;
  name: string;
  serviceCategoryId: string;
  createdAt: string;
  modifiedAt: string;
}

interface ServiceListState {
  services: ServiceList[];
  servicesByCategory: ServiceList[];
  selectedService: ServiceList | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServiceListState = {
  services: [],
  servicesByCategory: [],
  selectedService: null,
  loading: false,
  error: null,
};

// Fetch all services
export const fetchServiceLists = createAsyncThunk<ServiceList[], void, { rejectValue: string }>("serviceList/fetchAll", async (_, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.get("/serviceList");
    const wrapper = resp.data;
    if (!wrapper.success) {
      const msg = (wrapper.data?.data as string) || wrapper.message;
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
    return wrapper.data as ServiceList[];
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || "Failed to fetch services";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Fetch one by ID
export const fetchServiceListById = createAsyncThunk<ServiceList, string, { rejectValue: string }>("serviceList/fetchById", async (id, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.get(`/serviceList/${id}`);
    const wrapper = resp.data;
    if (!wrapper.success) {
      const msg = (wrapper.data as string) || wrapper.message;
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
    return wrapper.data as ServiceList;
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || "Failed to fetch service";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Fetch by category
export const fetchServiceListByCategory = createAsyncThunk<ServiceList[], string, { rejectValue: string }>("serviceList/fetchByCategory", async (categoryId, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.get(`/serviceList/by-category/${categoryId}`);
    const wrapper = resp.data;
    if (!wrapper.success) {
      const msg = (wrapper.data as string) || wrapper.message;
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
    return wrapper.data as ServiceList[];
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || "Failed to fetch services by category";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Add new service
export const addServiceList = createAsyncThunk<ServiceList, { name: string; serviceCategoryId: string }, { rejectValue: string }>("serviceList/add", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.post("/serviceList", payload);
    const wrapper = resp.data;
    if (!wrapper.success) {
      const msg = (wrapper.data as string) || wrapper.message;
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
    return wrapper.data as ServiceList;
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || "Failed to add service";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Update existing service
export const updateServiceList = createAsyncThunk<ServiceList, { id: string; name: string; serviceCategoryId: string }, { rejectValue: string }>(
  "serviceList/update",
  async ({ id, name, serviceCategoryId }, { rejectWithValue, dispatch }) => {
    try {
      const resp = await api.put(`/serviceList/${id}`, { name, serviceCategoryId });
      const wrapper = resp.data;
      if (!wrapper.success) {
        const msg = (wrapper.data as string) || wrapper.message;
        dispatch(setMessage(msg));
        return rejectWithValue(msg);
      }
      return wrapper.data as ServiceList;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Failed to update service";
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
  }
);

// Delete a service
export const deleteServiceList = createAsyncThunk<string, string, { rejectValue: string }>("serviceList/delete", async (id, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.delete(`/serviceList/${id}`);
    const wrapper = resp.data;
    if (!wrapper.success) {
      const msg = (wrapper.data as string) || wrapper.message;
      dispatch(setMessage(msg));
      return rejectWithValue(msg);
    }
    return id;
  } catch (err: any) {
    const msg = err.response?.data?.message || err.message || "Failed to delete service";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

const serviceListSlice = createSlice({
  name: "serviceList",
  initialState,
  reducers: {
    resetServiceListState(state) {
      state.loading = false;
      state.error = null;
    },
    setSelectedService(state, action: PayloadAction<ServiceList>) {
      state.selectedService = action.payload;
    },
    clearSelectedService(state) {
      state.selectedService = null;
    },
    clearServicesByCategory(state) {
      state.servicesByCategory = [];
    },
  },
  extraReducers: (builder) => {
    // fetchAll
    builder
      .addCase(fetchServiceLists.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchServiceLists.fulfilled, (s, a) => {
        s.loading = false;
        s.services = a.payload;
      })
      .addCase(fetchServiceLists.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });

    // fetchById
    builder
      .addCase(fetchServiceListById.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchServiceListById.fulfilled, (s, a) => {
        s.loading = false;
        s.selectedService = a.payload;
      })
      .addCase(fetchServiceListById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });

    // fetchByCategory
    builder
      .addCase(fetchServiceListByCategory.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchServiceListByCategory.fulfilled, (s, a) => {
        s.loading = false;
        s.servicesByCategory = a.payload;
      })
      .addCase(fetchServiceListByCategory.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });

    // add
    builder
      .addCase(addServiceList.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(addServiceList.fulfilled, (s, a) => {
        s.loading = false;
        s.services.push(a.payload);
      })
      .addCase(addServiceList.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });

    // update
    builder
      .addCase(updateServiceList.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(updateServiceList.fulfilled, (s, a) => {
        s.loading = false;
        const i = s.services.findIndex((x) => x.id === a.payload.id);
        if (i !== -1) s.services[i] = a.payload;
        if (s.selectedService?.id === a.payload.id) {
          s.selectedService = a.payload;
        }
      })
      .addCase(updateServiceList.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });

    // delete
    builder
      .addCase(deleteServiceList.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(deleteServiceList.fulfilled, (s, a) => {
        s.loading = false;
        s.services = s.services.filter((x) => x.id !== a.payload);
      })
      .addCase(deleteServiceList.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload!;
      });
  },
});

export const { resetServiceListState, setSelectedService, clearSelectedService, clearServicesByCategory } = serviceListSlice.actions;

export default serviceListSlice.reducer;
