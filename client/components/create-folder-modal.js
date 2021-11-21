import { useEffect, useState } from "react";
import styled from "styled-components";
import useRequest from "../hooks/use-request";
import CloseIcon from "@mui/icons-material/Close";

const StyledFolderModal = styled.div`
  max-height: calc(100 vh - var(5rem) * 2);
  border-radius: 1rem;
  box-shadow: 0 0.25rem 1rem 0 #939bb414;
  display: flex;
  flex-direction: column;
  margin: 5rem auto;
  outline: none;
  overflow-y: hidden;
  position: relative;
  width: 40rem;
  background: ${({ theme }) => theme.folderModalBackground};
  z-index: 1200;
  & > button.exit {
    all: unset;
    color: ${({ theme }) => theme.folderExit};
    position: absolute;
    right: 15px;
    top: 15px;
    cursor: pointer;
  }
  & > div.top-folder {
    display: flex;
    flex-direction: column;
    margin: 2rem;
    text-align: left;
  }
  & > div.top-folder header {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.folderHeader};
  }
  & > div.top-folder input {
    all: unset;
    margin: 1rem 0 0;
    padding: 0.25rem 1rem;
    background-color: ${({ theme }) => theme.folderInputBg};
    color: ${({ theme }) => theme.folderHeader};
  }
  & > div.top-folder input::placeholder {
    color: ${({ theme }) => theme.folderPlaceholder};
    font-weight: normal;
  }
  & > div.top-folder input:focus {
    border-bottom: 0.125rem solid ${({ theme }) => theme.folderInputBorder};
  }
  & > div.bottom-folder {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 0.0625rem solid ${({ theme }) => theme.folderBottomBorder};
  }
  & > div.bottom-folder button {
    all: unset;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    background-color: #3ccfcf;
    cursor: pointer;
    color: ${({ theme }) => theme.folderCreateButton};
  }
  & > div.bottom-folder button:disabled {
    background-color: #d9dde8;
    cursor: default;
  }
`;
export const BigCreateFolderModal = ({
  currentUser,
  theme,
  setShowCreateFolderModal,
}) => {
  const { doRequest, errors } = useRequest({
    url: "/api/folders",
    method: "post",
    body: {
      title,
    },
    onSuccess: (folder) =>
      Router.push("/folders/[folderId]", `/folders/${folder.id}`),
  });

  const [title, setTitle] = useState("");

  const submit = async () => {
    await doRequest();
  }
  return (
    <div className="modal-overlay">
      <StyledFolderModal>
        <button
          className="exit"
          onClick={() => setShowCreateFolderModal(false)}
        >
          <CloseIcon />
        </button>
        <div className="top-folder">
          <header>Create a new folder</header>
          <input
            placeholder="Enter a title"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        <div className="bottom-folder">
          {!title ? (
            <button disabled>Create folder</button>
          ) : (
            <button onClick={submit}>Create folder</button>
          )}
        </div>
      </StyledFolderModal>
    </div>
  );
};


