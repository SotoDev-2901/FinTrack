import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <>
      <main className="min-h-screen grid place-items-center bg-gray-900 px-6 py-12 sm:py-20 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-indigo-400">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            This is Not Fine
          </h1>
          <img
            src="https://midu.dev/images/this-is-fine-404.gif"
            alt="Gif del perro de This is Fine quemándose vivo"
            className="mx-auto mt-6 max-w-xs sm:max-w-sm md:max-w-md w-full h-auto"
          />
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Volver a la Home
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}; 