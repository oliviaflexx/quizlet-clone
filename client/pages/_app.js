import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect } from "react";
import buildClient from "../api/build-client";
import Header from "../components/header";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../components/Themes";
import { useDarkMode } from "../hooks/useDarkMode";
import { GlobalStyles } from "../components/globalStyles";
import "./styles.css"

const AppComponent = ({ Component, pageProps, currentUser }) => {
  const [theme, themeToggler] = useDarkMode();
  const themeMode = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />
      <Header currentUser={currentUser} themeToggler={themeToggler} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser);
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
