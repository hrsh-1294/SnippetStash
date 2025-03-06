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
  console.log(snippets);

  //for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const dispatch = useDispatch();

  const filteredData = snippets.filter((snippet) =>
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(snippetId) {
    dispatch(removeFromSnippets(snippetId));
  }
  const handleShareClick = () => {
    setShowShareModal(!showShareModal); // Toggle modal visibility
  };

  return (
    <div>
      <input
        className="p-2 rounded-2xl min-w-[600px] mt-5"
        type="search"
        placeholder="Search here.."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="flex flex-col gap-5 mt-5">
        {filteredData.length > 0 &&
          filteredData.map((snippet) => {
            const shareUrl = `https://45ff-2405-201-5808-481e-6d71-3e6b-38ae-10ea.ngrok-free.app/snippet/${snippet._id}`;
            const shareTitle = snippet.title;

            return (
              <div className="border" key={snippet?.title}>
                <div>{snippet.title}</div>
                <div>{snippet.content}</div>
                <div className="flex flex-row gap-4 place-content-evenly">
                  <button>
                    <Link to={`/?snippetId=${snippet?._id}`}>
                      Edit
                    </Link>
                  </button>
                  <button>
                      <Link to={`/snippets/${snippet?._id}`}>View</Link>
                  </button>
                  <button onClick={() => handleDelete(snippet?._id)}>
                    Delete
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(snippet?.content);
                      toast.success("Copied to Clipboard!");
                    }}
                  >
                    Copy
                  </button>

                  <button
                    onClick={handleShareClick}
                  >
                    Share
                  </button>
                  {showShareModal && (
                    <div className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-600 p-6 rounded-lg shadow-lg z-50">
                      <div className="text-center font-bold text-lg mb-4">Share this Snippet</div>
                      <div className="flex flex-row gap-3">
                        <FacebookShareButton url={shareUrl} quote={shareTitle}>
                          <FacebookIcon size={40} round={true} />
                        </FacebookShareButton>

                        <TwitterShareButton url={shareUrl} title={shareTitle}>
                          <TwitterIcon size={40} round={true} />
                        </TwitterShareButton>

                        <WhatsappShareButton url={shareUrl} title={shareTitle}>
                          <WhatsappIcon size={40} round={true} />
                        </WhatsappShareButton>

                        <LinkedinShareButton url={shareUrl} title={shareTitle}>
                          <LinkedinIcon size={40} round={true} />
                        </LinkedinShareButton>
                      </div>
                     
                      <button
                        onClick={handleShareClick}
                        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>

                <div>{snippet.createdAt}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Snippet;
