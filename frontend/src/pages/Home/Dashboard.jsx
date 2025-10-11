import React, { useEffect, useState, useContext, lazy, Suspense } from "react";
import { HashLoader } from 'react-spinners';
import { LuPlus, LuLaptop } from "react-icons/lu";
import { BsChat, BsChatDots, BsChatDotsFill, BsChatHeartFill, BsChatLeft, BsRecordCircle } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CARD_BG } from "./Utils/data.js";
import toast from "react-hot-toast";
import DashboardLayout from "./Components/DashboardLayout.jsx";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../constants/apiPaths.js";
import SummaryCard from "./Cards/SummaryCard.jsx";
import moment from "moment";
import Modal from "../Preparation/Components/Modal.jsx";
import RecordTypeModal from "./Components/RecordTypeModal.jsx";
import { UserContext } from "../../context/userContext.jsx";

// Lazy load modal components
const CreateSessionForm = lazy(() => import("../Preparation/CreateSessionForm.jsx"));
const DeleteAlertContent = lazy(() => import("../Preparation/Components/DeleteAlertContent.jsx"));
const ResumeLinkModal = lazy(() => import("../Resume/Modal/ResumeLinkModal.jsx"));

const LoadingSpinner = () => (
  <div
    style={{
      background: 'transparent',
      minHeight: '100px',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <HashLoader color="#2e2e2eff" />
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openResumeModal, setOpenResumeModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });
  const [openRecordTypeModal, setOpenRecordTypeModal] = useState(false);

  const handleResumeClick = () => {
    // Always open the modal first to show edit options
    setOpenResumeModal(true);
  };

  const fetchAllSessions = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.SESSION.GET_ALL);
      setSessions(response.data);
    } catch (error) {
      console.error("Error fetching session data:", error);
    }
  };

  const deleteSession = async (sessionData) => {
    try {
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));

      toast.success("Session Deleted Successfully");
      setOpenDeleteAlert({
        open: false,
        data: null,
      });
      fetchAllSessions();
    } catch (error) {
      console.error("Error deleting session data:", error);
    }
  };

  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4 overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-1 pb-3 px-1 md:px-10 md:ml-10">
          {sessions?.map((data, index) => (
            <SummaryCard
              key={data?._id}
              colors={CARD_BG[index % CARD_BG.length]}
              role={data?.role || ""}
              topicsToFocus={data?.topicsToFocus || ""}
              experience={data?.experience || "-"}
              questions={data?.questions?.length || "-"}
              description={data?.description || ""}
              lastUpdated={
                data?.updatedAt
                  ? moment(data.updatedAt).format("Do MMM YYYY")
                  : ""
              }
              onSelect={() => navigate(`/interview-prep/${data?._id}`)}
              onDelete={() => setOpenDeleteAlert({ open: true, data })}
            />
          ))}
        </div>

        <div className="fixed bottom-6 sm:bottom-10 md:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-4">
          <div className="bg-black/10 backdrop-blur-md p-2 rounded-full flex gap-2 sm:gap-3 border border-gray-200/50">
            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-black rounded-full transition-colors cursor-pointer px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold"
              onClick={() => setOpenCreateModal(true)}
              title="Session"
            >
              <LuPlus className="text-lg sm:text-xl text-black" />
              <span className="hidden sm:inline">Session</span>
            </button>
            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-black rounded-full transition-colors cursor-pointer px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold"
              onClick={() => setOpenRecordTypeModal(true)}
              title="Record"
            >
              <BsRecordCircle className="text-lg sm:text-xl text-black" />
              <span className="hidden sm:inline">Record</span>
            </button>
            <RecordTypeModal
              isOpen={openRecordTypeModal}
              onClose={() => setOpenRecordTypeModal(false)}
              onSelect={(type) => {
                setOpenRecordTypeModal(false);
                if (type === "hr") {
                  navigate("/interview/hr/record");
                } else if (type === "session") {
                  navigate("/interview/session-interview");
                }
              }}
            />
            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-black rounded-full transition-colors cursor-pointer px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold"
              onClick={handleResumeClick}
              title={user?.resumeLink ? "Manage Resume" : "Add Resume Link"}
            >
              <IoDocumentTextOutline className="text-lg sm:text-xl text-black" />
              <span className="hidden sm:inline">{user?.resumeLink ? "Resume" : "Add Resume"}</span>
            </button>

            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-black rounded-full transition-colors cursor-pointer px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold"
            >
              <BsChatDots className="text-lg sm:text-xl text-black" />
            </button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openCreateModal}
        onClose={() => {
          setOpenCreateModal(false);
        }}
        hideHeader
      >
        <div>
          <Suspense fallback={<LoadingSpinner />}>
            <CreateSessionForm />
          </Suspense>
        </div>
      </Modal>

      <Modal
        isOpen={openResumeModal}
        onClose={() => {
          setOpenResumeModal(false);
        }}
        hideHeader
        isDark={true}
      >
        <Suspense fallback={<LoadingSpinner />}>
          <ResumeLinkModal
            onClose={() => setOpenResumeModal(false)}
            onSave={() => {
              // Resume link saved, modal will close automatically
            }}
          />
        </Suspense>
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <Suspense fallback={<LoadingSpinner />}>
            <DeleteAlertContent
              content="Are you sure you want to delete this session detail?"
              onDelete={() => deleteSession(openDeleteAlert.data)}
            />
          </Suspense>
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
