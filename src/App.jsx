import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import HomePage from "./pages/HomePage";
import ExplorePage from "./pages/ExplorePage";
import TrendsPage from "./pages/TrendsPage";
import ItineraryPage from "./pages/ItineraryPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="explore" element={<ExplorePage />} />
              <Route path="trends" element={<TrendsPage />} />
              <Route path="itinerary" element={<ItineraryPage />} />
              <Route path="feed" element={<FeedPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            <Route path="login" element={<LoginPage />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}
