import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeFromSnippets } from "../redux/snippetSlice.js";
import toast from "react-hot-toast";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import { Link } from 'react-router-dom';

const Snippet = () => {
  const snippets = useSelector((state) => state.snippet.snippets);
  const [searchTerm, setSearchTerm] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeSnippetId, setActiveSnippetId] = useState(null);
  const dispatch = useDispatch();

  const filteredData = snippets.filter((snippet) =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(snippetId) {
    dispatch(removeFromSnippets(snippetId));
    toast.success("Snippet deleted successfully!");
  }

  const handleShareClick = (snippetId) => {
    setActiveSnippetId(snippetId);
    setShowShareModal(true);
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setActiveSnippetId(null);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="w-full min-h-screen bg-gray-900 text-gray-200 pt-4 pb-8">
     
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="mb-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Your Snippets</h1>
            <p className="text-gray-400 mb-6">Manage and search your code snippets</p>
            
            <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            className="block w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all outline-none text-white"
            type="search"
            placeholder="Search snippets by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
            </div>
          </div>

          {filteredData.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-400">No snippets found. Create one from the home page!</p>
            </div>
          ) : (
            
            <div className="flex flex-wrap justify-center gap-6">
          {filteredData.map((snippet) => {
              const shareUrl = `https://snippet-stash-eq4f.vercel.app/snippet/${snippet._id}`;
              const shareTitle = snippet.title;

              return (
                <div 
                  key={snippet._id} 
                  className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all h-full flex flex-col"
                >
                  <div className="p-5 flex-grow flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-2 line-clamp-1">{snippet.title}</h2>
                    
                    <div className="bg-gray-700 rounded-lg p-4 mb-4 overflow-x-auto flex-grow">
                      <pre className="text-sm text-gray-300 font-mono whitespace-pre-wrap">
                        {snippet.content.length > 150 
                          ? `${snippet.content.substring(0, 150)}...` 
                          : snippet.content}
                      </pre>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto">
                      <div className="flex items-center text-gray-500 mb-2 sm:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">{formatDate(snippet.createdAt)}</span>
                      </div>
                      
                      <div className="flex space-x-2 justify-end">
                        <Link 
                          to={`/?snippetId=${snippet._id}`}
                          className="p-2 bg-black text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        
                        <Link 
                          to={`/snippets/${snippet._id}`}
                          className="p-2 bg-black text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                          title="View"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(snippet.content);
                            toast.success("Copied to Clipboard!");
                          }}
                          className="p-2 bg-black text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                          title="Copy to clipboard"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleShareClick(snippet._id)}
                          className="p-2 bg-black text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
                          title="Share"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                          </svg>
                        </button>
                        
                        <button
                          onClick={() => handleDelete(snippet._id)}
                          className="p-2 bg-black text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-lg transition-all"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && activeSnippetId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Share Snippet</h3>
            
            <div className="flex justify-center space-x-4 mb-6">
              <FacebookShareButton url={`https://snippet-stash-eq4f.vercel.app/snippet/${activeSnippetId}`} quote={filteredData.find(s => s._id === activeSnippetId)?.title}>
                <FacebookIcon size={45} round={true} />
              </FacebookShareButton>

              <TwitterShareButton url={`https://snippet-stash-eq4f.vercel.app/snippet/${activeSnippetId}`} title={filteredData.find(s => s._id === activeSnippetId)?.title}>
                <TwitterIcon size={45} round={true} />
              </TwitterShareButton>

              <WhatsappShareButton url={`https://snippet-stash-eq4f.vercel.app/snippet/${activeSnippetId}`} title={filteredData.find(s => s._id === activeSnippetId)?.title}>
                <WhatsappIcon size={45} round={true} />
              </WhatsappShareButton>

              <LinkedinShareButton url={`https://snippet-stash-eq4f.vercel.app/snippet/${activeSnippetId}`} title={filteredData.find(s => s._id === activeSnippetId)?.title}>
                <LinkedinIcon size={45} round={true} />
              </LinkedinShareButton>
            </div>
            
            <div className="text-center">
              <button
                onClick={closeShareModal}
                className="px-5 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Snippet;