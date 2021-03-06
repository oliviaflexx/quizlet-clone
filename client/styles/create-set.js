import styled from "styled-components";

const StyledCreateSet = styled.div`
  min-height: 100vh;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: center;

  background-color: ${({ theme }) => theme.createSetBg};
  > div.modal-overlay div.setting-modal {
    z-index: 1101;
    background-color: ${({ theme }) => theme.createSetOptionsBody};
    ${(props) => {
      if (props.size === "small") {
        return "bottom: 0; left: 0; overflow-y: auto; position: fixed; right: 0; top: 0;";
      } else {
        return "left: 50%; margin-bottom: 2.8125rem; margin-top: 2.8125rem; max-width: 100%; outline: none; position: relative; top: 0; transform: translateX(-50%); width: 37.5rem;";
      }
    }}
  }
  > div.modal-overlay div.setting-modal div.header {
    background-color: ${({ theme }) => theme.createSetOptionsHeader};
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    ${(props) => {
      if (props.size === "small") {
        return "padding: 0.625rem 1rem !important;";
      } else {
        return "padding: 2rem;";
      }
    }}
    > h1 {
      font-size: 1.625rem;
    }
    > button {
      all: unset;
      cursor: pointer;
    }
  }
  > div.modal-overlay div.setting-modal div.body {
    ${(props) => {
      if (props.size === "big") {
        return "display: flex; justify-content: space-around; padding: 2rem;";
      } else {
        return "padding: 1rem;";
      }
    }}
    > div.setting-container p {
      font-size: 0.625rem;
      font-weight: 600;
      letter-spacing: 0.0625rem;
      line-height: 1.3;
      color: ${({ theme }) => theme.createSetTermInputColor};
    }
    > div.setting-container select {
      outline: none;
      padding: 0.5rem 2.125rem 0.5rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      line-height: 1.333333333333333;
      cursor: pointer;
      display: block;
      background: none;
      border: none;
      border-radius: 0.25rem;
      color: #3ccfcf;
      border: 0.125rem solid
        ${({ theme }) => theme.createSetOptionsSelectBorder};
      background-color: ${({ theme }) => theme.createSetOptionsSelectBg};
      &:hover {
        color: #ffcd1f;
      }
    }
    > div.setting-container {
      margin-bottom: 2rem;
    }
  }
  > div.header {
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem 2.5rem;
    background-color: ${({ theme }) => theme.createSetHeaderBg};
    color: ${({ theme }) => theme.createSetHeaderTextColor};
  }
  > div.header div.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: -webkit-fill-available;
    max-width: 81.25em;
    ${(props) => {
      if (props.size === "small") {
        return "height: 2rem;";
      } else {
        return "height: 6.875rem;";
      }
    }}
  }
  > div.header div.top div.text h3 {
    font-size: 1.25rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0.25rem 0;
  }
  > div.header div.top div.text h4 {
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.285714285714286;
    color: ${({ theme }) => theme.createSetTermColor};
  }
  > div.header div.top button.create {
    all: unset;
    border-radius: 0.25rem;
    cursor: pointer;
    display: inline-block;
    font: inherit;
    font-size: 0.875rem;
    line-height: 1.285714285714286;
    max-width: 100%;
    padding: 0.75rem 1.5rem;
    width: auto;
    background-color: #3ccfcf;
    font-weight: normal;
    color: ${({ theme }) => theme.createSetHeaderButtonColor};
  }
  > div.header div.top div.small-create {
    color: ${({ theme }) => theme.createSetSmallButton};
    border-radius: 50%;
    padding: 0.375rem;
    width: 2rem;
    border: 0.0625rem solid ${({ theme }) => theme.createSetSmallButtonBorder};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &:hover {
      border: 0.0625rem solid
        ${({ theme }) => theme.createSetSmallButtonBorderHover};
    }
  }
  > div.header button:hover {
    background-color: #7dd;
  }
  > div.header div.inputs {
    width: -webkit-fill-available;
    max-width: 81.25em;
  }
  > div.header div.inputs input {
    border: none;
    outline: none;
    margin: 1rem 0 0;
    padding: 0.25rem 1rem;
    background-color: ${({ theme }) => theme.folderInputBg};
    color: ${({ theme }) => theme.folderHeader};
    width: 100%;
    border-radius: 0.125rem;
    height: 3rem;
  }
  > div.header div.inputs input:placeholder {
    color: #939bb4;
    font-weight: normal;
  }
  > div.header div.inputs input:focus {
    border-bottom: 0.125rem solid
      ${({ theme }) => theme.createSetHeaderInputBorder};
  }
  > div.header div.inputs p.error {
    font-weight: normal;
  }
  > div.header div.inputs div.settings button {
    all: unset;
  }
  > div.header div.inputs div.settings {
    display: flex;
    justify-content: flex-end;
  }
  > div.header div.inputs div.settings div.setting {
    margin: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  > div.header div.inputs div.settings div.setting p {
    margin-bottom: 0.5rem;
    font-weight: lighter;
    font-size: 0.875rem;
  }
  > div.header div.inputs div.settings div.setting button {
    color: #3ccfcf;
    cursor: pointer;
    font-size: 1rem;
  }
  > div.header div.inputs div.settings div.setting button:hover {
    color: #28a7a7;
  }
  > div.body {
    max-width: 81.25em;
    padding: 0 2.5rem;
    width: -webkit-fill-available;
  }
  > div.body div.terms-list {
    margin-top: 1.25rem;
  }
  > div.body div.terms-list div.term-container {
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.createSetTermBg};
    color: ${({ theme }) => theme.createSetTermColor};
    margin-top: 1.25rem;
  }
  > div.body div.terms-list div.term-container div.toolbar {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    border-bottom: 2px solid ${({ theme }) => theme.createSetToolbarBorder};
  }
  > div.body div.terms-list div.term-container div.toolbar button {
    all: unset;
    padding: 0.5625rem;
  }
  > div.body div.terms-list div.term-container div.toolbar span {
    padding: 0.5625rem;
  }
  > div.body div.terms-list div.term-container div.inner {
    padding: 0.75rem 0.75rem 1.5rem 0.75rem;
    display: flex;
    ${(props) => {
      if (props.size === "small") {
        return "flex-direction: column; align-items: center;";
      }
    }}
  }
  > div.body div.terms-list div.term-container div.inner div.left,
  div.body div.terms-list div.term-container div.inner div.right {
    width: 50%;
    padding-top: 0.75rem;
    display: flex;
    flex-direction: column;
    padding-left: 0.75rem;
    padding-right: 1.25rem;
    ${(props) => {
      if (props.size === "small") {
        return "width: 100%";
      } else {
        return "width: 50%;";
      }
    }}
  }
  > div.body div.terms-list div.term-container div.inner div.left textarea,
  div.body div.terms-list div.term-container div.inner div.right textarea {
    all: unset;
    border-bottom: 0.15rem solid
      ${({ theme }) => theme.createSetTermInputBorder};
    font-weight: normal;
    padding-bottom: 2px;
    color: ${({ theme }) => theme.createSetTermInputColor};
    transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
  }
  > div.body
    div.terms-list
    div.term-container
    div.inner
    div.left
    textarea::placeholder,
  div.body
    div.terms-list
    div.term-container
    div.inner
    div.right
    textarea::placeholder {
    color: ${({ theme }) => theme.createSetTermColor};
    font-weight: normal;
  }
  > div.body
    div.terms-list
    div.term-container
    div.inner
    div.left
    textarea:focus,
  div.body
    div.terms-list
    div.term-container
    div.inner
    div.right
    textarea:focus {
    border-bottom: 0.25rem solid #ffdc62;
  }
  > div.body div.terms-list div.term-container div.inner div.left span,
  div.body div.terms-list div.term-container div.inner div.right span {
    font-size: 0.75rem;
    font-weight: normal;
    letter-spacing: 0.0625rem;
    line-height: 1.333333333333333;
    margin-top: 0.5rem;
  }
  > div.body div.terms-list button.add-term {
    all: unset;
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.createSetTermBg};
    margin-top: 1.25rem;
    height: 6rem;
    cursor: pointer;
    &:hover div.button-text {
      color: #ffcd1f;
      border-bottom: 0.3125rem solid #ffcd1f;
    }
  }
  > div.body div.terms-list button.add-term:disabled {
    cursor: default;
    &:hover div.button-text {
      border-bottom: 0.3125rem solid #3ccfcf;
      color: ${({ theme }) => theme.createSetHeaderTextColor};
    }
  }
  > div.body div.terms-list button.add-term div.button-text {
    padding-bottom: 0.75rem;
    border-bottom: 0.3125rem solid #3ccfcf;
    color: ${({ theme }) => theme.createSetHeaderTextColor};
    transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
  }
  > div.body div.terms-list button.create {
    all: unset;
    font-size: 1.125rem;
    letter-spacing: 0.0625rem;
    line-height: 1.222222222222222;
    padding: 1.5rem 5rem;
    background-color: #3ccfcf;
    border-radius: 0.25rem;
    color: ${({ theme }) => theme.createSetHeaderButtonColor};
    float: right;
    margin-top: 1.25rem;
  }
`;
export default StyledCreateSet;