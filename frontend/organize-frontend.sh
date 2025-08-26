#!/bin/bash

# Create folders
mkdir -p src/assets
mkdir -p src/components/Cards
mkdir -p src/components/Loader
mkdir -p src/components/Modal
mkdir -p src/components/Inputs
mkdir -p src/components/Navbar
mkdir -p src/components/Drawer
mkdir -p src/components/Button
mkdir -p src/layouts
mkdir -p src/pages/InterviewPrep/hooks
mkdir -p src/pages/InterviewPrep/components
mkdir -p src/pages/ResumeView
mkdir -p src/pages/Admin/components
mkdir -p src/pages/Auth
mkdir -p src/pages/Home
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/constants

# Move assets
mv src/*.svg src/assets/ 2>/dev/null
mv src/*.png src/assets/ 2>/dev/null

# Move atomic components
mv src/components/StatsCard.jsx src/components/Cards/ 2>/dev/null
mv src/components/ChartCard.jsx src/components/Cards/ 2>/dev/null
mv src/components/SkeletonLoader.jsx src/components/Loader/ 2>/dev/null
mv src/components/ResumeLinkModal.jsx src/components/Modal/ 2>/dev/null
mv src/components/PdfViewModal.jsx src/components/Modal/ 2>/dev/null
mv src/components/Input.jsx src/components/Inputs/ 2>/dev/null
mv src/components/Select.jsx src/components/Inputs/ 2>/dev/null
mv src/components/Navbar.jsx src/components/Navbar/ 2>/dev/null
mv src/components/LearnMoreDrawer.jsx src/components/Drawer/ 2>/dev/null
mv src/components/Button.jsx src/components/Button/ 2>/dev/null

# Move layouts
mv src/components/DashboardLayout.jsx src/layouts/ 2>/dev/null

# Move InterviewPrep page and its hooks/components
mv src/pages/InterviewPrep.jsx src/pages/InterviewPrep/InterviewPrep.jsx 2>/dev/null
mv src/pages/InterviewPrep/hooks/* src/pages/InterviewPrep/hooks/ 2>/dev/null
mv src/pages/InterviewPrep/components/* src/pages/InterviewPrep/components/ 2>/dev/null

# Move ResumeView page
mv src/pages/ResumeViewPage.jsx src/pages/ResumeView/ResumeViewPage.jsx 2>/dev/null

# Move Admin page and its components
mv src/pages/AdminDashboard.jsx src/pages/Admin/AdminDashboard.jsx 2>/dev/null
mv src/pages/UsersTab.jsx src/pages/Admin/UsersTab.jsx 2>/dev/null
mv src/pages/SessionsTab.jsx src/pages/Admin/SessionsTab.jsx 2>/dev/null
mv src/pages/QuestionsTab.jsx src/pages/Admin/QuestionsTab.jsx 2>/dev/null
mv src/pages/AdminUI.jsx src/pages/Admin/components/AdminUI.jsx 2>/dev/null

# Move Auth pages
mv src/pages/Login.jsx src/pages/Auth/Login.jsx 2>/dev/null
mv src/pages/SignUp.jsx src/pages/Auth/SignUp.jsx 2>/dev/null

# Move Home pages
mv src/pages/CreateSessionForm.jsx src/pages/Home/CreateSessionForm.jsx 2>/dev/null

# Move context, hooks, utils, constants
mv src/userContext.jsx src/context/UserContext.jsx 2>/dev/null
mv src/themeContext.jsx src/context/ThemeContext.jsx 2>/dev/null
mv src/hooks/* src/hooks/ 2>/dev/null
mv src/utils/api.js src/utils/ 2>/dev/null
mv src/utils/formatDate.js src/utils/ 2>/dev/null
mv src/utils/apiPaths.js src/constants/ 2>/dev/null
mv src/utils/roles.js src/constants/ 2>/dev/null

# Move LandingPage and Dashboard to top-level
mv src/pages/LandingPage.jsx src/LandingPage.jsx 2>/dev/null
mv src/pages/Dashboard.jsx src/Dashboard.jsx 2>/dev/null

# Clean up empty folders
find src -type d -empty -delete

echo "✅ Folder reorganization complete!"
echo "⚠️  Now update all import paths in your codebase to match the new structure."