import { render, screen, fireEvent } from "@testing-library/react";
import Login from "../login";
import { AuthContext } from "../../components/authContext"; 
// import Header from "./components/header";

test("shows error if email is empty", () => {
  render(<Login />);

  const button = screen.getByText("Login");
  fireEvent.click(button);

  expect(screen.getByText("Email required")).toBeInTheDocument();


});





// test("navbar displays email", () => {
//     render(<Header email="test@mail.com" role="student" />);
  
//     expect(screen.getByText("test@mail.com")).toBeInTheDocument();
//   });