import React from "react";
import { IoClose } from "react-icons/io5";

const getDirectPdfUrl = (url) => {
  // Google Drive view link: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // Preview link: https://drive.google.com/file/d/FILE_ID/preview
  const match = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (match) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  return url;
};

const PdfViewModal = ({ pdfUrl, onClose }) => {
  const directUrl = getDirectPdfUrl(pdfUrl);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm"
      style={{ animation: "fadeIn 0.2s" }}
    >
      <div className="relative w-[90vw] max-w-2xl h-[80vh] bg-black rounded-2xl shadow-2xl flex flex-col border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white text-black transition-all duration-200 cursor-pointer shadow"
          aria-label="Close"
        >
          <IoClose className="w-6 h-6" />
        </button>
        <iframe
          src={directUrl}
          title="PDF Viewer"
          className="flex-1 w-full h-full rounded-b-2xl border-none"
        />
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default PdfViewModal;
