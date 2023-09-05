import Link from "next/link";

const Navbar = () => {
  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
          <Link href={"/"} className="items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Todo App
            </span>
          </Link>

          <button className="btn bg-transparent bordered hover:bg-blue-900 border-blue-900">
            Login
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
