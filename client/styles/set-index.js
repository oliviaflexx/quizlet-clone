import styled from "styled-components";

const StyledSet = styled.div`
  padding: 2.5rem;
  padding-bottom: 0;
  position: relative;
  padding-top: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.setIndexFontColor};
  background-color: ${({ theme }) => theme.setIndexTopBg};
  > div.container-top {
    display: flex;
    justify-content: center;

    ${(props) => {
      if (props.size === "small") {
        return "flex-direction: column;";
      } else {
        return "flex-direction: row;";
      }
    }}
    > h1 {
      margin-bottom: 2.5rem;
    }

    > div.side {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 2rem;
      > h1 {
        font-size: 1.875rem;
        position: relative;
        bottom: 50px;
      }
      > div.study-links {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        > p {
          font-size: 0.625rem;
          letter-spacing: 0.0625rem;
          line-height: 1.1;
          padding: 0.25rem 1rem 0.25rem 0.5rem;
          margin-bottom: 10px;
        }
        > a {
          all: unset;
          font-size: 1rem;
          cursor: pointer;
          padding: 0.25rem 1rem 0.25rem 0.5rem;
          border-radius: 0.25rem;
          width: -webkit-fill-available;
          > svg {
            margin-right: 10px;
          }
        }
        > a:hover {
          background-color: #ffcd1f;
          color: #303545;
        }
      }
    }
    > div.card-container {
      perspective: 1000px;
      > div.flashcard-preview {
        transform-style: preserve-3d;
        padding: 0 34px;
        position: relative;
        text-align: center;
        vertical-align: middle;
        word-break: break-word;
        box-shadow: 0 0.3125rem 1.25rem 0 rgb(0 0 0 / 16%);
        border-radius: 1rem;
        background-color: ${({ theme }) => theme.setIndexFlashcardBg};
        ${(props) => {
          if (props.size === "small") {
            return "width: 90vw; max-width: 560px;";
          } else {
            return "width: 560px;";
          }
        }}
        height: 340px;
        > div.front,
        div.back {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          height: 100%;
          width: 100%;
          font-weight: normal;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          cursor: pointer;
          overflow-y: auto;
          overflow-x: hidden;
          ${(props) => {
            return `font-size: ${props.fontSize}`;
          }}
        }
      }
      > div.flashcard-preview[flip="1"] {
        animation: flip 0.5s 1;
        @keyframes flip {
          100% {
            transform: rotateX(-180deg);
          }
        }
      }
      > div.icons {
        margin-top: 1.5rem;
        display: flex;
        justify-content: center;
        position: relative;
        align-items: center;
        > button {
          all: unset;
          position: absolute;
          right: 5px;
          cursor: pointer;
          transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
        }
        > button:hover {
          color: #ffcd1f;
        }
        > div.middle {
          display: flex;
          align-items: center;
          width: 200px;
          justify-content: space-around;
          > button {
            all: unset;
            cursor: pointer;
            transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
          }
          > button:hover {
            color: #ffcd1f;
          }
          > span {
            font-size: 0.75rem;
          }
        }
      }
    }
  }
  > div.details-bar {
    display: flex;
    max-width: 750px;
    justify-content: space-between;
    width: -webkit-fill-available;
    align-items: center;
    padding: 4rem;
    ${(props) => {
      if (props.size === "small") {
        return "width: 100vw;";
      }
    }}
    > div.creator {
      position: relative;
      > svg {
        ${(props) => {
          if (props.size === "small") {
            return "height: 50px; width: 50px;";
          } else {
            return "height: 60px; width: 60px;";
          }
        }}
        color: #939bb4;
      }
      > span {
        font-size: 0.625rem;
        font-weight: lighter;
      }
      > a {
        position: relative;
        top: 20px;
        right: 50px;
        font-size: 1rem;
        font-weight: 600;
        line-height: 1.285714285714286;
        color: #3ccfcf;
        text-decoration: none;
        &:hover {
          color: #ffcd1f;
        }
      }
    }
    > div.editing {
      display: flex;
      justify-content: center;
      align-items: center;

      > button {
        all: unset;
        width: 25px;
        margin-left: 20px;
        cursor: pointer;
        transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        &:hover {
          color: #ffcd1f;
        }
        &#i {
          font-size: 25px;
        }
        > svg {
          width: 24px;
          height: 24px;
        }
      }
    }
  }
  > div.side {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 2rem;
    position: relative;
    right: 30%;
    > h1 {
      font-size: 1.875rem;
      position: relative;
      bottom: 50px;
    }
    > div.study-links {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      > p {
        font-size: 0.625rem;
        letter-spacing: 0.0625rem;
        line-height: 1.1;
        padding: 0.25rem 1rem 0.25rem 0.5rem;
        margin-bottom: 10px;
      }
      > a {
        all: unset;
        font-size: 1rem;
        cursor: pointer;
        padding: 0.25rem 1rem 0.25rem 0.5rem;
        border-radius: 0.25rem;
        width: -webkit-fill-available;
        > svg {
          margin-right: 10px;
        }
      }
      > a:hover {
        background-color: #ffcd1f;
      }
    }
  }
  > div.bottom-container {
    padding: 2rem;
    padding-top: 4rem;
    width: 100vw;
    display: flex;
    justify-content: center;
    background-color: ${({ theme }) => theme.setIndexBottomBg};
    > div.term-container {
      max-width: 750px;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      ${(props) => {
        if (props.size === "big") {
          return "width: -webkit-fill-available;";
        } else {
          return "width: 95%;";
        }
      }}
      > div.top {
        max-width: 750px;
        display: flex;
        justify-content: space-between;
        width: -webkit-fill-available;
        align-items: center;
        flex-wrap: wrap;
        > h4 {
          font-size: 1.25rem;
          line-height: 1.4;
        }
        > select {
          outline: none;
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.333333333333333;
          cursor: pointer;
          display: block;
          background: none;
          border: none;
          border-radius: 0.25rem;
          width: 140px;
          height: 2.625rem;
          &:hover {
            color: #ffcd1f;
          }
        }
      }
      > div.terms {
        width: 100%;

        > div.study div.status {
          & h4 {
            font-size: 1.25rem;
          }
          & h4.learning {
            color: #f08700;
          }
          & h4.mastered {
            color: #23b26d;
          }
          & h4.not-studied {
            color: #7b89c9;
          }
          > p {
            font-weight: normal;
          }
        }
        > div.term,
        div.study div.status div.term {
          min-height: 3.625rem;
          border-radius: 0.25rem;
          padding: 1rem;
          display: flex;
          margin-top: 0.625rem;
          font-weight: normal;
          background-color: ${({ theme }) => theme.setIndexTermBg};
          box-shadow: 0 0.125rem 0.25rem rgb(0 0 0 / 8%);
          > div.left {
            width: 30%;
            padding-right: 2rem;
            border-right: 0.125rem solid
              ${({ theme }) => theme.setIndexTermBorder};
          }
          > div.middle {
            width: 60%;
            padding: 0 2rem;
          }
          > div.right {
            width: 10%;
            > div.buttons {
              display: flex;
              justify-content: center;
              align-items: center;
              > button {
                all: unset;
                cursor: pointer;
                transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
                padding-right: 0.5625rem;
                font-size: 0.875rem;
              }
              > button:hover {
                color: #ffcd1f;
              }
            }
          }
        }
      }
      > a {
        margin-top: 2rem;
        text-align: center;
        font-size: 1.125rem;
        font-weight: 700;
        letter-spacing: 0.0625rem;
        line-height: 1.222222222222222;
        width: 100%;
        width: auto;
        ${(props) => {
          if (props.size === "small") {
            return "padding: 1.25rem 2.5rem;";
          } else {
            return "padding: 1.5rem 5rem;";
          }
        }}
        color: ${({ theme }) => theme.classModalBg};
        background-color: #3ccfcf;
        border-radius: 0.25rem;
        text-decoration: none;
      }
    }
  }
`;
export default StyledSet;
