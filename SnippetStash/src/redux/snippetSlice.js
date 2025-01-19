import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast';

const initialState = {
  snippets: localStorage.getItem("snippets")
    ? JSON.parse(localStorage.getItem("snippets"))
    : []
}

export const snippetSlice = createSlice({
  name: 'snippet',
  initialState,
  reducers: {
    addToSnippets: (state, action) => {
      const snippet = action.payload;

      // Check if title or content is empty
      if (!snippet.title || !snippet.content) {
        toast.error("Title and content cannot be empty!");
        return; // Don't proceed if validation fails
      }

      // Check if snippet already exists
      const exists = state.snippets.some(
        (existingSnippet) => existingSnippet.title === snippet.title
      );

      if (exists) {
        // Notify the user that the snippet already exists
        toast.error("Snippet already exists!");
      } else {
        state.snippets.push(snippet);
        localStorage.setItem("snippets", JSON.stringify(state.snippets));
        toast.success("Snippet Created Successfully!");
      }
    },
    updateToSnippets: (state, action) => {
      const snippet = action.payload;
      const index = state.snippets.findIndex((items) => items._id === snippet._id);

      if (index >= 0) {
        state.snippets[index] = snippet;
        localStorage.setItem("snippets", JSON.stringify(state.snippets));
        toast.success("Snippet Updated!");
      }
    },
    resetAllSnippets: (state, action) => {
      prompt("Do you want to reset all Snippets?");
      state.snippets = [];
      localStorage.removeItem("snippets");
      toast.success("Snippets Removed!");
    },
    removeFromSnippets: (state, action) => {
      const snippetId = action.payload;
      const index = state.snippets.findIndex((items) => items._id === snippetId);

      if (index >= 0) {
        state.snippets.splice(index, 1);
        localStorage.setItem("snippets", JSON.stringify(state.snippets));
        toast.success("Snippet Deleted!");
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToSnippets, updateToSnippets, resetAllSnippets, removeFromSnippets } = snippetSlice.actions

export default snippetSlice.reducer
