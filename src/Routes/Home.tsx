import { useQuery } from "react-query";
import { Outlet } from "react-router-dom";
import { IGetMoviesResult, getMovies } from "./api";
import { styled } from "styled-components";
import { makeImagePath } from "./utilit";

const Wrapper = styled.div`
  background-color: black;
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
const OverView = styled.p`
  font-size: 20px;
  width: 50%;
`;

function Home() {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now_playing"],
    getMovies
  );
  console.log(data?.results[0]?.title);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0]?.title}</Title>
            <OverView>{data?.results[0]?.overview}</OverView>
          </Banner>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
