import React, { useState } from 'react';
import { Link } from 'react-router-dom';

/*the routing for this page is really weird and mismatched on app.jsx, set it up however you want to please*/

const EditHomes = () => {
  //replace these with stuff from mongodb
  const [homes, setHomes] = useState([
    {
      id: '1', /*database id*/
      name: 'mojo dojo casa house', /*house name*/
      code: '19241', /*house code*/
      createdby: 'jessica', /*house creator/admin*/
      members: [ /*people in house, replace photo placeholder with whatever we decide to use*/
        { id: 'm1', name: 'lexi', photo: '[ph]' },
        { id: 'm2', name: 'freddy', photo: '[ph]' },
        { id: 'm3', name: 'katie', photo: '[ph]' },
        { id: 'm4', name: 'jessica', photo: '[ph]' },
      ],
      chores: [
        { id: 'c1', name: 'wash dishes', icon: '[ph]' },
        { id: 'c2', name: 'clean bathroom', icon: '[ph]' },
        { id: 'c3', name: 'mop floor', icon: '[ph]' },
        { id: 'c4', name: 'take out trash', icon: '[ph]' },
        { id: 'c5', name: 'sweep floor', icon: '[ph]' },
        { id: 'c6', name: 'wash towels', icon: '[ph]' },
        { id: 'c7', name: 'wipe counters', icon: '[ph]' },
      ]
    },
    { /*second entry just for demo*/
      id: '2',
      name: 'building 11 apt C',
      code: '82749',
      createdby: 'sarah',
      members: [
        { id: 'm4', name: 'jessica', avatar: '[ph]' },
        { id: 'm5', name: 'sarah', avatar: '[ph]' },
      ],
      chores: [
        { id: 'c8', name: 'vacuum living room', icon: '[ph]' },
        { id: 'c9', name: 'water plants', icon: '[ph]' },
      ]
    }
  ]);

  //shows which home is currently expanded into view
  const [expandedHomeId, setExpandedHomeId] = useState('1');

  //allows us to edit the home name on page
  const [editingHomeId, setEditingHomeId] = useState(null);
  const [editNameValue, setEditNameValue] = useState('');

  //helpers for when we integrate express to actually delete entries or to change ownership
  //need to add to these once its ready
  const handleEditHomeName = (homeId, newName) => {
    console.log(`Updating home ${homeId} name to ${newName}`);
    //updates the page with changes immediately
    setHomes(prevHomes =>
      prevHomes.map(home =>
        home.id === homeId ? { ...home, name: newName } : home
      )
    );
    //closes input
    setEditingHomeId(null);
  };

  const handleDeleteChore = (homeId, choreId) => {
    console.log(`Delete chore ${choreId} from home ${homeId}`);
  };

  const handleRemoveMember = (homeId, memberId) => {
    console.log(`Remove member ${memberId} from home ${homeId}`);
  };

  const handleTransferOwnership = (homeId, newOwnerName) => {
    console.log(`Promoting ${newOwnerName} to owner of home ${homeId}`);

    //Update the page
    setHomes(prevHomes => 
      prevHomes.map(home => 
        home.id === homeId ? { ...home, createdBy: newOwnerName } : home
      )
    );
  };

  const handleDeleteHome = (homeId) => {
    console.log(`Deleting home ${homeId} from database`);

    //Update the page
    setHomes(prevHomes => prevHomes.filter(home => home.id !== homeId));
    
    //Collapses window after deletion
    if (expandedHomeId === homeId) {
      setExpandedHomeId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#d8c7b3] p-6 font-sans flex flex-col items-center">

      {/*content body*/}
      <div className="w-full max-w-3xl flex flex-col gap-6 mb-12">
        {homes.map((home) => {
          const isExpanded = expandedHomeId === home.id;

          //Collapsed window
          if (!isExpanded) {
            return (
              <div 
                key={home.id}
                onClick={() => setExpandedHomeId(home.id)}
                className="bg-[#fcf8f2] rounded-2xl p-6 shadow-sm flex justify-between items-center cursor-pointer hover:bg-[#f5ebd9] transition border border-[#e8dccb]"
              >
                <h2 className="text-2xl font-semibold text-[#5c4b3f]">{home.name}</h2>
                <span className="text-[#a18a7c] text-xl">v</span>
              </div>
            );
          }

          //Expanded Window
          return (
            <div key={home.id} className="bg-[#fcf8f2] rounded-2xl p-8 shadow-sm border border-[#e8dccb]">
              
              {/*House name and code*/}
               <div className="flex justify-between items-start mb-8">
                <div>
                  {editingHomeId === home.id ? (
                    <div className="flex items-center gap-3">
                      <input
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        className="text-3xl font-semibold text-[#5c4b3f] bg-white border border-[#a18a7c] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#a18a7c] w-64"
                        autoFocus
                      />
                      {/*save changes*/}
                      <button 
                        onClick={() => handleEditHomeName(home.id, editNameValue)}
                        className="text-sm text-green-700 hover:underline mt-1 font-medium"
                      >
                        save
                      </button>
                      {/*cancel*/}
                      <button 
                        onClick={() => setEditingHomeId(null)}
                        className="text-sm text-red-600/70 hover:underline mt-1 font-medium"
                      >
                        cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-semibold text-[#5c4b3f]">{home.name}</h2>
                      <button 
                        onClick={() => {
                          setEditingHomeId(home.id);
                          setEditNameValue(home.name);
                        }}
                        className="text-sm text-[#a18a7c] underline hover:text-[#5c4b3f] mt-1"
                      >
                        edit name
                      </button>
                    </div>
                  )}
                </div>
                <div className="text-[#5c4b3f] font-medium">
                  code: {home.code}
                </div>
              </div>

              {/*house members*/}
              <div className="mb-10">
                <h3 className="text-xl text-[#5c4b3f] mb-4 flex items-center gap-2">
                  members <span className="text-sm text-[#a18a7c]"></span>
                </h3>
                <div className="flex flex-wrap gap-6">
                  {home.members.map(member => (
                    <div key={member.id} className="flex flex-col items-center w-20">
                      <img 
                        //src={member.photo}  - uncomment once images are implemented
                        //alt={member.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#a18a7c]/20 mb-2"
                      />
                      <span className="text-sm font-medium text-[#5c4b3f] mb-1">{member.name}</span>
                      <button 
                        onClick={() => handleRemoveMember(home.id, member.id)}
                        className="text-[10px] text-red-600/70 hover:underline mb-1"
                      >
                        remove
                      </button>
                      <button 
                        onClick={() => handleTransferOwnership(home.id, member.name)}
                        className="text-[10px] text-[#a18a7c] hover:underline text-center leading-tight"
                      >
                        transfer<br/>ownership {/*when this button is clicked just change the "created by" entry in the db to whoever is being promoted, or however else we decide to determine ownership*/ }
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/*Chores*/}
              <div className="mb-10">
                <h3 className="text-xl text-[#5c4b3f] mb-4 flex items-center gap-2">
                  chores <span className="text-sm text-[#a18a7c]"></span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {home.chores.map(chore => (
                    <div 
                      key={chore.id} 
                      className="bg-[#e4dbd1] px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-[#5c4b3f] font-medium border border-[#d1c5b8]"
                    >
                      <span>{chore.icon} {chore.name}</span>
                      <button 
                        onClick={() => handleDeleteChore(home.id, chore.id)}
                        className="ml-2 text-[#a18a7c] hover:text-red-500 font-bold"
                        aria-label="Delete chore"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  
                  <Link 
                    to="/AddAssignChores" 
                    className="bg-[#d8b4a8] px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-[#5c4b3f] font-medium shadow-sm hover:brightness-95 transition"
                  >
                    + add chores
                  </Link>
                </div>
              </div>

              {/*Save and Delete*/}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#a18a7c]/20">
                <button 
                  onClick={() => handleDeleteHome(home.id)}
                  className="text-red-600/80 hover:underline font-medium text-sm"
                >
                  delete home
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/*return to Homes*/}
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

export default EditHomes;