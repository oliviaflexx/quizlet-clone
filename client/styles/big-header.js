import styled from "styled-components";

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

export const StyledHeader = styled.nav`
  background-color: ${({ theme }) => theme.headerBack};
  width: 100%;
  box-shadow: 0 0.25rem 1rem 0 #939bb414;
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  -webkit-justify-content: space-between;
  padding: 0 1rem;
`;

export const Brand = styled.h1`
  color: ${({ theme }) => theme.brand};
  cursor: pointer;
  margin: 0 0.75rem;
`;
export const NavLink = styled.p`
  color: ${({ theme }) => theme.navLink};
  &:hover {
    color: ${({ theme }) => theme.navLinkHover};
  }
  cursor: pointer;
  margin: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 20px;
  min-width: fit-content;
`;

export const CreateButton = styled.button`
  background-color: #7dd;
  &:hover {
    background-color: #77ddddf2;
  }
  cursor: pointer;
  color: ${({ theme }) => theme.headerBack};
  margin: 0 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  min-width: fit-content;
`;

export const CreateModal = styled.div`
  background-color: ${({ theme }) => theme.headerModals};
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 70px;
  left: 350px;
  border-radius: 0.75rem;
  box-shadow: 0 0.3125rem 1.25rem 0 rgb(0 0 0 / 16%);
  width: 200px;
  height: 150px;
  align-items: flex-start;
  justify-content: space-evenly;
  overflow: hidden;
  & > a,
  button {
    all: unset;
    height: 50px;
    padding-left: 30px;
    padding-top: 10px;
    width: 100%;
    color: #646f90;
    text-decoration: none;
    border: none;
    background: inherit;
  }
  & > a:hover,
  button:hover {
    color: ${({ theme }) => theme.hoverTextColor};
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }
`;

export const SearchBar = styled.div`
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  min-width: 15rem;
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
