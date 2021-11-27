import styled from "styled-components";

const StyledAuth = styled.div`
  display: flex;
  height: 100vh;
  > div.left,
  div.right {
    ${(props) => {
      if (props.size === "small") {
        return "width: 100%;";
      } else {
        return "width: 50%;";
      }
    }}
  }
  > div.left {
    background-image: url(https://assets.quizlet.com/a/j/dist/app/i/signup/QZ_Auth_Light.f0832112f8d66a6.png);
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    > h1 {
      font-size: 2rem;
      width: 15.625rem;
      color: #3b4c9b;
      margin: 3.5%;
      position: absolute;
      font-weight: 700;
    }
    > div.brand {
      bottom: 1rem;
      color: #fff;
      height: 2rem;
      margin: 3.5%;
      position: absolute;
      width: 8rem;
    }
  }
  div.right {
    padding: 1rem;
    > form {
      padding: 1rem;
      margin-top: 5rem;
      > h3 {
        color: #303545;
        font-weight: 700;
      }
      > div.form-group {
        margin-top: 2rem;
        > label {
          color: #939bb4;
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.0625rem;
          line-height: 1.333333333333333;
          margin-top: 0.625rem;
          text-align: inherit;
          text-transform: uppercase;
        }
        > input {
          border-radius: 0px;
          appearance: none;
          background-color: initial;
          border: none;
          box-shadow: none;
          color: #1a1d28;
          cursor: text;
          filter: none;
          flex: 1 1 auto;
          font: inherit;
          letter-spacing: inherit;
          line-height: inherit;
          outline: none;
          padding-bottom: 0.375rem;
          padding-left: 0px;
          text-align: inherit;
          white-space: pre-wrap;
          width: 100%;
          word-break: break-word;
          border-bottom: 0.125rem solid #303545;
          font-weight: normal;
        }
        & > input:focus {
          border-bottom: 0.25rem solid #ffdc62;
        }
        > input::placeholder {
          color: lightgrey;
          font-weight: lighter;
        }
      }
      > div.errors {
        color: #ff725b;
        font-size: 0.75rem;
        letter-spacing: 0.0625rem;
        line-height: 1.333333333333333;
        margin-top: 1rem;
      }
      > button.submit {
        font-size: 1.125rem;
        font-weight: 700;
        letter-spacing: 0.0625rem;
        line-height: 1.222222222222222;
        padding: 1.5rem 5rem;
        width: 100%;
        background-color: #3ccfcf;
        color: white;
        appearance: none;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
        margin-top: 2rem;
      }
      > button.log-in {
        width: 100%;
        appearance: none;
        border: 0.125rem solid #d9dde8;
        border-radius: 0.25rem;
        padding: 0.5rem;
        color: #646f90;
        font-size: 0.875rem;
        font-weight: 600;
        background-color: transparent;
        margin-top: 1.5rem;
        cursor: default;
        > a {
          all: unset;
          color: #3ccfcf;
          cursor: pointer;
        }
        > a:hover {
          color: #ffdc62;
        }
      }
    }
  }
`;
export default StyledAuth;