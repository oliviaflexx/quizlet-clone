import styled from "styled-components";

const Styled404 = styled.div`
  color: ${({ theme }) => theme.setIndexFontColor};
  background: ${({ theme }) => theme.setIndexTopBg};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6.25rem 1rem;
  height: calc(100vh - 3rem);
  > h1 {
    font-weight: 700;
    line-height: 1.142857142857143;
    ${(props) => {
      if (props.size === "small") {
        return "font-size: 2.25rem;";
      } else {
        return "font-size: 3.5rem;";
      }
    }}
  }
  > h3 {
    margin-top: 1.5rem;
    text-align: center;
    font-weight: 700;
    line-height: 1.266666666666667;
    ${(props) => {
      if (props.size === "small") {
        return "font-size: 1.625rem";
      } else {
        return "font-size: 1.875rem;";
      }
    }}
  }
  > p {
    margin-top: 1.5rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.625;
    > a {
      all: unset;
      cursor: pointer;
      font-size: 1rem;
      color: #3ccfcf;
      font-weight: 600;
      line-height: 1.625;
    }
  }
  > div.right {
    background-image: url(https://assets.quizlet.com/a/j/dist/app/i/homepage/decoration-b.ff9e11513b6870e.png);
    background-position: 140px 0;
    height: 21.5rem;
    right: 0;
    top: 125px;
    width: 16.125rem;
    background-repeat: no-repeat;
    position: absolute;
  }
  > div.left {
    background-image: url(https://assets.quizlet.com/a/j/dist/app/i/homepage/decoration-c.df891727a39ef4d.png);
    background-position: 0 10.40625rem;
    bottom: 0;
    left: 0;
    height: 20.8125rem;
    width: 14.1875rem;
    background-repeat: no-repeat;
    position: absolute;
  }
`;

export default Styled404;