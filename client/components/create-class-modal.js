import { useEffect, useState } from "react";

import useRequest from "../hooks/use-request";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";
import StyledClassModal from "../styles/create-class-modal";
export const CreateClassModal = ({
  currentUser,
  theme,
  setShowCreateClassModal,
  size
}) => {
  const [title, setTitle] = useState("");
  const [school, setSchool] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/classes",
    method: "post",
    body: {
      title,
      school,
    },
    onSuccess: (Class) =>
      Router.push("/classes/[classId]", `/classes/${Class.id}`),
  });

  const submit = async () => {
    await doRequest();
  };

  return (
    <div className="modal-overlay">
      <StyledClassModal size={size}>
        <header>
          <h3>Create a new class</h3>
          <button
            className="exit"
            onClick={() => setShowCreateClassModal(false)}
          >
            <CloseIcon />
          </button>
        </header>
        <div className="class-modal-body">
          <input
            placeholder="Enter class name"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
          <label>CLASS NAME</label>
          <input
            placeholder="Enter a school name"
            type="text"
            onChange={(e) => setSchool(e.target.value)}
          ></input>
          <label>SCHOOL NAME</label>
          {!title | !school ? (
            <button disabled>Create class</button>
          ) : (
            <button onClick={submit}>Create class</button>
          )}
          {errors}
        </div>
      </StyledClassModal>
    </div>
  );
};


