import { useQuery } from "react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import {
  IGetMoviesResult,
  getLatestMovies,
  getMovies,
  getUpcoming,
  search,
} from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "./utilit";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";

const Wrapper = styled.div`
  background-color: black;
  height: 500vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  height: 80vh;
  width: 40vw;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  height: 300px;
  width: 100%;
  background-position: center center;
  background-size: cover;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 2));
`;

const BigTitle = styled.h2`
  width: 33%;
  color: ${(props) => props.theme.white.lighter};
  font-size: 40px;
  font-family: 500;
`;

const OverView = styled.p`
  font-size: 20px;
  width: 50%;
`;
const Detail = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 20px;
  gap: 50px;
`;

const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

const Slider = styled(motion.div)`
  display: grid;
  grid-template-rows: repeat(3, 1fr);
  position: relative;
  margin: 0 50px;
  top: -100px;
  gap: 30px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  top: 80px;
  width: 100%;
`;

const Rating = styled.div`
  position: absolute;
  right: 150px;
  top: 0px;
`;

const Explain = styled.div`
  position: absolute;
  top: 300px;
  right: 50px;
  width: 50%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  font-size: 66px;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const rowVarinats = {
  hidden: { x: window.outerWidth + 10 },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const Overlay = styled(motion.div)`
  position: fixed;
  opacity: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Poster = styled.div<{ bgPhoto: string }>`
  height: 200px;
  width: 100px;
  border-radius: 15px;
  position: absolute;
  top: 160px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.4,
      duration: 0.3,
      type: "tween",
    },
  },
};
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};

const offset = 6;

function Search() {
  const {
    state: { keyword },
  } = useLocation();
  const { data, isLoading } = useQuery(["search"], () => search(keyword));
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const bigMovieMatch = useMatch("/movies/:movieId");

  const [index, setIndex] = useState(0);
  const onOverlayClick = () => {
    navigate("/");
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      setLeaving(true);
      const totalMovies = data?.results.length;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const [leaving, setLeaving] = useState(false);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie: any) => movie.id + "" === bigMovieMatch?.params.movieId
    );

  const toggleLeavig = () => setLeaving((prev) => !prev);
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeavig}>
              <Row
                variants={rowVarinats}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie: any) => (
                    <Box
                      layoutId={movie.id + ""}
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>

          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path || "",
                            "w500"
                          )})`,
                        }}
                      >
                        <BigTitle>{clickedMovie.title}</BigTitle>
                      </BigCover>
                      <Detail>
                        <div>
                          <Poster
                            bgPhoto={makeImagePath(
                              clickedMovie.poster_path,
                              "w500"
                            )}
                          ></Poster>
                        </div>
                        <Explain>
                          <Rating>
                            <span>{clickedMovie.vote_average}</span>
                            <span>⭐️</span>
                          </Rating>
                          <BigOverview>
                            {clickedMovie.overview.slice(0, 200)}...
                          </BigOverview>
                        </Explain>
                      </Detail>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;
