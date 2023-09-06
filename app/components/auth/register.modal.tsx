import axios, { AxiosError } from "axios";
import { SyntheticEvent, useState } from "react";

const RegisterModal = ({ closeModal }: { closeModal: () => void }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleModal = () => {
    closeModal();
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/register", {
        name: name,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      });
      setMsg("");
      closeModal();
      return alert(response.data.message);
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const message: any = error.response.data;
        setMsg(message.data);
      }
    }
  };

  return (
    <div>
      <span className="flex justify-end">
        <button className="uppercase font-extrabold" onClick={handleModal}>
          x
        </button>
      </span>
      <form onSubmit={handleSubmit}>
        <h1 className="text text-center font-bold uppercase">register</h1>
        {msg && <h1 className="text text-center text-red-700">{msg}</h1>}
        <div className="form-control">
          <label className="label font-bold">Name</label>
          <input
            className="input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Name"
            required
          />
        </div>
        <div className="form-control">
          <label className="label font-bold">Username</label>
          <input
            className="input input-bordered"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Username"
            required
          />
        </div>
        <div className="form-control">
          <label className="label font-bold">Password</label>
          <input
            className="input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div className="form-control">
          <label className="label font-bold">Confirm Password</label>
          <input
            className="input input-bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full mt-5 uppercase">
          register
        </button>
      </form>
    </div>
  );
};

export default RegisterModal;
