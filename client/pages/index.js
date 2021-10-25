import axios from "axios";

const LandingPage = ({ currentUser }) => {
  console.log(currentUser);
  axios.get("/api/auth/currentuser").catch((err) => {
    console.log(err.message);
  });

  return <h1>Landing Page</h1>;
};

export default LandingPage;