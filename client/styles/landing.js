import styled from "styled-components";

const StyledLanding = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.setIndexFontColor};
  background: ${({ theme }) => theme.setIndexTopBg};
  > header {
    background-image: url("https://quizlet-prod.cdn.prismic.io/quizlet-prod/fd9b8aeb-8e4c-4d96-a51d-9463339217bc_Hero+background+LO+home+final.svg");
    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    background-color: #3b4c9b;

    ${(props) => {
      if (props.size === "small") {
        return "padding: 2rem 0;";
      } else {
        return "padding: 4rem 0;";
      }
    }}
    > div.header-container {
      ${(props) => {
        if (props.size === "small") {
          return "padding: 0 1rem;";
        } else {
          return "padding: 0 2.5rem;";
        }
      }}
      position: relative;
      color: white;
      > img {
        border-radius: 1.5rem;
        display: block;
        min-height: 31.25rem;
        object-fit: cover;
        width: 100%;
      }
      > div.text-container {
        align-items: flex-end;
        display: flex;
        justify-content: space-between;
        align-content: flex-end;
        flex-wrap: wrap;
        width: 100%;
        bottom: 0;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        ${(props) => {
          if (props.size === "small") {
            return "padding: 0 1rem;";
          } else {
            return "padding: 0 2.5rem;";
          }
        }}
        > div.text {
          ${(props) => {
            if (props.size === "small") {
              return "max-width: 22.5rem; margin: 1rem;";
            } else {
              return "max-width: 30rem; margin: 3rem;";
            }
          }}

          > h1 {
            ${(props) => {
              if (props.size === "small") {
                return "font-size: 2rem;";
              } else {
                return "font-size: 2.75rem;";
              }
            }}
            letter-spacing: normal;
            line-height: 1.272727272727273;
            margin-bottom: 1rem;
          }
          > p {
            ${(props) => {
              if (props.size === "small") {
                return "font-size: 1rem;";
              } else {
                return "font-size: 1.25rem;";
              }
            }}
            font-weight: 300;
            letter-spacing: normal;
            line-height: 1.4;
            margin: 0;
            padding: 0;
          }
        }
        > div.button-container {
          ${(props) => {
            if (props.size === "small") {
              return "margin: 2rem;";
            } else {
              return "margin: 3rem;";
            }
          }}
          > a {
            all: unset;
            cursor: pointer;
            padding: 1.25rem 2rem;
            background: #3ccfcf;
            border-radius: 0.5rem;

            font-weight: 600;
            letter-spacing: normal;
            line-height: 1.5;
            min-height: 4rem;
            ${(props) => {
              if (props.size === "small") {
                return "font-size: .875rem;";
              } else {
                return "font-size: 1rem;";
              }
            }}
          }
        }
      }
    }
  }
  > section.highlight-text {
    ${(props) => {
      if (props.size === "small") {
        return "padding: 5.125rem 0;";
      } else {
        return "padding: 10.125rem 0;";
      }
    }}
    text-align: center;
    > p {
      ${(props) => {
        if (props.size === "small") {
          return "padding: 0 1rem; font-size: 1.5rem;";
        } else {
          return "padding: 0 2.5rem; font-size: 2rem;";
        }
      }}

      font-weight: 700;
      letter-spacing: normal;
      line-height: 1.25;
      > em {
        background-image: url(https://assets.quizlet.com/a/j/dist/app/i/prismic/scribble.6c75e80726e3401.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 2rem;
        font-style: normal;
        font-weight: 700;
        letter-spacing: normal;
        line-height: 1.25;
        padding: 2.1875rem;
        ${(props) => {
          if (props.size === "small") {
            return "display: block;";
          } else {
            return "";
          }
        }}
      }
    }
  }
  > section.text-pic {
    ${(props) => {
      if (props.size === "small") {
        return "flex-direction: column;";
      } else {
        return "align-items: center;";
      }
    }}
    padding: 0 2.5rem;
    max-width: 64em;
    display: flex;
    margin-top: 3rem;
    > div.image.right {
      ${(props) => {
        if (props.size === "big") {
          return "margin-left: 5.375rem;";
        }
      }}
    }
    > div.image.left {
      ${(props) => {
        if (props.size === "big") {
          return "margin-right: 5.375rem;";
        }
      }}
    }
    > div.image {
      flex: 1.12 0 0;
      > img {
        width: 100%;
      }
    }

    > div.text {
      text-align: center;
      position: relative;
      flex: 1 0 0;
      > h2 {
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: normal;
        line-height: 1.25;
      }
      > p {
        min-height: 1.25rem;
        text-align: center;

        font-weight: 300;
        letter-spacing: normal;

        padding: 1.5rem 0;
        ${(props) => {
          if (props.size === "small") {
            return "line-height: 1.625; font-size: 1rem;";
          } else {
            return "line-height: 1.4; font-size: 1.25rem;";
          }
        }}
      }
    }
  }
  > section.testimonial {
    ${(props) => {
      if (props.size === "small") {
        return "padding: 0 2rem;";
      } else {
        return "padding: 0 2.5rem;";
      }
    }}
    width: 100%;
    > div.carousel-root {
      padding: 6.25rem 0;
      > div.carousel .slider-wrapper ul li .text h3 {
        font-size: 1.875rem;
        font-weight: 700;
        line-height: 1.266666666666667;
        margin-bottom: 0;
        margin-left: 0;
        margin-right: 0;
        max-width: 100%;
      }
      > div.carousel .slider-wrapper ul li .text h3:before {
        content: url(https://assets.quizlet.com/a/j/dist/app/i/prismic/quotes-open.76da8581ea3adc0.svg);
        margin-right: 0.5rem;
      }
      > div.carousel .slider-wrapper ul li .text h3:after {
        content: url(https://assets.quizlet.com/a/j/dist/app/i/prismic/quotes-close.f05dbfc1b568217.svg);
        margin-left: 0.5rem;
        bottom: -1.125rem;
        position: relative;
      }
      > div.carousel .slider-wrapper ul li .text p {
        color: #a9a9a9;
        font-weight: 600;
        margin-top: 1.5rem;
      }
    }
  }
  > section.ready {
    padding: 0 2.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 3rem;
    > a {
      all: unset;
      cursor: pointer;
      padding: 1.25rem 2rem;
      background: #3ccfcf;
      border-radius: 0.5rem;
      letter-spacing: normal;
      line-height: 1.5;
      color: white;
      ${(props) => {
        if (props.size === "small") {
          return "font-size: .875rem;";
        } else {
          return "font-size: 1rem;";
        }
      }}
    }
    > h2 {
      margin-bottom: 2rem;
      font-size: 1.875rem;
      font-weight: 700;
      line-height: 1.266666666666667;
      text-align: center;
    }
  }
`;
export default StyledLanding;
