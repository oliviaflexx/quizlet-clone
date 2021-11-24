import { useMediaQuery } from "react-responsive";
import SmallHeader from "./small-header";
import BigHeader from "./big-header";

const Header = ({ themeToggler, currentUser }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 850px)" });

  return (
    <>
      {isMobile ? (
        <SmallHeader currentUser={currentUser} themeToggler={themeToggler} />
      ) : (
        <BigHeader currentUser={currentUser} themeToggler={themeToggler} />
      )}
    </>
  );
};

export default Header;