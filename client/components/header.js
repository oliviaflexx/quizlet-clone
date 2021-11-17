import Link from "next/link";
import styled from "styled-components";

const StyledHeader = styled.nav`
  background-color: ${({ theme }) => theme.headerBack};
  width: 100%;
  box-shadow: 0 0.25rem 1rem 0 #939bb414;
  height: 4rem;
  padding: 0 1rem;
  display: flex;
  -webkit-justify-content: space-between;
`;

const Brand = styled.h1`
  color: ${({theme }) => theme.brand};
  cursor: pointer;
`
const NavLink = styled.p`
  color: ${({ theme }) => theme.navLink};
  &:hover: {
    color: ${({ theme }) => theme.navLinkHover};
  }
  cursor: pointer;
`;

const Header = ({theme, toggleTheme, currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });

  return (
    <StyledHeader>
      <div className="nav-content-left">
        <Link href="/">
          <Brand>Quizlet</Brand>
        </Link>
        <Link href="/explanations">
          <NavLink>Explanations</NavLink>
        </Link>
        <Link href="/user/[user]" as={`/user/${currentUser}`}>
          <NavLink>Your Library</NavLink>
        </Link>
      </div>
    </StyledHeader>
  );
};

export default Header;