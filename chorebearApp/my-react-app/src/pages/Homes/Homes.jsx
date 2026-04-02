import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Homes = () => {
  //login 
  const { user, setHouse } = useAuth();

  //dummy user for testing back end stuff on my end
  /*const user = {
    _id: "69ce747430b739de32dbba9d", 
    username: "TestUser"
  };*/

  const navigate = useNavigate();
  const [homes, setHomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  //Fetch user's homes when the component starts or if the user changes
  useEffect(() => {
    const fetchUserHomes = async () => {
      //shouldnt ever see this with the protected pages thing
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        //make sure the port number is correct!!! 8080 is how my local setup is
        const res = await fetch(`http://localhost:8080/api/memberships/user/${user._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
            //token stuff but we are probably not doing this method, delete later
            //"Authorization": `Bearer ${localStorage.getItem("token")}` 
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch your homes');
        }

        const memberData = await res.json();
        
        //backend returns Memberships. extract 'house' object from each membership.
        const houseData = memberData
          .map(membership => membership.house)
          //filter out null values just in case
          .filter(house => house !== null); 

        setHomes(houseData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserHomes();
  }, [user]);



  const handleSelectHome = (home) => {
    //setHouse(home);
    navigate('/dashboard');
  };

  //username display
  const displayName = user?.username;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5ede3] p-6 font-sans">
      
      {/*main div to orient everything*/}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-10">
        
        {/*username and settings link*/}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl font-semibold text-[#5c4b3f] mb-1">{displayName}</h2>
          <Link 
            to="/settings"
            className="text-sm text-[#5c4b3f] underline hover:text-[#a18a7c]"
          >
            Settings
          </Link>
        </div>

        {/*home main section*/}
        <div className="flex flex-col items-center w-full max-w-md">
          <h1 className="text-4xl font-semibold text-[#5c4b3f] mb-6">my homes</h1>
          
          {/*List of homes*/}
          <div className="space-y-4 mb-8 w-full text-center">
            {isLoading ? (
              <div className="p-4 text-[#5c4b3f]/70 italic">Loading your homes...</div>
            ) : error ? (
              <div className="p-4 text-red-500 italic">{error}</div>
            ) : homes.length > 0 ? (
              homes.map((home) => (
                <button 
                  key={home._id}
                  onClick={() => handleSelectHome(home)}
                  className="p-4 bg-[#d8b4a8] rounded-xl flex justify-center items-center min-h-[4rem] shadow-sm w-full hover:brightness-95 transition cursor-pointer"
                >
                  <span className="text-xl text-[#5c4b3f] font-medium">{home.name}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-[#5c4b3f]/70 italic">
                You haven't joined any homes yet.
              </div>
            )}
          </div>

          {/*edit/create buttons*/}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link 
              to="/homes/edit" 
              className="flex-1 bg-[#a3b1a2] text-[#5c4b3f] text-sm font-medium py-2 px-4 rounded-full text-center shadow hover:brightness-95 transition duration-200"
            >
              edit my homes
            </Link>
            <Link 
              to="/JoinOrCreateHome" 
              className="flex-1 bg-[#a3b1a2] text-[#5c4b3f] text-sm font-medium py-2 px-4 rounded-full text-center shadow hover:brightness-95 transition duration-200"
            >
              join or create home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Homes;