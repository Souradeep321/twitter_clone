import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";


import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import { Toaster } from 'react-hot-toast'
import { useMutation, useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";


function App() {
	const { data: authUser, isLoading } = useQuery({
		// we use querykey to give a unique name to our query and refer to it later
		queryKey: ["authUser"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/v1/auth/me");
				const data = await res.json();

				if(data.error) return null // if user is not logged in or unauthaorized
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				console.log("Authuser is here :", data);
				return data
			} catch (error) {
				throw new Error(error);
			}
		}, 
		retry: false,
	});


	if (isLoading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<LoadingSpinner size="lg" />
			</div>
		)
	}

	console.log('authUser', authUser)


	return (
		<div className='flex max-w-6xl mx-auto'>
			{/* Common Components */}
			{authUser && <Sidebar />}
			<Routes>
				<Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
				<Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
				<Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
				<Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login" />} />
				<Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
			</Routes>
			{authUser && <RightPanel />} 
			{/* Common Components */}
			<Toaster />
		</div>
	);
}

export default App;
