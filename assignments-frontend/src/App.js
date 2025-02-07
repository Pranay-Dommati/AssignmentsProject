import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';
import HomePage from './components/HomePage';
import Navbar from './components/Navbar';
import AddAssignment from './components/AddAssignment';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlaceBid from './components/PlaceBid';
import AssignmentDetails from './components/AssignmentDetails';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import UserAssignments from './components/UserAssignments';
import PlacedBids from './components/PlacedBids';
import AssignmentBids from './components/AssignmentBids';

function App() {
  const assignments = [
    {
      id: 1,
      subject: "Mathematics Assignment",
      numPages: 10,
      minBid: 500,
      maxBid: 1000,
      locations: ["Location 1", "Location 2"],
      collegeOrSchool: "XYZ College",
    },
    {
      id: 2,
      subject: "Science Assignment",
      numPages: 5,
      minBid: 300,
      maxBid: 800,
      locations: ["Location 3", "Location 4"],
      collegeOrSchool: "ABC School",
    },
    {
      id: 3,
      subject: "English Literature",
      numPages: 8,
      minBid: 400,
      maxBid: 900,
      locations: ["Location 5", "Location 6"],
      collegeOrSchool: "DEF University",
    },
  ];

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add-assignment" element={<AddAssignment />} />
        <Route path="/place-bid" element={<PlaceBid />} />
        <Route path="/place-bid/:id" element={<AssignmentDetails assignments={assignments} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/my-assignments" element={<UserAssignments />} />
        <Route path="/placed-bids" element={<PlacedBids assignments={assignments} />} />
        <Route path="/assignment-bids/:id" element={<AssignmentBids />} />
      </Routes>
    </Router>
  );
}

export default App;