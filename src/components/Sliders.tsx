import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { styled } from "styled-components";
import { IGetMoviesResult } from "../Routes/api";
import { useMatch, useNavigate } from "react-router-dom";
import { makeImagePath } from "../Routes/utilit";

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
  gap: 30px;
`;

const Title = styled.h2`
  font-size: 60px;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  width: 100%;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  opacity: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
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

const BigCover = styled.img`
  height: 300px;
  width: 100%;
  background-position: center center;
  background-size: cover;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 28px;
  position: relative;
  padding: 20px;
  top: -60px;
`;

const OverView = styled.p`
  font-size: 20px;
  width: 50%;
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

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

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

interface SliderProps {
  toggleLeaving: () => void;
  data: IGetMoviesResult;
}

function Sliders({ toggleLeaving, data }: SliderProps) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/movies/:movieId");
  const onOverlayClick = () => {
    navigate("/");
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => movie.id + "" === bigMovieMatch?.params.movieId
    );
  return (
    <>
      <Slider>
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Title>Top Poplate</Title>
          <Row
            variants={rowVarinats}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index % 3}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
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
              style={{ top: scrollY + 100 }}
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverview>{clickedMovie.overview}</BigOverview>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
