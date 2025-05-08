// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import api from "../../axios/axiosinstance";
// import { setMessage } from "./message";

// export interface ServiceCategory {
//   id: string;
//   name: string;
//   description: string;
//   categoryImage?: string;
//   createdAt: string;
//   modifiedAt?: string;
// }

// interface ServiceCategoryState {
//   categories: ServiceCategory[];
//   selectedCategory: ServiceCategory | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: ServiceCategoryState = {
//   categories: [],
//   selectedCategory: null,
//   isLoading: false,
//   error: null,
// };

// // === THUNKS === //

// // Fetch all
// export const fetchServiceCategories = createAsyncThunk<ServiceCategory[], void, { rejectValue: string }>("serviceCategory/fetchAll", async (_, { rejectWithValue, dispatch }) => {
//   try {
//     const resp = await api.get("/serviceCategory");
//     return resp.data.data as ServiceCategory[];
//   } catch (err: any) {
//     const msg = err.response?.data?.message || "Error fetching categories";
//     dispatch(setMessage(msg));
//     return rejectWithValue(msg);
//   }
// });

// // Fetch by ID
// export const fetchServiceCategoryById = createAsyncThunk<ServiceCategory, string, { rejectValue: string }>("serviceCategory/fetchById", async (id, { rejectWithValue, dispatch }) => {
//   try {
//     const resp = await api.get(`/serviceCategory/${id}`);
//     return resp.data.data as ServiceCategory;
//   } catch (err: any) {
//     const msg = err.response?.data?.message || "Error fetching category";
//     dispatch(setMessage(msg));
//     return rejectWithValue(msg);
//   }
// });

// // Add new (with optional File)
// export const addServiceCategory = createAsyncThunk<ServiceCategory, { name: string; description?: string; categoryImageFile?: File }, { rejectValue: string }>(
//   "serviceCategory/add",
//   async (payload, { rejectWithValue, dispatch }) => {
//     try {
//       const formData = new FormData();
//       formData.append("Name", payload.name);
//       if (payload.description) {
//         formData.append("Description", payload.description);
//       }
//       if (payload.categoryImageFile) {
//         formData.append("CategoryImageFile", payload.categoryImageFile);
//       }

//       // override JSON default so boundary gets set correctly
//       const resp = await api.post("/serviceCategory", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       return resp.data;
//     } catch (err: any) {
//       const msg = err.response?.data?.message || "Error adding category";
//       dispatch(setMessage(msg));
//       return rejectWithValue(msg);
//     }
//   }
// );
// // Update existing (with optional File)
// export const updateServiceCategory = createAsyncThunk<ServiceCategory, { id: string; name: string; description?: string; categoryImageFile?: File }, { rejectValue: string }>(
//   "serviceCategory/update",
//   async ({ id, name, description, categoryImageFile }, { rejectWithValue, dispatch }) => {
//     try {
//       const formData = new FormData();
//       formData.append("Name", name);
//       if (description) {
//         formData.append("Description", description);
//       }
//       if (categoryImageFile) {
//         formData.append("CategoryImageFile", categoryImageFile);
//       }

//       const resp = await api.put(`/serviceCategory/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" }, // ← and override here too
//       });
//       return resp.data;
//     } catch (err: any) {
//       const msg = err.response?.data?.message || "Error updating category";
//       dispatch(setMessage(msg));
//       return rejectWithValue(msg);
//     }
//   }
// );

// // Delete
// export const deleteServiceCategory = createAsyncThunk<string, string, { rejectValue: string }>("serviceCategory/delete", async (id, { rejectWithValue, dispatch }) => {
//   try {
//     await api.delete(`/serviceCategory/${id}`);
//     return id;
//   } catch (err: any) {
//     const msg = err.response?.data?.message || "Error deleting category";
//     dispatch(setMessage(msg));
//     return rejectWithValue(msg);
//   }
// });

