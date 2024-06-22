import { useEffect, useState, useRef } from "react";
import axios from "../../utils/axios";
import noimage from "/public/noimage.webp";
import { Link } from "react-router-dom";
import { RiArrowUpSLine } from "react-icons/ri";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

function TopNav() {
  const [query, setQuery] = useState("");
  const [searches, setSearches] = useState([]);
  const searchResultsRef = useRef(null);
  const searchInputRef = useRef(null);

  const getSearches = async () => {
    try {
      const { data } = await axios.get(`/search/multi?query=${query}`);
      setSearches(data.results);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  useEffect(() => {
    if (query) {
      getSearches();
    } else {
      setSearches([]);
    }
  }, [query]);

  const scrollToTop = () => {
    gsap.to(window, { duration: 0.7, scrollTo: { y: 0 }, ease: "power3.out" });
  };

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      searchInputRef.current,
      { scale: 0.8 },
      { scale: 1, duration: 1, ease: "bounce.out" }
    );
  }, []);

  const animateSearchResults = () => {
    const tl = gsap.timeline();
    tl.fromTo(
      searchResultsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.1 }
    );
  };

  useEffect(() => {
    if (searches.length > 0) {
      animateSearchResults();
    }
  }, [searches]);

  return (
    <div className="w-full h-[10vh] p-2 relative z-[1]">
      <div className="text-xl flex justify-start items-center gap-2 bg-[#252833] w-[70%] h-[7vh] m-auto rounded-lg">
        <i className="ri-search-line text-[#009FFD] ml-2 text-xl"></i>
        <input
          ref={searchInputRef}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          type="text"
          placeholder="Movies, Shows and More"
          className="w-[90%] font-bold bg-transparent px-2 py-2 border-none outline-none text-white text-[1.1rem]"
        />
        {query.length > 0 && (
          <i
            className="ri-close-line text-[#009FFD] text-2xl mr-1 cursor-pointer"
            onClick={() => setQuery("")}
          ></i>
        )}
      </div>

      {searches.length > 0 && (
        <div
          ref={searchResultsRef}
          className="mt-[-0.5%] z-[999] absolute overflow-auto w-[69%] max-h-[48vh] bg-zinc-500 top-[100%] translate-x-[21.5%] rounded-b-lg"
        >
          {searches.map((s, i) => (
            <Link
              key={i}
              to={`/${s.media_type}/details/${s.id}`}
              className="duration-300 border-b-2 hover:bg-zinc-300 bg-zinc-400 flex w-full h-1/3 text-sm font-semibold p-1 flex-start"
            >
              <img
                className="rounded-lg m-1 p-1 object-cover object-top w-[10vw] h-[12vw] shadow-sm shadow-black"
                src={
                  s.poster_path
                    ? `https://image.tmdb.org/t/p/original/${s.poster_path}`
                    : s.backdrop_path
                    ? `https://image.tmdb.org/t/p/original/${s.backdrop_path}`
                    : s.profile_path
                    ? `https://image.tmdb.org/t/p/original/${s.profile_path}`
                    : noimage
                }
                alt={
                  s.original_title || s.title || s.name || s.original_name
                }
              />
              <span className="flex self-center ml-2 font-semibold">
                {s.title || s.name || s.original_title || s.original_name}
              </span>
            </Link>
          ))}
        </div>
      )}

      <div
        className="z-[999] duration-700 fixed bottom-4 right-4 bg-gray-500 hover:bg-gray-700 text-white font-black py-2 px-2 rounded cursor-pointer flex items-center justify-center"
        onClick={scrollToTop}
      >
        <RiArrowUpSLine size={20} />
      </div>
    </div>
  );
}

export default TopNav;
