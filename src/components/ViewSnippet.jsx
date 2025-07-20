import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { addToSnippets, updateToSnippets } from "../redux/snippetSlice.js";

const ViewSnippet = () => {
const [copySuccess, setCopySuccess] = useState(false);

const {id} = useParams();

const allSnippets = useSelector((state)=>state.snippet.snippets);
const snippet = allSnippets.filter((s)=> s._id === id)[0];
const copyToClipboard = () => {
  navigator.clipboard.writeText(value).then(
    () => {
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    },
    () => {
      console.error("Could not copy text");
    }
  );
};


return (
  <div className="w-full min-h-screen bg-gray-900 text-gray-200 pt-4 pb-8 px-4">

    <div className="container mx-auto w-full max-w-full lg:max-w-7xl xl:max-w-full 2xl:max-w-full px-4 sm:px-6 lg:px-8">
      
      
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Title
            </label>
            <input
              id="title"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-white cursor-not-allowed"
              type="text"
              placeholder="Enter title here"
              value={snippet.title}
              disabled
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          
        </div>
        
        <div className="relative">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="content" className="block text-sm font-medium text-gray-300">
              Content
            </label>
            <button 
              onClick={copyToClipboard}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-all ${
                copySuccess 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
              }`}
              title="Copy to clipboard"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {copySuccess ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M5 13l4 4L19 7" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
                  />
                )}
              </svg>
              <span className="text-xs font-medium">
                {copySuccess ? "Copied!" : "Copy"}
              </span>
            </button>
          </div>
          <textarea
            id="content"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-mono text-sm text-white cursor-not-allowed"
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
      
      <div className="text-sm text-gray-500 text-center">
        All snippets are saved automatically to your local storage
      </div>
    </div>
  </div>
);
};

export default ViewSnippet;
