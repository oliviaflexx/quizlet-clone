import styled from "styled-components";

const StyledOptionsModal = styled.div`
  > div.modal-overlay {
    > div.setting-modal {
      z-index: 1101;
      background-color: ${({ theme }) => theme.createSetOptionsBody};
      ${(props) => {
        if (props.size === "small") {
          return "bottom: 0; left: 0; overflow-y: auto; position: fixed; right: 0; top: 0;";
        } else {
          return "left: 50%; margin-bottom: 2.8125rem; margin-top: 2.8125rem; max-width: 100%; outline: none; position: relative; top: 0; transform: translateX(-50%); width: 37.5rem;";
        }
      }}
      > div.header {
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
      > div.body {
        ${(props) => {
          if (props.size === "big") {
            return "display: flex; justify-content: space-around; padding: 2rem;";
          } else {
            return "padding: 1rem;";
          }
        }}
        > div.setting-container {
          margin-bottom: 2rem;
          > p {
            font-size: 0.625rem;
            font-weight: 600;
            letter-spacing: 0.0625rem;
            line-height: 1.3;
            color: ${({ theme }) => theme.createSetTermInputColor};
          }
          > select {
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
          > button {
            display: inline-block;
            font-size: 0.875rem;
            font-weight: 600;
            line-height: 1.285714285714286;
            margin-top: 0 !important;
            padding: 0.625rem 1rem;
            transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
            cursor: pointer;
            border-radius: 0.25rem;
            color: #3ccfcf;
            border: 0.125rem solid
              ${({ theme }) => theme.createSetOptionsSelectBorder};
            background-color: ${({ theme }) => theme.createSetOptionsSelectBg};
            &:hover {
              color: #ffcd1f;
            }
          }
          > button.chosen {
            background-color: #ffcd1f;
            color: #303545;
          }
        }
      }
    }
  }
`;
export default StyledOptionsModal;