import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { addToSnippets, updateToSnippets } from "../redux/SnippetSlice";

const ViewSnippet = () => {

const {id} = useParams();

const allSnippets = useSelector((state)=>state.snippet.snippets);
const snippet = allSnippets.filter((s)=> s._id === id)[0];


  return (
    <div>
      <div>
        <div className="flex flex-row gap-7 place-content-between">
          <input
            className="p-1 rounded-2xl mt-2 w-[66%] pl-4 cursor-not-allowed"
            type="text"
            placeholder="Enter title here"
            value={snippet.title}
            disabled
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          {/* <button onClick={createSnippet} className="p-2 rounded-2xl mt-2">
          {snippetId ? "Update My Snippet" : "Create My Snippet"}
        </button> */}
        </div>
        <div className="mt-8">
          <textarea
            className="rounded-2xl mt-4 min-w-[500px] p-4 cursor-not-allowed"
            value={snippet.content}
            placeholder="Enter content here..."
            disabled
            onChange={(e) => {
              setValue(e.target.value);
            }}
            rows={20}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewSnippet;
