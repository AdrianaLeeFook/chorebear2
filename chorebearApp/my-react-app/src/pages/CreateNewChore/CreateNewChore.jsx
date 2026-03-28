import React from "react";
import EditSpecificChore from "../EditSpecificChore/EditSpecificChore";

// Reuses EditSpecificChore with a blank chore — same form, empty state
const emptyChore = {
  id: null,
  icon: "",
  title: "",
  description: "",
  time: null,
  repeating: false,
};

const CreateNewChore = () => <EditSpecificChore chore={emptyChore} />;

export default CreateNewChore;