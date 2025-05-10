import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addToSnippets, updateToSnippets } from "../redux/snippetSlice.js";

const Home = () => {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [copySuccess, setCopySuccess] = useState(false);
  const snippetId = searchParams.get("snippetId");

  const dispatch = useDispatch();
  const allSnippets = useSelector((state) => state.snippet.snippets);

  useEffect(() => {
    if (snippetId) {
      const snippet = allSnippets.find((s) => s._id === snippetId);
      setTitle(snippet.title);
      setValue(snippet.content);
    }
  }, [snippetId]);

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
    <div className="w-full min-h-screen bg-gray-900 text-gray-200 py-4 sm:py-6 md:py-8 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1 sm:mb-2">
            {snippetId ? "Update Snippet" : "Create New Snippet"}
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            {snippetId
              ? "Update your existing snippet below"
              : "Create and save your code snippets"}
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg sm:rounded-xl md:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-gray-700">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-full">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  id="title"
                  className="w-full flex-grow px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-white text-sm sm:text-base"
                  type="text"
                  placeholder="Enter title here"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <button
                  onClick={createSnippet}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap"
                >
                  {snippetId ? "Update Snippet" : "Create Snippet"}
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="content" className="block text-sm font-medium text-gray-300">
                Content
              </label>
              <button 
                onClick={copyToClipboard}
                className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-md transition-all ${
                  copySuccess 
                    ? "bg-green-600 text-white" 
                    : "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                }`}
                title="Copy to clipboard"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-3 w-3 sm:h-4 sm:w-4" 
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
              className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none font-mono text-xs sm:text-sm text-white"
              value={value}
              placeholder="Enter content here..."
              onChange={(e) => {
                setValue(e.target.value);
              }}
              rows={12}
              style={{ minHeight: "200px" }}
            />
          </div>
        </div>
        
        <div className="text-xs sm:text-sm text-gray-500 text-center px-2">
          All snippets are saved automatically to your local storage
        </div>
      </div>
    </div>
  );
};

export default Home;