import { Results, SearchProvider } from "@elastic/react-search-ui";
import { config } from "./config";

const CustomResultsView = ({ children }) => {
  return (
    <div className="relative overflow-x-auto">
      <ul className="flex snap-x">{children}</ul>
    </div>
  );
};

const CustomResultView = ({ result }) => {
  return (
    <li
      className="py-3 px-3 snap-start hover:text-blue-600"
      style={{ width: "200px" }}
    >
      <a href={result.url.raw}>
        <img
          src={result.image.raw}
          alt={result.name.raw}
          className="object-contain h-48 w-48"
        />
        <h4 className="text-sm truncate">{result.name.raw}</h4>
      </a>
    </li>
  );
};

export default function ProductCarousel(props) {
  return (
    <SearchProvider config={config(props.filters)}>
      <div className="product-carousel mb-10">
        <h3 className="text-xl leading-8 font-semibold text-slate-700">
          {props.title}
        </h3>
        <Results view={CustomResultsView} resultView={CustomResultView} />
      </div>
    </SearchProvider>
  );
}
