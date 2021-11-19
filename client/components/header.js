import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import { useEffect, useState } from "react";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import FilterNoneOutlinedIcon from "@mui/icons-material/FilterNoneOutlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

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
  &:hover: {
    color: ${({ theme }) => theme.navLinkHover};
  }
  cursor: pointer;
  margin: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const CreateButton = styled.button`
  background-color: #7dd;
  &:hover: {
    color: #3ac8c8;
  }
  cursor: pointer;
  color: ${({ theme }) => theme.headerBack};
  margin: 0 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
`;

const CreateModal = styled.div`
  background-color: ${({ theme }) => theme.headerModals};
  display: flex;
  flex-direction: column;
  position: relative;
  top: 100px;
  right: 50px;
  border-radius: 0.75rem;
  box-shadow: 0 0.3125rem 1.25rem 0 rgb(0 0 0 / 16%);
  width: 200px;
  height: 150px;
  align-items: flex-start;
  justify-content: space-evenly;
  overflow: hidden;
  & > a {
    height: 50px;
    padding-left: 30px;
    padding-top: 10px;
    width: 100%;
    color: #646f90;
    text-decoration: none;
  }
  & > a:hover {
    color: ${({ theme }) => theme.hoverTextColor};
    background-color: ${({ theme }) => theme.hoverBackgroundColor};
  }
`;

// const BorderUnderline = styled.span`
//   width: 80%;
//   height: 0.25rem;
//   border-top-right-radius: 0.25rem;
//   border-top-left-radius: 0.25rem;
//   bottom: 0;
//   content: " ";
//   left: 15%;
//   position: absolute;
//   visibility: hidden;
//   &:hover: {
//     background-color: #cedaf3;
//     visibility: visible;
//   }
// `;

// const BorderUnderlineCurrent = styled.span`
//   width: 80%;
//   background-color: "#ffdc62";
//   height: 0.25rem;
//   border-top-right-radius: 0.25rem;
//   border-top-left-radius: 0.25rem;
//   bottom: 0;
//   content: " ";
//   left: 15%;
//   position: absolute;
//   visibility: visible;
// `;

const Header = ({theme, toggleTheme, currentUser }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBorder, setShowBorder] = useState('none');
  const router = useRouter();

  const handleShowModal = () => {
    setShowCreateModal(!showCreateModal);
  }

  useEffect(() => {
    console.log(router.pathname);
    if (router.pathname === "/latest") {
      setShowBorder("latest");
    }
    else if (router.pathname === "/user[user]") {
      setShowBorder("user");
    }
    else {
      setShowBorder('none');
    }
  }, [router]);

  return (
    <StyledHeader>
      <div className="nav-content-left">
        <Link href="/">
          <Brand>Quizlet</Brand>
        </Link>
        <div className="header-link">
          <Link href="/latest">
            <NavLink>Home</NavLink>
          </Link>
          {/* {showBorder === "latest" ? (
            <BorderUnderlineCurrent />
          ) : (
            <BorderUnderline />
          )} */}
        </div>
        <div className="header-link">
          <Link href="/user/[user]" as={`/user/${currentUser}`}>
            <NavLink>Your Library</NavLink>
          </Link>
          {/* {showBorder === "user" ? (
            <BorderUnderlineCurrent />
          ) : (
            <BorderUnderline />
          )} */}
        </div>
        <CreateButton onClick={handleShowModal} onBlur={handleShowModal}>
          Create <KeyboardArrowDownOutlinedIcon />
        </CreateButton>
        {/* <CreateButton onClick={handleShowModal}>
          Create <KeyboardArrowDownOutlinedIcon />
        </CreateButton> */}
        {showCreateModal && (
          <CreateModal>
            <Link href="/create-set">
              <a>
                <FilterNoneOutlinedIcon /> Study set
              </a>
            </Link>
            <Link href="/create-folder">
              <a>
                <FolderOutlinedIcon /> Folder
              </a>
            </Link>
            <Link href="/create-class">
              <a>
                <PeopleOutlineOutlinedIcon /> Class
              </a>
            </Link>
          </CreateModal>
        )}
      </div>
    </StyledHeader>
  );
};

export default Header;