// const serviceCategorySlice = createSlice({
//   name: "serviceCategory",
//   initialState,
//   reducers: {
//     clearSelectedCategory(state) {
//       state.selectedCategory = null;
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch all
//     builder
//       .addCase(fetchServiceCategories.pending, (s) => {
//         s.isLoading = true;
//         s.error = null;
//       })
//       .addCase(fetchServiceCategories.fulfilled, (s, a) => {
//         s.isLoading = false;
//         s.categories = a.payload;
//       })
//       .addCase(fetchServiceCategories.rejected, (s, a) => {
//         s.isLoading = false;
//         s.error = a.payload!;
//       });

//     // Fetch by id
//     builder
//       .addCase(fetchServiceCategoryById.pending, (s) => {
//         s.isLoading = true;
//         s.error = null;
//       })
//       .addCase(fetchServiceCategoryById.fulfilled, (s, a) => {
//         s.isLoading = false;
//         s.selectedCategory = a.payload;
//       })
//       .addCase(fetchServiceCategoryById.rejected, (s, a) => {
//         s.isLoading = false;
//         s.error = a.payload!;
//       });

//     // Add
//     builder
//       .addCase(addServiceCategory.pending, (s) => {
//         s.isLoading = true;
//         s.error = null;
//       })
//       .addCase(addServiceCategory.fulfilled, (s, a) => {
//         s.isLoading = false;
//         s.categories.push(a.payload);
//       })
//       .addCase(addServiceCategory.rejected, (s, a) => {
//         s.isLoading = false;
//         s.error = a.payload!;
//       });

//     // Update
//     builder
//       .addCase(updateServiceCategory.pending, (s) => {
//         s.isLoading = true;
//         s.error = null;
//       })
//       .addCase(updateServiceCategory.fulfilled, (s, a) => {
//         s.isLoading = false;
//         const idx = s.categories.findIndex((c) => c.id === a.payload.id);
//         if (idx !== -1) s.categories[idx] = a.payload;
//         if (s.selectedCategory?.id === a.payload.id) {
//           s.selectedCategory = a.payload;
//         }
//       })
//       .addCase(updateServiceCategory.rejected, (s, a) => {
//         s.isLoading = false;
//         s.error = a.payload!;
//       });

//     // Delete
//     builder
//       .addCase(deleteServiceCategory.pending, (s) => {
//         s.isLoading = true;
//         s.error = null;
//       })
//       .addCase(deleteServiceCategory.fulfilled, (s, a) => {
//         s.isLoading = false;
//         s.categories = s.categories.filter((c) => c.id !== a.payload);
//       })
//       .addCase(deleteServiceCategory.rejected, (s, a) => {
//         s.isLoading = false;
//         s.error = a.payload!;
//       });
//   },
// });

// export const { clearSelectedCategory } = serviceCategorySlice.actions;
// export default serviceCategorySlice.reducer;
// store/slice/serviceCategory.ts
// store/slice/serviceCategory.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../axios/axiosinstance";
import { setMessage } from "./message";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  categoryImage?: string;
  createdAt: string;
  modifiedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  data: T | null;
  message: string;
}

