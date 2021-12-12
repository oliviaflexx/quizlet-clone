import Styled404 from "../styles/404";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";

export default function Custom404() {
    const isSmallScreen = useMediaQuery({ query: "(max-width: 750px)" });

  return (
    <Styled404 size={isSmallScreen ? "small" : "big"}>
      {!isSmallScreen && (<>
      <div className="left"></div><div className="right"></div>
      </>)}
      <h1>Page Unavailable</h1>
      <h3>Whoops! We have no idea what to put here!</h3>
      <p>
        You may want to go to the <Link href="/">home page</Link>
      </p>
    </Styled404>
  );
}
