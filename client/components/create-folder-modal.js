import { useEffect, useState } from "react";

import useRequest from "../hooks/use-request";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";
import StyledFolderModal from "../styles/create-folder-modal";

export const BigCreateFolderModal = ({
  currentUser,
  theme,
  setShowCreateFolderModal,
  size
}) => {
  const [title, setTitle] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/folders",
    method: "post",
    body: {
      title,
    },
    onSuccess: (folder) =>
    Router.push("/users/[user]/folders/[folderId]", `users/${currentUser.name}/folders/${folder.id}`),
  });

  const submit = async () => {
    await doRequest();
  }
  return (
    <div className="modal-overlay">
      <StyledFolderModal size={size}>
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
        {errors}
      </StyledFolderModal>
    </div>
  );
};

