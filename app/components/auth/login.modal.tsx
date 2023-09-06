import { SyntheticEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import { accessTokenAtom } from "@/constants/atom.constant";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";

const LoginModal = ({ closeModal }: { closeModal: () => void }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const router = useRouter();

  const handleModal = () => {
    closeModal();
    setUsername("");
    setPassword("");
    router.refresh();
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        username: username,
        password: password,
      });
      setMsg("");
      handleModal();
      localStorage.setItem("token", response.data.data.accessToken);
      alert(response.data.message);
    } catch (e) {
      const error = e as AxiosError;
      if (error.response) {
        const message: any = error.response;
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
        <h1 className="text text-center font-bold uppercase">login</h1>
        {msg && <h1 className="text text-center text-red-700">{msg}</h1>}
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
        <button type="submit" className="btn btn-primary w-full mt-5 uppercase">
          login
        </button>
      </form>
    </div>
  );
};

export default LoginModal;
