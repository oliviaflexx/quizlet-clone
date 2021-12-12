import Link from "next/link";
import { useRouter } from "next/router";
import {
  NavButton,
  StyledHeader,
  Brand,
  NavLink,
  CreateButton,
  CreateModal,
  SearchBar,
} from "../styles/big-header";
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
import {BigCreateClassModal } from "./create-class-modal";

const BigHeader = ({theme, themeToggler, currentUser }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [ showCreateFolderModal, setShowCreateFolderModal] = useState(false);
   const [showCreateClassModal, setShowCreateClassModal] = useState(false);
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
  
  
  return (
    <StyledHeader>
      {showCreateFolderModal && (
        <BigCreateFolderModal
          currentUser={currentUser}
          setShowCreateFolderModal={setShowCreateFolderModal}
        />
      )}
      {showCreateClassModal && (
        <BigCreateClassModal
          size="desktop"
          currentUser={currentUser}
          setShowCreateClassModal={setShowCreateClassModal}
        />
      )}
      <div className="nav-content">
        <Link href="/">
          <Brand>Quizlet</Brand>
        </Link>
        {currentUser && (
          <>
            <div className="header-link">
              <Link href="/latest">
                <NavLink>Home</NavLink>
              </Link>
            </div>
            <div className="header-link">
              <Link href="/user/[userId]/sets" as={`/user/${currentUser.id}/sets`}>
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
          </>
        )}

        {showCreateModal && (
          <CreateModal onBlur={() => setShowCreateModal(!showCreateModal)}>
            <Link href="/create/set">
              <a>
                <FilterNoneOutlinedIcon /> Study set
              </a>
            </Link>
            <button
              onClick={() => setShowCreateFolderModal(!showCreateFolderModal)}
            >
              <FolderOutlinedIcon /> Folder
            </button>
            <button
              onClick={() => setShowCreateClassModal(!showCreateClassModal)}
            >
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