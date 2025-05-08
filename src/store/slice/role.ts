import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../axios/axiosinstance";
import { setMessage } from "./message";

export interface Role {
  id: string;
  name: string;
}

interface RoleState {
  data: Role[];
  currentRole: Role | null;
  error: string | null;
}

const initialState: RoleState = {
  data: [],
  currentRole: null,
  error: null,
};

// ✅ Thunks

export const fetchAllRoles = createAsyncThunk("roles/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await api.get("/role");
    return res.data.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching roles";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRoleById = createAsyncThunk("roles/fetchById", async (id: string, thunkAPI) => {
  try {
    const res = await api.get(`/role/${id}`);
    return res.data.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching role by ID";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchRoleByName = createAsyncThunk("roles/fetchByName", async (name: string, thunkAPI) => {
  try {
    const res = await api.get(`/role/${name}`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error fetching role by name";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const addRole = createAsyncThunk("roles/add", async (role: { name: string }, thunkAPI) => {
  try {
    const res = await api.post("/role", role);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error adding role";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRole = createAsyncThunk("roles/update", async ({ id, name }: { id: string; name: string }, thunkAPI) => {
  try {
    const res = await api.put(`/role/${id}`, { name });
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error updating role";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteRole = createAsyncThunk("roles/delete", async (id: string, thunkAPI) => {
  try {
    const res = await api.delete(`/role/${id}`);
    return res.data;
  } catch (error: any) {
    const message = error.response?.data?.data || error.message || "Error deleting role";
    thunkAPI.dispatch(setMessage(message));
    return thunkAPI.rejectWithValue(message);
  }
});

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllRoles.fulfilled, (state, action: PayloadAction<Role[]>) => {
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchRoleById.fulfilled, (state, action: PayloadAction<Role>) => {
        state.currentRole = action.payload;
        state.error = null;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(fetchRoleByName.fulfilled, (state, action: PayloadAction<Role>) => {
        state.currentRole = action.payload;
        state.error = null;
      })
      .addCase(fetchRoleByName.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(addRole.fulfilled, (state, action: PayloadAction<Role>) => {
        state.data.push(action.payload);
        state.error = null;
      })
      .addCase(addRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(updateRole.fulfilled, (state, action: PayloadAction<Role>) => {
        const index = state.data.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
        if (state.currentRole?.id === action.payload.id) {
          state.currentRole = action.payload;
        }
        state.error = null;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(deleteRole.fulfilled, (state, action: PayloadAction<string>) => {
        state.data = state.data.filter((r) => r.id !== action.payload);
        if (state.currentRole?.id === action.payload) {
          state.currentRole = null;
        }
        state.error = null;
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentRole } = roleSlice.actions;

// ✅ Selectors
export const selectAllRoles = (state: { role: RoleState }) => state.role.data;
export const selectAllRolesWithKey = (state: { role: RoleState }) => state.role.data.map((r) => ({ ...r, key: r.id }));
export const selectRoleById = (state: { role: RoleState }) => state.role.currentRole;
export const selectRoleError = (state: { role: RoleState }) => state.role.error;

export default roleSlice.reducer;
