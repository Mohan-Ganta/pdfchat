import React, { useState } from "react";
import { Document, Page } from "react-pdf";

export default function PDFviewer(props) {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const { pdf } = props;
  console.info(pdf, pdf);
  return (
    <div className="flex flex-1 h-full">
      <iframe
        src={pdf}
        className="w-full h-[-webkit-fill-available] rounded-sm bg-white text-gray"
      ></iframe>

      {/* 
      <Document
        file={pdf}
        options={{ workerSrc: "/pdf.worker.js" }}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document> 
      */}
    </div>
  );
}
