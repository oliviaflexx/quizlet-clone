import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useEffect, useState } from "react";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FilterNoneOutlinedIcon from "@mui/icons-material/FilterNoneOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { useMediaQuery } from "react-responsive";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import {BigCreateFolderModal} from "./create-folder-modal";

const NavButton = styled.button`
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

const StyledHeader = styled.nav`
  background-color: ${({ theme }) => theme.headerBack};
  width: 100%;
  box-shadow: 0 0.25rem 1rem 0 #939bb414;
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  -webkit-justify-content: space-between;
  padding: 0 1rem;
`;

const Brand = styled.h1`
  color: ${({ theme }) => theme.brand};
  cursor: pointer;
  margin: 0 0.75rem;
`;
const NavLink = styled.p`
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

const CreateButton = styled.button`
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

const CreateModal = styled.div`
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

const SearchBar = styled.div`
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

const BigHeader = ({theme, themeToggler, currentUser }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const isBigScreen = useMediaQuery({ query: "(min-width: 1000px)" });
  const handleShowModal = () => {
    setShowCreateModal(!showCreateModal);
  };

  // fixes the issue with the create button icons
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  
  // useEffect(() => {
  //   if (router.pathname === "/latest") {
  //     setShowBorder("latest");
  //   } else if (router.pathname === "/user[user]") {
  //     setShowBorder("user");
  //   } else {
  //     setShowBorder("none");
  //   }
  // }, [router]);

  return (
    <StyledHeader>
      {showCreateFolderModal && (
        <BigCreateFolderModal
          setShowCreateFolderModal={setShowCreateFolderModal}
          showCreateFolderModal={showCreateFolderModal}
        />
      )}
      <div className="nav-content">
        <Link href="/">
          <Brand>Quizlet</Brand>
        </Link>
        <div className="header-link">
          <Link href="/latest">
            <NavLink>Home</NavLink>
          </Link>
        </div>
        <div className="header-link">
          <Link href="/user/[user]" as={`/user/${currentUser}`}>
            <NavLink>Your Library</NavLink>
          </Link>
        </div>
        {!isBigScreen ? (
          <CreateButton onClick={handleShowModal}>
            <AddIcon />
          </CreateButton>
        ) : (
          <CreateButton onClick={handleShowModal}>
            Create
            <KeyboardArrowDownOutlinedIcon />
          </CreateButton>
        )}

        {/* <CreateButton onClick={handleShowModal}>
          {console.log(isBigScreen)}
          {isBigScreen ? (
            <>
              Create
              <KeyboardArrowDownOutlinedIcon></KeyboardArrowDownOutlinedIcon>
            </>
          ) : (
            <>
              Create <AddIcon></AddIcon>
            </>
          )}
        </CreateButton> */}

        {showCreateModal && (
          <CreateModal onBlur={handleShowModal} onClick={handleShowModal}>
            <Link href="/create-set">
              <a>
                <FilterNoneOutlinedIcon /> Study set
              </a>
            </Link>
            <button
              onClick={() => setShowCreateFolderModal(!showCreateFolderModal)}
            >
              <FolderOutlinedIcon /> Folder
            </button>
            <button>
              <PeopleOutlineOutlinedIcon /> Class
            </button>
          </CreateModal>
        )}
      </div>
      <div className="nav-content">
        <SearchBar>
          <SearchIcon />
          <input type="text" placeholder="Study sets, users, questions"></input>
        </SearchBar>
        {!currentUser ? (
          <>
            <div className="header-link">
              <Link href="/auth/signup">
                <NavLink>Sign Up</NavLink>
              </Link>
            </div>
            <div className="header-link">
              <Link href="/auth/signin">
                <NavLink>Login</NavLink>
              </Link>
            </div>
          </>
        ) : (
          <div className="header-link">
            <Link href="/auth/signout">
              <NavLink>Logout</NavLink>
            </Link>
          </div>
        )}
        <NavButton onClick={themeToggler}>
          <Brightness4Icon
            sx={{
              height: "1rem",
              width: "1rem",
            }}
          />
        </NavButton>
      </div>
    </StyledHeader>
  );
};

BigHeader.getInitialProps = async () => {
  const isBigScreen = useMediaQuery({ query: "(min-width: 1000px)" });

  return {
    isBigScreen
  }
}
export default BigHeader;