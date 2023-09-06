"use client";

import { useState } from "react";
import LoginModal from "./login.modal";
import RegisterModal from "./register.modal";

const ButtonAuth = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleModal = () => {
    setIsLogin(true);
    setIsOpen(!isOpen);
  };

  const handleSwapModal = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <button
        className="btn bg-transparent bordered border-blue-800 hover:bg-blue-800"
        onClick={handleModal}
      >
        Login
      </button>
      <div className={isOpen ? "modal modal-open" : "modal"}>
        <div className="modal-box">
          {isLogin ? (
            <div>
              <LoginModal closeModal={handleModal} />
              <h1 className="text text-center mt-5">
                Not registered?{" "}
                <button
                  className="text text-blue-700 hover:text-blue-600"
                  onClick={handleSwapModal}
                >
                  Create an account
                </button>
              </h1>
            </div>
          ) : (
            <div>
              <RegisterModal closeModal={handleModal} />
              <h1 className="text text-center mt-5">
                Already registered?{" "}
                <button
                  className="text text-blue-700 hover:text-blue-600"
                  onClick={handleSwapModal}
                >
                  Login
                </button>
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ButtonAuth;
