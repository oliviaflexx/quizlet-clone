import { useEffect, useState } from "react";

import useRequest from "../hooks/use-request";
import CloseIcon from "@mui/icons-material/Close";
import Router from "next/router";
import StyledSetInfoModal from "../styles/set-info-modal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const SetInfoModal = ({ set, setShowSetInfoModal }) => {
  return (
    <div className="modal-overlay">
      <StyledSetInfoModal>
        <header>
          <h3>Info</h3>
          <button onClick={() => setShowSetInfoModal(false)}>
            <CloseIcon />
          </button>
        </header>
        <div className="body">
          <div className="creator-info">
            <AccountCircleIcon />
            <Link href={`/user/${set.creatorName}`}>{set.creatorName}</Link>
          </div>
          <div className="infos">
              <div className="info">
                  <span></span>
              </div>
          </div>
        </div>
      </StyledSetInfoModal>
    </div>
  );
};