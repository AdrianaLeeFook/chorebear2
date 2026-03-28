import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/*reminder to edit app.jsx to actually route here, it was missing as of finishing this page */

const Homes = () => {
  //temporary house names, pull from database using active user
  const [homes, setHomes] = useState([
    { id: '1', name: 'mojo dojo casa house' },
    { id: '2', name: 'building 11 apt C' }
  ]);
  //temporary username for now
  const mockUser = { name: "jessica" };

  return (
    //background color
    <div className="min-h-screen bg-[#d8c7b3] p-6 font-sans">
      
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        
        {/*Left side*/}
        <div className="md:w-2/5 flex flex-col items-center">
          {/* profile pic like in figma */}
          <img 
            //need to decide how to handle images right under this comment vvv
            className="w-64 h-64 rounded-full object-cover mb-4 border-2 border-[#a18a7c]/20 shadow-inner"
          />
          <h2 className="text-3xl font-semibold text-[#5c4b3f] mb-1">{mockUser.name}</h2>
          
          <button className="text-sm text-[#5c4b3f] underline hover:text-[#a18a7c]">
            edit profile
          </button>
        </div>

        {/*Right side*/}
        <div className="md:w-3/5 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-semibold text-[#5c4b3f]">my homes</h1>
          </div>
          
          {/*houses displayed here, edit after mongo is working*/}
          <div className="space-y-4 mb-8">
            {homes.map((home) => (
              <div 
                key={home.id} 
                // entries for each home here
                className="p-4 bg-[#d8b4a8] rounded-xl flex justify-center items-center h-16 shadow-sm"
              >
                <span className="text-xl text-[#5c4b3f] font-medium">{home.name}</span>
              </div>
            ))}
          </div>

          {/*Buttons*/}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              //edit button
              to="/EditMyHomes" 
              className="flex-1 bg-[#a3b1a2] text-[#5c4b3f] text-sm font-medium py-2 px-4 rounded-full text-center shadow hover:brightness-95 transition duration-200"
            >
              edit my homes
            </Link>
            <Link 
              //join button
              to="/JoinHome" 
              className="flex-1 bg-[#a3b1a2] text-[#5c4b3f] text-sm font-medium py-2 px-4 rounded-full text-center shadow hover:brightness-95 transition duration-200"
            >
              join a home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Homes;