import CloseIcon from "@mui/icons-material/Close";
import StyledOptionsModal from "../styles/options-modal";
import { useMediaQuery } from "react-responsive";
const OptionsModal = ({
  setShowOptionsModal,
  setAnswerWith,
  setStarredTerms,
  starredTerms,
  answerWith
}) => {
    const isBigScreen = useMediaQuery({ query: "(min-width: 625px)" });
  return (
    <StyledOptionsModal size={isBigScreen ? "big" : "small"}>
      <div className="modal-overlay">
        <div className="setting-modal">
          <div className="header">
            <h1>Options</h1>
            <button onClick={() => setShowOptionsModal(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="body">
            <div className="setting-container">
              <p>STUDY STARRED</p>
              <button
                className={!starredTerms && "chosen"}
                onClick={() => setStarredTerms(false)}
              >
                All
              </button>
              <button
                className={starredTerms && "chosen"}
                onClick={() => setStarredTerms(true)}
              >
                Starred
              </button>
            </div>
            <div className="setting-container">
              <p>ANSWER WITH</p>
              <select onChange={(e) => setAnswerWith(e.target.value)}>
                <option
                  selected={answerWith === "terms" ? true : false}
                  value="terms"
                >
                  Term
                </option>
                <option
                  selected={answerWith === "definitions" ? true : false}
                  value="definitions"
                >
                  Definition
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </StyledOptionsModal>
  );
};

export default OptionsModal;