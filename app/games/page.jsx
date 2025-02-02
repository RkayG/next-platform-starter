"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from 'next/link';
import GameCard from "@/components/game-card";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Inter, Roboto_Slab, Sevillana, Pacifico } from 'next/font/google'
import BottomSubscribe from "@/components/bottom-subscribe";
import ScrollBackTop from "@/components/scroll-back-top";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
 
const roboto_slab = Roboto_Slab({ subsets: ['latin'] })
const sevillana = Sevillana({ subsets: ['latin'], weight: '400' })
const pacifico = Pacifico({ subsets: ['latin'], weight: '400'})

const fetchGames = async () => {
  const response = await fetch(`${apiUrl}/games`);
  if (!response.ok) {
    throw new Error("Failed to fetch games.");
  }
  return response.json();
};

const Games = () => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 12;

  const { data: games, isLoading, error } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  useEffect(() => {
    if (games) {
      setFilteredGames(games.slice(1));
    }
  }, [games]);

  const genres = games ? [...new Set(games.map(game => game.genre))] : [];

  const handleGenreFilter = (genre) => {
    setSelectedGenre(genre);
    setCurrentPage(1);
    if (genre === "") {
      setFilteredGames(games.slice(1));
    } else {
      setFilteredGames(games.slice(1).filter(game => game.genre === genre));
    }
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const genreSliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const featuredSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const SkeletonFeaturedGame = () => (
    <div className="mx-2">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
      >
        <div className="w-full h-48 bg-gray-300"></div>
        <div className="p-4">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      </motion.div>
    </div>
  );

  const SkeletonGameCard = () => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 animate-pulse">
      <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
      <div className="w-3/4 h-6 bg-gray-300 rounded mb-2"></div>
      <div className="w-1/2 h-4 bg-gray-300 rounded mb-2"></div>
      <div className="w-1/4 h-4 bg-gray-300 rounded"></div>
    </div>
  );

   if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 my-32">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO 
          title="Earn While Playing Games"
          description="Discover top play-to-earn games and start earning rewards for your gameplay."
          keywords='blockchain games, play to earn, crypto games'
          logoUrl="/images/games1-og-image.jpg"
          siteUrl="https://www.web3fruity.com/games"
      />
   
    <section>
      <div className="mb-56 max-w-[1920px] m-auto">
        <div className="relative w-full max-h-[50vh] min-h-[300px] mb-6 flex items-center justify-center bg-cover bg-center bg-[url('/images/games1.jpg')]">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(210,143,143,0.5)] to-[rgba(0,0,0,0.5)]" />
          <div className="relative z-10 text-center text-white max-w-2xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 animate-pulse">Earn While You Play</h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-8">
              Discover top play-to-earn games and start earning rewards for your gameplay.
            </p>
            <Link
              href="#"
              className="inline-flex items-center justify-center px-6 py-3 bg-orange-300 text-gray-900 font-medium rounded-md hover:bg-[#ffcc00] focus:outline-none focus:ring-2 focus:ring-[#ffd700] focus:ring-offset-2"
              prefetch={false}
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="mb-16 mt-12">
          <h2 className="text-2xl font-bold mb-8 text-center bg-clip-text 
            text-transparent bg-gradient-to-r from-blue-500 to-red-500">Featured Games</h2>
          <div className="max-w-full overflow-hidden">
          <Slider {...featuredSliderSettings} className="w-[99%]  -mr-3">
            {isLoading
                ? Array(9).fill().map((_, index) => <SkeletonFeaturedGame key={`loading-${index}`} />)
                : games.slice(0, 3).map((game, index) => (
                <Link href={`/games/${game.slug}`} key={game._id}>
                    <motion.div
                    whileHover={{ scale: 0.92 }}
                    whileTap={{ scale: 0.75 }}
                    className="bg-white rounded-lg mx-5 overflow-hidden shadow-lg hover:shadow-lg transition-all duration-300"
                    >
                    <img className="w-full h-48 object-cover" src={game.image} alt={game.title} />
                    <div className="p-4">
                        <h3 className="text-xl font-semibold text-blue-900 mb-2">{game.title}</h3>
                        <p className='text-gray-600 mb-2'>{game.genre}</p>
                        <p className='text-sm font-medium text-orange-800'>{game?.platform.length > 1 ? game?.platform.join(', ') : game?.platform}</p>
                    </div>
                    </motion.div>
                </Link>
                ))
            }
            </Slider>
          </div>
        </div>

        <div className="my-8 px-4"> 
          <h2 className="text-2xl font-bold mb-4 text-center bg-clip-text 
            text-transparent bg-gradient-to-r from-blue-500 to-red-500">
            All Games
          </h2>
          <div className="w-full flex flex-wrap justify-center gap-2 my-4">
            {genres.map((genre, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full whitespace-nowrap
                  ${selectedGenre === genre 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-50 border border-gray-300 text-blue-900'}
                  hover:bg-blue-500 hover:text-white transition-colors duration-200`}
                onClick={() => handleGenreFilter(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>


        {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill().map((_, index) => <SkeletonGameCard key={index} />)}
        </div>
      ) : (
        <>
         {/* might later use currentGames which only contains games not in featured   */}     
          {currentGames.map((game, index) => (
            <GameCard key={index} game={game} />
          ))}
          <ScrollBackTop />
          <Pagination
            gamesPerPage={gamesPerPage}
            totalGames={filteredGames.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </>
      )}
        
      </div>
      <BottomSubscribe />
    </section>
    </>
  );
};

const Pagination = ({ gamesPerPage, totalGames, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalGames / gamesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-4">
      <ul className="flex pl-0 rounded list-none flex-wrap">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 mx-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 text-blue-900'} hover:bg-blue-500 hover:text-white`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
    
  );
};

export default Games;
