import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addToSnippets, updateToSnippets } from "../redux/SnippetSlice";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const snippetId = searchParams.get("snippetId");

  const dispatch = useDispatch();
  function createSnippet() {
    const snippet = {
      title: title,
      content: value,
      _id: snippetId || Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };

    if (snippetId) {
      //update
      dispatch(updateToSnippets(snippet));
    } else {
      //create
      dispatch(addToSnippets(snippet));
    }
    //after creation or updation
    setTitle("");
    setValue("");
    setSearchParams("");
  }

  return (
    <div>
      <div className="flex flex-row gap-7 place-content-between">
        <input
          className="p-1 rounded-2xl mt-2 w-[66%] pl-4"
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <button onClick={createSnippet} className="p-2 rounded-2xl mt-2">
          {snippetId ? "Update My Snippet" : "Create My Snippet"}
        </button>
      </div>
      <div className="mt-8">
        <textarea
          className="rounded-2xl mt-4 min-w-[500px] p-4"
          value={value}
          placeholder="Enter content here..."
          onChange={(e) => {
            setValue(e.target.value);
          }}
          rows={20}
        />
      </div>
    </div>
  );
};

export default Home;
