import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Home/Components/Input.jsx";
import SpinnerLoader from "./Loader/SpinnerLoader.jsx";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../constants/apiPaths.js";
import { extractTextFromPdf } from "../../utils/FileParsers.js";
import { CloudUploadIcon, File02Icon } from "hugeicons-react";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    resumeText: "",  // Stores extracted text
    isResumeSession: false,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file.");
        return;
      }

      setResumeFile(file);
      setIsExtracting(true);
      setError("");

      try {
        const text = await extractTextFromPdf(file);
        setFormData(prev => ({ ...prev, resumeText: text, isResumeSession: true }));
      } catch (err) {
        console.error(err);
        setError("Failed to read PDF. Please try again.");
        setResumeFile(null);
      } finally {
        setIsExtracting(false);
      }
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsToFocus, resumeText } = formData;

    if ((!role || !experience || !topicsToFocus) && !resumeText) {
      setError("Please fill all the required fields or upload a resume.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      // Call AI API to generate questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus,
          numberOfQuestions: 10,
          resumeText: formData.resumeText
        }
      );

      // Should be array like [{question, answer}, ...]
      const generatedQuestions = aiResponse.data;

      const response = await axiosInstance.post(API_PATHS.SESSION.CREATE, {
        ...formData,
        description: formData.resumeText ? "Resume Integration Session" : "", // clear description or set default
        questions: generatedQuestions,
      });

      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data?.session?._id}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  return <div className="w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center">
    <h3 className="text-lg font-semibold text-black">
      Start a New Interview Journey
    </h3>
    <p className="text-xs text-slate-700 mt-[5px] mb-3">
      Fill out a few quick details for
      interview questions!
    </p>

    <form onSubmit={handleCreateSession} className="flex flex-col gap-3">
      <Input
        value={formData.role}
        onChange={({ target }) => handleChange("role", target.value)}
        label="Target Role"
        placeholder="(e.g., Frontend Developer, UI/UX Designer, etc.)"
        type="text"
      />

      <Input
        value={formData.experience}
        onChange={({ target }) => handleChange("experience", target.value)}
        label="Years of Experience"
        placeholder="(e.g., 1 year, 3 years, 5+ years)"
        type="number"
      />

      <Input
        value={formData.topicsToFocus}
        onChange={({ target }) => handleChange("topicsToFocus", target.value)}
        label="Topics to Focus On"
        placeholder="(Comma-separated, e.g., React, Node.js, MongoDB)"
        type="text"
      />


      <div className="bg-gray-50/50 border border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="cursor-pointer flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm border border-gray-100 shrink-0">
            {resumeFile ? <File02Icon className="text-emerald-500" /> : <CloudUploadIcon className="text-blue-500" />}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium text-gray-700">
              {resumeFile ? resumeFile.name : "Upload Resume (PDF)"}
            </div>
            <div className="text-xs text-gray-400">
              {isExtracting ? "Extracting text..." : (resumeFile ? "Ready to analyze" : "We'll tailor questions to your experience")}
            </div>
          </div>
        </label>
      </div>

      {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

      <button
        type="submit"
        className="btn-primary w-full mt-2"
        disabled={isLoading || isExtracting}
      >
        {isLoading && <SpinnerLoader color="white" size={15} />} Create Session
      </button>
    </form>
  </div>
};

export default CreateSessionForm;
