import React, { useEffect, useState, useContext, lazy, Suspense } from "react";
import { LuPlus } from "react-icons/lu";
import { BsRecordCircle } from "react-icons/bs";
import { IoDocumentTextOutline } from "react-icons/io5";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import SummaryCard from "../../components/Cards/SummaryCard";
import moment from "moment";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/userContext";

// Lazy load modal components
const CreateSessionForm = lazy(() => import("./CreateSessionForm"));
const DeleteAlertContent = lazy(() => import("../../components/DeleteAlertContent"));
const ResumeLinkModal = lazy(() => import("../../components/ResumeLinkModal"));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
      <div className="container mx-auto pt-4 pb-4">
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
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-xs sm:text-sm font-semibold text-black px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
              onClick={() => setOpenCreateModal(true)}
            >
              <LuPlus className="text-lg sm:text-xl text-black" />
              Add
            </button>
            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-xs sm:text-sm font-semibold text-black px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
              onClick={() => navigate("/interview-prep/record")}
            >
              <BsRecordCircle className="text-lg sm:text-xl text-black" />
              Record
            </button>
            <button
              className="h-10 sm:h-12 flex items-center justify-center gap-2 bg-white text-xs sm:text-sm font-semibold text-black px-4 sm:px-5 py-2 rounded-full transition-colors cursor-pointer"
              onClick={handleResumeClick}
              title={user?.resumeLink ? "Manage Resume" : "Add Resume Link"}
            >
              <IoDocumentTextOutline className="text-lg sm:text-xl text-black" />
              {user?.resumeLink ? "Resume" : "Add Resume"}
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
          <CreateSessionForm />
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
        <ResumeLinkModal
          onClose={() => setOpenResumeModal(false)}
          onSave={() => {
            // Resume link saved, modal will close automatically
          }}
        />
      </Modal>

      <Modal
        isOpen={openDeleteAlert?.open}
        onClose={() => {
          setOpenDeleteAlert({ open: false, data: null });
        }}
        title="Delete Alert"
      >
        <div className="w-[30vw]">
          <DeleteAlertContent
            content="Are you sure you want to delete this session detail?"
            onDelete={() => deleteSession(openDeleteAlert.data)}
          />
        </div>
      </Modal>
    </DashboardLayout>
  );
};

export default Dashboard;
