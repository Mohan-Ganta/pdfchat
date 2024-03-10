import { PhotoIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Fileupload(props) {
  const { setFileData, multiple = true } = props;
  const navigate = useNavigate();

  const uploadFileAndQuery = async (fileData) => {
    try {
      const formData = new FormData();
      formData.append("file", fileData);
      formData.append("filename", fileData.name); 
      
      // Upload file to Flask endpoint
      const uploadResponse = await fetch("http://localhost:8080/extract_text", {
        method: "POST",
        body: formData,
      });
      const uploadResult = await uploadResponse.json();
      
      console.log("Upload result:", uploadResult);
      
      // Navigate to chat page after successful upload
      navigate("/chat",
      
      { state: { fileName: fileData.name } });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="!w-[50vw] p-8 border rounded-3xl">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-black px-12 py-12">
            <div className="text-center">
              <PhotoIcon
                className="mx-auto h-12 w-12 text-green-700"
                aria-hidden="true"
              />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <div className="relative cursor-pointer rounded-md  font-semibold text-black focus-within:outline-none hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple={multiple}
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onload = () => {
                        setFileData(reader.result);
                        uploadFileAndQuery(file); // Call API after setting fileData
                      };
                    }}
                  />
                </div>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">PDF</p>
            </div>
          </div>
        </label>
      </div>
    </>
  );
}

export default Fileupload;
