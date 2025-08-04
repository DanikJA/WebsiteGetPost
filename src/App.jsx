import React, { useRef } from "react";
import Header from "./Header";
import Hero from "./Hero";
import PostForm from "./PostForm";
import UsersSection from "./Users";
import "./App.css";

function App() {
  const usersRef = useRef(null);
  const formRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container">
      <Header
        onUsersClick={() => scrollToSection(usersRef)}
        onSignUpClick={() => scrollToSection(formRef)}
      />
      <Hero onSignUpClick={() => scrollToSection(formRef)} />
      <div ref={usersRef}>
        <UsersSection />
      </div>
      <div ref={formRef}>
        <PostForm />
      </div>
    </div>
  );
}

export default App;
