import styled from "styled-components";

export const StyledMobileNav = styled.div`
  position: absolute;
  background-color: ${({ theme }) => theme.mobileNavBg};
  color: #cedaf3;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 1100;
  display: flex;
  flex-direction: column;
  & > div.top {
    padding: 0.5rem;
    display: flex;
    justify-content: flex-start;
  }
  & > div.top button {
    all: unset;
    margin: 0.5rem;
    cursor: pointer;
  }
  & > div.body {
    display: flex;
    flex-direction: column;
  }
  & > div.body div.menu {
    display: flex;
    flex-direction: column;
    border-left: 0.0625rem solid #ffffff1a;
    margin: 0.5rem 1rem;
    padding: 0;
  }
  & > div.body button {
    all: unset;
    margin: 0.5rem 0;
    padding: 0 1rem;
    width: 100%;
    cursor: pointer;
  }
  & > div.body button:hover,
  div.body a:hover {
    border-left: 0.25rem solid #cedaf3;
    padding-left: 0.75rem;
    color: white;
  }
  & > div.body a {
    all: unset;
    margin: 0.5rem 0;
    padding: 0 1rem;
    width: 100%;
    cursor: pointer;
  }
`;

export const StyledHeader = styled.nav`
  background-color: ${({ theme }) => theme.headerBack};
  width: 100%;
  box-shadow: 0 0.25rem 1rem 0 #939bb414;
  height: 3rem;
  padding: 0 1rem;
  display: flex;
  -webkit-justify-content: space-between;
  padding: 0 1rem;
  & > div.nav-content svg {
    cursor: pointer;
  }
`;

export const NavButton = styled.button`
  border-radius: 50%;
  border: none;
  height: 2rem;
  min-width: 2rem;
  margin: 0.5rem;
  background-color: ${({ theme }) => theme.searchBarBackground};
  color: ${({ theme }) => theme.searchBarColor};
  justify-content: center;
  & > svg {
    background-color: inherit;
    color: inherit;
  }
`;

export const SearchBarOpen = styled.div`
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  max-width: 300px;
  background-color: ${({ theme }) => theme.searchBarBackground};
  color: ${({ theme }) => theme.searchBarColor};
  &:focus {
    background-color: ${({ theme }) => theme.searchBarBackgroundHover};
  }
  display: flex;
  & > input {
    background-color: inherit;
    color: inherit;
    border: none;
    text-overflow: ellipsis;
    margin: 0 0.5rem;
  }
  & > input:focus-visible {
    outline: none;
  }
`;