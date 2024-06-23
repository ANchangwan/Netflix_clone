import { useLocation } from "react-router-dom";

function Search() {
  const {
    state: { keyword },
  } = useLocation();
  console.log(keyword);

  return <div>hello</div>;
}
export default Search;
