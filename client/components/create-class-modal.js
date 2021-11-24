import { useEffect, useState } from "react";
import styled from "styled-components";
import useRequest from "../hooks/use-request";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";

const StyledClassModal = styled.div`
    ${props => {if (props.size === "mobile") {
        return (
            "bottom: 0; left: 0; overflow-y: auto; position: fixed; right: 0; top: 0;")
    } else {
        return ("left: 50%; margin-bottom: 2.8125rem; margin-top: 2.8125rem; max-width: 100%; outline: none; position: relative; top: 0; transform: translateX(-50%); width: 37.5rem;")
    }
}}
z-index: 1101;
  box-shadow: 0 0.25rem 1rem 0 rgb(0 0 0 / 16%);
  background: ${({ theme }) => theme.classModalBg};
  border-radius: 0.25rem;
  & > header button.exit {
    all: unset;
    background-color: ${({ theme }) => theme.classModalExit};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: ${({ theme }) => {
      if (theme.classModalBg === "white") return "inset 0 0 0 3px #3b4c9b";
    }};
    color: white;
    padding: 0.5625rem;
  }
  & > header {
    background-color: ${({ theme }) => theme.classModalHeader};
    color: #fff;
    padding: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
& > header h3{
    margin-bottom: 0;
}
  }
  & > div.class-modal-body {
    padding: 2rem;
    position: relative;
  }
  & > div.class-modal-body input {
    all: unset;
    font-weight: normal;
    padding-bottom: 0.375rem;
    text-align: inherit;
    white-space: pre-wrap;
    width: 100%;
    word-break: break-word;
    border: none;
    border-bottom: 0.125rem solid ${({ theme }) => theme.classModalInputBorder};
    transition: all .12s cubic-bezier(.47,0,.745,.715);
    color: ${({ theme }) => theme.classModalInputColor};
  }
  & > div.class-modal-body input:focus {
    border-bottom: 0.25rem solid #ffdc62;
  }
  & > div.class-modal-body input::placeholder {
    font-weight: normal;
    color: ${({ theme }) => theme.classModalInputPlaceholder};
  }
  & > div.class-modal-body button:disabled {
    background-color: #d9dde8;
    cursor: default;
  }
  & > div.class-modal-body label {
    display: block;
    font-size: .75rem;
    font-weight: normal;
    letter-spacing: .0625rem;
    line-height: 1.333333333333333;
    margin-top: 0.625rem;
    text-align: inherit;
    text-transform: uppercase;
    color: ${({ theme }) => theme.classModalInputLabel};
    margin-bottom: 1.5rem;
  }
  & > div.class-modal-body button {
    border: none;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: .0625rem;
    line-height: 1.222222222222222;
    padding: 1.5rem 5rem;
    width: 100%;
    color: ${({ theme }) => theme.classModalBg};
    background-color: #3ccfcf;
    border-radius: 0.25rem;
  }
`;
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


