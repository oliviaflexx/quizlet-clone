import styled from "styled-components";

const StyledFolderModal = styled.div`
  ${(props) => {
    if (props.size === "mobile") {
      return "bottom: 0; left: 0; overflow-y: auto; position: fixed; right: 0; top: 0;";
    } else {
      return "max-height: calc(100 vh - var(5rem) * 2); border-radius: 1rem; box-shadow: 0 0.25rem 1rem 0 #939bb414; margin: 5rem auto; overflow-y: hidden; position: relative; width: 40rem;";
    }
  }}
  display: flex;
  flex-direction: column;
  outline: none;
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
    ${(props) => {
      if (props.size === "mobile") {
        return "width: 100%; text-align: center;";
      }
    }}
  }
  & > div.bottom-folder button:disabled {
    background-color: #d9dde8;
    cursor: default;
  }
`;

export default StyledFolderModal;