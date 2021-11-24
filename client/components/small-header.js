import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery } from "react-responsive";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import CloseIcon from "@mui/icons-material/Close";
import {CreateClassModal} from "./create-class-modal";
import {BigCreateFolderModal} from "./create-folder-modal";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";

const StyledMobileNav = styled.div`
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
const MobileNav = ({ setShowMobileNav, currentUser }) => {
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  const library = (
    <>
      <button onClick={() => setShowLibrary(!showLibrary)}>
        Your library
        {showLibrary ? (
          <KeyboardArrowUpOutlinedIcon />
        ) : (
          <KeyboardArrowDownOutlinedIcon />
        )}
      </button>
      {showLibrary && (
        <div className="menu">
          <Link
            onClick={() => setShowMobileNav(false)}
            href="/user/[user]/sets"
            as={`/user/${currentUser.name}/sets`}
          >
            Study sets
          </Link>
          <Link
            onClick={() => setShowMobileNav(false)}
            href="/user/[user]/folders"
            as={`/user/${currentUser.name}/folders`}
          >
            Folders
          </Link>
          <Link
            onClick={() => setShowMobileNav(false)}
            href="/user/[user]/classes"
            as={`/user/${currentUser.name}/classes`}
          >
            Classes
          </Link>
        </div>
      )}
      <button onClick={() => setShowCreate(!showCreate)}>
        Create
        {showCreate ? (
          <KeyboardArrowUpOutlinedIcon />
        ) : (
          <KeyboardArrowDownOutlinedIcon />
        )}
      </button>
      {showCreate && (
        <div className="menu">
          <Link href="/create-set">Study set</Link>
          <button onClick={() => setShowCreateFolderModal(true)}>Folder</button>
          <button onClick={() => setShowCreateClassModal(true)}>Class</button>
        </div>
      )}
      <Link href="/auth/signout">Log out</Link>
    </>
  );

  return (
    <StyledMobileNav>
      {showCreateFolderModal && (
        <BigCreateFolderModal
          size="mobile"
          setShowCreateFolderModal={setShowCreateFolderModal}
        />
      )}
      {showCreateClassModal && (
        <CreateClassModal
          size="mobile"
          setShowCreateClassModal={setShowCreateClassModal}
        />
      )}
      <div className="top">
        <button className="exit" onClick={() => setShowMobileNav(false)}>
          <CloseIcon
            sx={{
              height: "1.5rem",
              width: "1.5rem",
            }}
          />
        </button>
      </div>
      <div className="body">
        <Link href="/" onClick={() => setShowMobileNav(false)}>
          Home
        </Link>
        {currentUser ? (
          library
        ) : (
          <>
            <Link href="/auth/signin" onClick={() => setShowMobileNav(false)}>
              Log in
            </Link>
            <Link href="/auth/signup" onClick={() => setShowMobileNav(false)}>
              Sign up
            </Link>
          </>
        )}
      </div>
    </StyledMobileNav>
  );
};

const StyledHeader = styled.nav`
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

const SearchBarOpen = styled.div`
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

const SmallHeader = ({ theme, themeToggler, currentUser }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  // console.log(currentUser);

  return (
    <StyledHeader>
      {showMobileNav && (
        <MobileNav
          setShowMobileNav={setShowMobileNav}
          currentUser={currentUser}
        />
      )}
      <div className="nav-content top">
        <svg
          onClick={() => setShowMobileNav(true)}
          fill="none"
          height="21"
          viewBox="0 0 37 21"
          width="37"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.6466 1.01497C26.1048 0.91492 24.5722 1.17646 23.1462 1.76712C21.7208 2.35779 20.4526 3.26725 19.4418 4.42511C18.4311 5.58298 17.703 6.95614 17.3172 8.43832C16.9314 9.9205 16.897 11.4717 17.2169 12.969C17.5367 14.4671 18.2031 15.8706 19.162 17.0706C20.1215 18.2705 21.3477 19.2345 22.7463 19.8859C24.1443 20.538 25.6755 20.8595 27.2201 20.8271C28.7647 20.794 30.2805 20.4076 31.6497 19.6968C31.6932 19.6747 31.7423 19.6644 31.7914 19.6672C31.8405 19.6699 31.8882 19.6851 31.9289 19.712C32.2193 19.9038 32.5223 20.0757 32.8358 20.2268C33.9224 20.7477 35.1155 21.012 36.322 20.9996C36.3964 20.9996 36.4672 20.9706 36.5198 20.9189C36.5724 20.8671 36.6019 20.7967 36.6019 20.7229V17.3583C36.6026 17.2921 36.5801 17.2286 36.5373 17.1775C36.4946 17.1265 36.4356 17.0927 36.3697 17.0816C36.0484 17.0312 35.7342 16.9422 35.4347 16.816C35.3975 16.7994 35.3645 16.7759 35.3379 16.7456C35.3112 16.7152 35.2916 16.68 35.2804 16.6414C35.2691 16.6027 35.2663 16.5627 35.272 16.5227C35.2776 16.4834 35.2923 16.4454 35.314 16.4116C36.2897 14.9646 36.8642 13.2885 36.9786 11.5524C37.0936 9.81631 36.7443 8.08019 35.9671 6.51935C35.1899 4.95851 34.0122 3.62882 32.5511 2.66209C31.0907 1.69605 29.3988 1.12745 27.6466 1.01497ZM20.9506 10.9155C20.9492 9.72798 21.3035 8.56597 21.9684 7.57785C22.6334 6.58973 23.5796 5.81897 24.6865 5.36355C25.7934 4.90813 27.0125 4.78876 28.1881 5.01992C29.3637 5.25108 30.4439 5.82311 31.292 6.66219C32.14 7.50195 32.7173 8.57218 32.9509 9.73695C33.1852 10.9017 33.0645 12.1093 32.6058 13.2071C32.147 14.3043 31.3698 15.242 30.3724 15.9017C29.3756 16.5613 28.2035 16.9126 27.0048 16.9119C25.3992 16.9119 23.8588 16.2805 22.7232 15.1557C21.5875 14.031 20.9478 12.506 20.9464 10.9148L20.9506 10.9155Z"
            fill="white"
          ></path>
          <rect fill="white" height="3" rx="1.5" width="14" y="2"></rect>
          <rect fill="white" height="3" rx="1.5" width="10" y="9"></rect>
          <rect fill="white" height="3" rx="1.5" width="13" y="16"></rect>
        </svg>
      </div>
      <div className="nav-content">
        {searchOpen ? (
          <SearchBarOpen>
            <SearchIcon />
            <input
              type="text"
              placeholder="Study sets, users, questions"
            ></input>
          </SearchBarOpen>
        ) : (
          <>
            <NavButton onClick={() => setSearchOpen(!searchOpen)}>
              <SearchIcon
                sx={{
                  height: "1rem",
                  width: "1rem",
                }}
              />
            </NavButton>
            <NavButton onClick={themeToggler}>
              <Brightness4Icon
                sx={{
                  height: "1rem",
                  width: "1rem",
                }}
              />
            </NavButton>
          </>
        )}
      </div>
    </StyledHeader>
  );
};

export default SmallHeader;
