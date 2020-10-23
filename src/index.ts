import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import Axios from "axios";

interface CrudSlice {
  baseUrl: string;
  name: string;
}

const crudSlide = ({ baseUrl, name }: CrudSlice) => {
  const fetchById = createAsyncThunk(`${name}/fetchById`, (id: string) =>
    Axios.get(`${baseUrl}/${id}`).then((res) => res.data)
  );

  const fetchAll = createAsyncThunk(`${name}/fetchAll`, () =>
    Axios.get(`${baseUrl}`).then((res) => res.data)
  );

  const createNew = createAsyncThunk(`${name}/createNew`, (data: any) =>
    Axios.post(`${baseUrl}`, data).then((res) => res.data)
  );

  const deleteById = createAsyncThunk(`${name}/deleteById`, (id: string) =>
    Axios.delete(`${baseUrl}/${id}`).then((res) => res.data)
  );

  const updateById = createAsyncThunk(
    `${name}/updateById`,
    ({ id, data }: any) =>
      Axios.put(`${baseUrl}/${id}`, data).then((res) => res.data)
  );

  const adapter = createEntityAdapter();
  const slice = createSlice({
    name,
    initialState: adapter.getInitialState({
      isFetching: false,
      isCreating: false,
      isUpdating: false,
      isDeleting: false,
      limit: 0,
      page: 0,
      pageCount: 0,
      total: 0,
    }),
    reducers: {},
    extraReducers: (builder) => {
      builder.addCase(fetchById.pending, (state) => {
        state.isFetching = true;
      });
      builder.addCase(fetchById.rejected, (state) => {
        state.isFetching = false;
      });
      builder.addCase(fetchById.fulfilled, (state, { payload }: any) => {
        adapter.upsertOne(state, payload.data);
      });

      builder.addCase(fetchAll.pending, (state) => {
        state.isFetching = true;
      });
      builder.addCase(fetchAll.rejected, (state) => {
        state.isFetching = false;
      });
      builder.addCase(fetchAll.fulfilled, (state, { payload }: any) => {
        adapter.upsertMany(state, payload.data);
        state.limit = payload.limit;
        state.page = payload.page;
        state.pageCount = payload.pageCount;
        state.total = payload.total;
      });

      builder.addCase(createNew.pending, (state) => {
        state.isCreating = true;
      });
      builder.addCase(createNew.rejected, (state) => {
        state.isCreating = false;
      });
      builder.addCase(createNew.fulfilled, (state, { payload }: any) => {
        adapter.upsertOne(state, payload.data);
      });

      builder.addCase(updateById.pending, (state) => {
        state.isUpdating = true;
      });
      builder.addCase(updateById.rejected, (state) => {
        state.isUpdating = false;
      });
      builder.addCase(updateById.fulfilled, (state, { payload }: any) => {
        adapter.updateOne(state, payload.data);
      });

      builder.addCase(deleteById.pending, (state) => {
        state.isDeleting = true;
      });
      builder.addCase(deleteById.rejected, (state) => {
        state.isDeleting = false;
      });
      builder.addCase(deleteById.fulfilled, (state, { payload }: any) => {
        adapter.removeOne(state, payload.data._id);
      });
    },
  });

  return {
    reducer: slice.reducer,
    ...adapter.getSelectors((state: any) => state[name]),
    adapter,
    fetchById,
    fetchAll,
    updateById,
    deleteById,
    createNew,
  };
};
export default crudSlide;