interface ServiceCategoryState {
  categories: ServiceCategory[];
  selectedCategory: ServiceCategory | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ServiceCategoryState = {
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,
};

// Fetch all
export const fetchServiceCategories = createAsyncThunk<ApiResponse<ServiceCategory[]>, void, { rejectValue: string }>("serviceCategory/fetchAll", async (_, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.get<ApiResponse<ServiceCategory[]>>("/serviceCategory");
    return resp.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Error fetching categories";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Fetch by ID
export const fetchServiceCategoryById = createAsyncThunk<ApiResponse<ServiceCategory>, string, { rejectValue: string }>("serviceCategory/fetchById", async (id, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.get<ApiResponse<ServiceCategory>>(`/serviceCategory/${id}`);
    return resp.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Error fetching category";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

// Add new
export const addServiceCategory = createAsyncThunk<ApiResponse<ServiceCategory>, { name: string; description?: string; categoryImageFile?: File }, { rejectValue: string }>(
  "serviceCategory/add",
  async (payload, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      const formData = new FormData();
      formData.append("Name", payload.name);
      if (payload.description) formData.append("Description", payload.description);
      if (payload.categoryImageFile) {
        formData.append("CategoryImageFile", payload.categoryImageFile);
      }

      const resp = await api.post<ApiResponse<ServiceCategory>>("/serviceCategory", formData, { headers: { "Content-Type": "multipart/form-data" } });
      return resp.data;
    } catch (error: any) {
      const message = error.response?.data?.data || error.message || "Error adding category";
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  }
);

// Update existing
export const updateServiceCategory = createAsyncThunk<ApiResponse<ServiceCategory>, { id: string; name: string; description?: string; categoryImageFile?: File }, { rejectValue: string }>(
  "serviceCategory/update",
  async (payload, thunkAPI) => {
    const { id, name, description, categoryImageFile } = payload;
    const { dispatch, rejectWithValue } = thunkAPI;

    try {
      const formData = new FormData();
      formData.append("Name", name);
      if (description) formData.append("Description", description);
      if (categoryImageFile) formData.append("CategoryImageFile", categoryImageFile);

      const resp = await api.put<ApiResponse<ServiceCategory>>(`/serviceCategory/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      return resp.data;
    } catch (error: any) {
      const message = error.response?.data?.data || error.message || "Error updating category";
      dispatch(setMessage(message));
      return rejectWithValue(message);
    }
  }
);

// Delete
export const deleteServiceCategory = createAsyncThunk<ApiResponse<null>, string, { rejectValue: string }>("serviceCategory/delete", async (id, { rejectWithValue, dispatch }) => {
  try {
    const resp = await api.delete<ApiResponse<null>>(`/serviceCategory/${id}`);
    return resp.data;
  } catch (err: any) {
    const msg = err.response?.data?.message || "Error deleting category";
    dispatch(setMessage(msg));
    return rejectWithValue(msg);
  }
});

const serviceCategorySlice = createSlice({
  name: "serviceCategory",
  initialState,
  reducers: {
    clearSelectedCategory(state) {
      state.selectedCategory = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All
    builder
      .addCase(fetchServiceCategories.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchServiceCategories.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success && a.payload.data) {
          s.categories = a.payload.data;
        } else {
          s.error = a.payload.message;
        }
      })
      .addCase(fetchServiceCategories.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload!;
      });

    // Fetch By Id
    builder
      .addCase(fetchServiceCategoryById.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(fetchServiceCategoryById.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success && a.payload.data) {
          s.selectedCategory = a.payload.data;
        } else {
          s.error = a.payload.message;
        }
      })
      .addCase(fetchServiceCategoryById.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload!;
      });

    // Add
    builder
      .addCase(addServiceCategory.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(addServiceCategory.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success && a.payload.data) {
          s.categories.push(a.payload.data);
        } else {
          s.error = a.payload.message;
        }
      })
      .addCase(addServiceCategory.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload!;
      });

    // Update
    builder
      .addCase(updateServiceCategory.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(updateServiceCategory.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success && a.payload.data) {
          const idx = s.categories.findIndex((c) => c.id === a.payload.data!.id);
          if (idx !== -1) s.categories[idx] = a.payload.data!;
          if (s.selectedCategory?.id === a.payload.data!.id) {
            s.selectedCategory = a.payload.data!;
          }
        } else {
          s.error = a.payload.message;
        }
      })
      .addCase(updateServiceCategory.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload!;
      });

    // Delete
    builder
      .addCase(deleteServiceCategory.pending, (s) => {
        s.isLoading = true;
        s.error = null;
      })
      .addCase(deleteServiceCategory.fulfilled, (s, a) => {
        s.isLoading = false;
        if (a.payload.success) {
          // remove by id from request URL (no payload.data)
          // or re-fetch to be safe
        } else {
          s.error = a.payload.message;
        }
      })
      .addCase(deleteServiceCategory.rejected, (s, a) => {
        s.isLoading = false;
        s.error = a.payload!;
      });
  },
});

export const { clearSelectedCategory } = serviceCategorySlice.actions;
export default serviceCategorySlice.reducer;
