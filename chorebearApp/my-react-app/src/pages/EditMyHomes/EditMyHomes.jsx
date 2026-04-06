import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EditMyHomes = () => {
  const { user } = useAuth();
  
  const [homes, setHomes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  //name and code editing
  const [editName, setEditName] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');
  const [editCode, setEditCode] = useState(null);
  const [editCodeValue, setEditCodeValue] = useState('');

  useEffect(() => {
    const fetchHomesAndMembers = async () => {
      if (!user) return;
      
      try {
        const userMembershipsRes = await fetch(`http://localhost:8080/api/memberships/user/${user._id}`);
        const userMemberships = await userMembershipsRes.json();
        
        const houses = userMemberships.map(m => m.house).filter(Boolean);

        const homesWithMembers = await Promise.all(houses.map(async (house) => {
          const membersRes = await fetch(`http://localhost:8080/api/memberships/house/${house._id}`);
          const membersData = await membersRes.json();
          return { ...house, members: membersData }; 
        }));

        setHomes(homesWithMembers);
      } catch (err) {
        console.error("Error fetching homes:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomesAndMembers();
  }, [user]);

  //Notification creation, update this when you guys update notification model
  const createNotification = async (message) => {
    try {
      await fetch(`http://localhost:8080/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: user._id,
          message: message,
          createdAt: new Date()
        })
      });
    } catch (err) {
      console.error("Failed to create notification:", err);
    }
  };

  //handles updating either text fields
  const handleUpdateField = async (homeId, field, value) => {
    if (!value.trim()) return;

    try {
      const res = await fetch(`http://localhost:8080/api/houses/${homeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value.trim() })
      });

      if (res.ok) {
        setHomes(prevHomes =>
          prevHomes.map(home =>
            home._id === homeId ? { ...home, [field]: value.trim() } : home
          )
        );
        createNotification(`You updated the ${field === 'name' ? 'home name' : 'join code'} to "${value.trim()}"`);
      } else {
        alert(`Failed to save ${field}.`);
      }
    } catch (err) {
      console.error(`Failed to update ${field}`, err);
    }
  };

  //Change admin/owner function
  const handleTransferOwnership = async (homeId, newOwnerId, newOwnerName) => {
    if (!window.confirm(`Are you sure you want to make ${newOwnerName} the owner?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/houses/${homeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ createdBy: newOwnerId })
      });

      if (res.ok) {
        setHomes(prevHomes => 
          prevHomes.map(home => 
            home._id === homeId ? { ...home, createdBy: newOwnerId } : home
          )
        );
        createNotification(`Ownership transferred to ${newOwnerName}`);
      } else {
        alert("Failed to transfer ownership.");
      }
    } catch (err) {
      console.error("Failed to transfer ownership", err);
    }
  };

  //Delete Home
  const handleDeleteHome = async (homeId) => {
    if (!window.confirm("Are you sure you want to delete this home?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/houses/${homeId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setHomes(prevHomes => prevHomes.filter(home => home._id !== homeId));
        createNotification(`You successfully deleted a home`);
      } else {
        alert("Failed to delete the home.");
      }
    } catch (err) {
      console.error("Failed to delete home", err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#d8c7b3] flex items-center justify-center font-sans text-[#5c4b3f]">Loading homes...</div>;
  }

  return (
    <div className="min-h-screen bg-[#d8c7b3] p-6 font-sans flex flex-col items-center">

      <div className="w-full max-w-3xl flex flex-col gap-6 mb-12">
        {homes.length === 0 && (
          <div className="text-center text-[#5c4b3f] mt-10">You aren't in any homes yet.</div>
        )}

        {homes.map((home) => {
          //Checks if user is owner
          const isCurrentUserOwner = home.createdBy === user._id;

          return (
            <div key={home._id} className="bg-[#fcf8f2] rounded-2xl p-8 shadow-sm border border-[#e8dccb] flex flex-col">
              
              {/*Name section, buttons only visible if owner*/}
              <div className="mb-6">
                <span className="text-sm text-[#a18a7c] uppercase tracking-wider font-bold block mb-1">Home Name</span>
                {editName === home._id ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editNameValue}
                      onChange={(e) => setEditNameValue(e.target.value)}
                      className="text-2xl font-semibold text-[#5c4b3f] bg-white border border-[#a18a7c] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#a18a7c] w-64"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        handleUpdateField(home._id, 'name', editNameValue);
                        setEditName(null);
                      }}
                      className="text-sm text-green-700 hover:underline font-medium"
                    >
                      save
                    </button>
                    <button 
                      onClick={() => setEditName(null)}
                      className="text-sm text-red-600/70 hover:underline font-medium"
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold text-[#5c4b3f]">{home.name}</h2>
                    {isCurrentUserOwner && (
                      <button 
                        onClick={() => {
                          setEditName(home._id);
                          setEditNameValue(home.name);
                          setEditCode(null);
                        }}
                        className="text-sm text-[#a18a7c] underline hover:text-[#5c4b3f]"
                      >
                        edit name
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/*house code, editable by owner only*/}
              <div className="mb-8 pb-6 border-b border-[#e8dccb]">
                <span className="text-sm text-[#a18a7c] uppercase tracking-wider font-bold block mb-1">Join Code</span>
                {editCode === home._id ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editCodeValue}
                      onChange={(e) => setEditCodeValue(e.target.value.toUpperCase())}
                      className="text-lg font-bold text-[#5c4b3f] bg-white border border-[#a18a7c] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#a18a7c] w-32"
                      autoFocus
                    />
                    <button 
                      onClick={() => {
                        handleUpdateField(home._id, 'code', editCodeValue);
                        setEditCode(null);
                      }}
                      className="text-sm text-green-700 hover:underline font-medium"
                    >
                      save
                    </button>
                    <button 
                      onClick={() => setEditCode(null)}
                      className="text-sm text-red-600/70 hover:underline font-medium"
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="text-[#5c4b3f] font-bold text-lg bg-[#e4dbd1] px-3 py-1 rounded-md border border-[#d1c5b8]">
                      {home.code}
                    </div>
                    {isCurrentUserOwner && (
                      <button 
                        onClick={() => {
                          setEditCode(home._id);
                          setEditCodeValue(home.code);
                          setEditName(null);
                        }}
                        className="text-sm text-[#a18a7c] underline hover:text-[#5c4b3f]"
                      >
                        edit code
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/*house members*/}
              <div>
                <h3 className="text-sm text-[#a18a7c] uppercase tracking-wider font-bold mb-4">
                  Members
                </h3>
                <div className="flex flex-wrap gap-6">
                  {home.members.map((memberUser, index) => {
                    if (!memberUser) return null; 
                    
                    const isThisMemberTheOwner = home.createdBy === memberUser._id;

                    return (
                      <div key={memberUser._id || index} className="flex flex-col items-center w-16">
                        <span className="text-xs font-medium text-[#5c4b3f] truncate w-full text-center mb-1">
                          {memberUser.username}
                        </span>

                        {isThisMemberTheOwner ? (
                          <span className="text-[10px] font-bold text-[#a18a7c] tracking-wider uppercase bg-[#a18a7c]/10 px-2 py-0.5 rounded">
                            Owner
                          </span>
                        ) : (
                          isCurrentUserOwner && (
                            <button 
                              onClick={() => handleTransferOwnership(home._id, memberUser._id, memberUser.username)}
                              className="text-[10px] text-[#a18a7c] hover:text-[#5c4b3f] underline text-center leading-tight"
                            >
                              Make<br/>Owner
                            </button>
                          )
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/*home deltion*/}
              {isCurrentUserOwner && (
                <div className="mt-8 pt-4 border-t border-[#e8dccb] flex justify-end">
                  <button 
                    onClick={() => handleDeleteHome(home._id)}
                    className="text-sm text-red-600/80 hover:underline font-medium"
                  >
                    Delete Home
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/*back button*/}
      <div className="mt-auto">
        <Link 
          to="/Homes"
          className="bg-[#a3b1a2] text-[#5c4b3f] text-sm font-medium py-2 px-10 rounded-full text-center shadow hover:brightness-95 transition duration-200"
        >
          back
        </Link>
      </div>

    </div>
  );
};

export default EditMyHomes;