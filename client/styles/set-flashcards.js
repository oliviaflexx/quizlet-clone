import styled from "styled-components";

const StyledFlashcards = styled.div`
  > div.big-screen {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.setFlashcardsTextColor};
    background-color: ${({ theme }) => theme.setFlashcardsBg};
    > div.side-controls {
      width: 12.1875rem;
      height: calc(100vh - 4rem);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 0.25rem 1.25rem rgb(0 0 0 / 8%);
      padding: 1rem;
      padding-top: 0;
      background-color: ${({ theme }) => theme.setFlashcardsSideBg};
      > div.top {
        width: 100%;
        > a {
          display: block;
          width: 100%;
          text-decoration: none;
          display: flex;
          font-size: 14px;
          align-items: center;
          min-height: 3rem;
          color: ${({ theme }) => theme.setFlashcardsTextColor};
          > svg {
            height: 1.25rem;
            width: 1.25rem;
            color: #3ccfcf;
          }
        }
        > div.flashcards {
          font-size: 0.875rem;
          font-weight: 700;
          letter-spacing: 0.1875rem;
          line-height: 1.214285714285714;
          margin: 1.5rem 0 2.5rem;
          > svg {
            margin-right: 1rem;
            color: #4257b2;
          }
        }
        > div.progress-container {
          font-weight: 600;
          > div.progress {
            background-color: rgba(66, 87, 178, 0.3);
            border-radius: 0;
            height: 0.75rem;
            > div.progress-bar {
              background-color: #4257b2;
            }
          }
          > div.progress-text {
            margin-top: 5px;
            font-size: 0.75rem;
            display: flex;
            justify-content: space-between;
            letter-spacing: 0.0625rem;
          }
        }
      }
      > div.bottom {
        display: flex;
        flex-direction: column;
        > button.choices {
          all: unset;
          margin-top: 1.5rem;
          border-radius: 0.25rem;
          color: #3ccfcf;
          padding: 0.625rem 1rem;
          transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
          text-align: center;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          border: 0.125rem solid ${({ theme }) =>
            theme.setFlashcardsSideButtonBorder};
          background-color: ${({ theme }) => theme.setFlashcardsSideButtonBg};
          &:hover {
            color: #ffcd1f;
          }
          &.clicked {
            background-color: #ffcd1f;
            border-color: #ffcd1f;
            color: #303545;
          }
        }
      }
    }
    > div.card-container {
      position: relative;
      padding: 1.5rem;
      height: calc(100vh - 4rem);
      width: 100%;
      max-width: 750px;
      > div.flashcard.starred {
        box-shadow: 0 0 0 0.1875rem #ffcd1f;
      }
      > div.flashcard {
        left: 0;
        right: 0;
        position: absolute;
        top: 0;
        bottom: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;

        transform-style: preserve-3d;
        margin: 1.5rem;
        background-color: ${({ theme }) => theme.setFlashcardsCardBg};
        > div.top-right {
          padding: 1.25rem;
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          > button {
            all: unset;
            cursor: pointer;
            margin-right: 1rem;
            transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
            &:hover {
              color: #ffcd1f;
            }
            > svg {
              height: 22px;
              width: 22px;
            }
          }
        }
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
          word-break: normal;
          word-wrap: normal;
          text-align: center;
          ${(props) => {
            return `font-size: ${props.fontSize}`;
          }}
        }
      }
      > div.flashcard[flip="1"] {
        animation: flip 0.5s 1;
        @keyframes flip {
          100% {
            transform: rotateX(-180deg);
          }
        }
      }
      > div.flashcard[swipe="1"] {
        animation: swipe 0.5s 1;
        @keyframes swipe {
          100% {
            transform: translateX(-50px);
          }
        }
      }
      > div.flashcard[swipe="2"] {
        animation: swipe 0.5s 1;
        @keyframes swipe {
          100% {
            transform: translateX(50px);
          }
        }
      }
      > div.controls {
        position: absolute;
        width: 24%;
        bottom: 10%;
        left: 40%;
        display: flex;
        justify-content: space-between;
        align-items; center;
        > button {
          all: unset;
          cursor: pointer;
          border-radius: 50%;
          padding: 0.5625rem;
          align-items: center;
          display: inline-flex;
          justify-content: center;
          white-space: pre-wrap;
          transition: all .12s cubic-bezier(.47,0,.745,.715);
          > svg {
            height: 22px;
            width: 22px;
            color: #3ccfcf;
          }
          &:hover {
            background-color: #ffcd1f;
          }
        }
        > button[disabled] {
          cursor: default;
          &:hover {
            background-color: inherit;
          }
        }
      }
    }
  }
  > div.small-screen {
    z-index: 1000;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: 0;
    color: ${({ theme }) => theme.setFlashcardsTextColor};
    background-color: ${({ theme }) => theme.setFlashcardsBg};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    >  div.header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      background-color: ${({ theme }) => theme.setFlashcardsHeader};
      padding: 0.75rem;
      align-items: center;
      color: white;
      > svg {
        height: 2rem;
        width: 2rem;
        cursor: pointer;
      }
      > button {
        all: unset;
        cursor: pointer;
        
        > svg {
          height: 2rem;
          width: 2rem;
        }
        
      }

    }
    > div.progress-container {
      width: 100%;
      background-color: yellow;
      height: 3.125rem;
      padding: 1rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      font-size: .75rem;
      font-weight: 600;
      letter-spacing: .0625rem;
      line-height: 1.333333333333333;
      background-color: ${({ theme }) => theme.setFlashcardsProgressBg};
      > div.progress {
        height: 0.75rem;
        width: 85%;
        background-color: rgba(66, 87, 178, 0.3);
        border-radius: 0;
        > div.progress-bar {
          background-color: #4257b2;
        }
      }
    }
    > div.card-container {
      width: 100%;
      position: relative;
      padding: 1.5rem;
      height: 80vh;
      > div.flashcard.starred {
        box-shadow: 0 0 0 0.1875rem #ffcd1f;
      }
      > div.flashcard {
        left: 0;
        right: 0;
        position: absolute;
        top: 0;
        bottom: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;

        transform-style: preserve-3d;
        margin: 1.5rem;
        background-color: ${({ theme }) => theme.setFlashcardsCardBg};
        > div.top-right {
          padding: 1.25rem;
          position: absolute;
          right: 0;
          top: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          > button {
            all: unset;
            cursor: pointer;
            margin-right: 1rem;
            transition: all 0.12s cubic-bezier(0.47, 0, 0.745, 0.715);
            &:hover {
              color: #ffcd1f;
            }
            > svg {
              height: 2rem;
              width: 2rem;
            }
          }
        }
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
          word-break: normal;
          word-wrap: normal;
          text-align: center;
          ${(props) => {
            return `font-size: ${props.fontSize}`;
          }}
        }
      }
      > div.flashcard[flip="1"] {
        animation: flip 0.5s 1;
        @keyframes flip {
          100% {
            transform: rotateX(-180deg);
          }
        }
      }
      > div.controls {
        position: absolute;
        width: 35%;
        bottom: 10%;
        left: 35%;
        display: flex;
        justify-content: space-between;
        align-items; center;
        > button {
          all: unset;
          cursor: pointer;
          border-radius: 50%;
          padding: 0.5625rem;
          align-items: center;
          display: inline-flex;
          justify-content: center;
          white-space: pre-wrap;
          transition: all .12s cubic-bezier(.47,0,.745,.715);
          > svg {
            height: 22px;
            width: 22px;
            color: #3ccfcf;
          }
          &:hover {
            background-color: #ffcd1f;
          }
        }
        > button[disabled] {
          cursor: default;
          &:hover {
            background-color: inherit;
          }
        }
      }
    }
  }
`;

export default StyledFlashcards;