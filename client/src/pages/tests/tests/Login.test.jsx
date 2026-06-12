import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../login";
import { AuthContext } from "../../components/authContext"; 
import { MemoryRouter } from "react-router-dom";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div>Google Login Button</div>,
}));

test("shows error if email is empty", async() => {
  // render(<Login />);
  const mockSetUser = vi.fn();
  
  
render(
  <MemoryRouter>
    <AuthContext.Provider value={{ setUser: mockSetUser }}>
      <Login />
    </AuthContext.Provider>
  </MemoryRouter>
);


  await userEvent.click(
    screen.getByRole("button", { name: /login/i })
  );

  expect(await screen.findByText(/email required/i))
    .toBeInTheDocument();
  });






// test("navbar displays email", () => {
//     render(<Header email="test@mail.com" role="student" />);
  
//     expect(screen.getByText("test@mail.com")).toBeInTheDocument();
//   });