import { useMediaQuery } from "react-responsive";
import SmallHeader from "./small-header";
import BigHeader from "./big-header";

const Header = ({ themeToggler }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 850px)" });

  return (
    <>
      {isMobile ? (
        <SmallHeader themeToggler={themeToggler} />
      ) : (
        <BigHeader themeToggler={themeToggler} />
      )}
    </>
  );
};

export default Header;