export const CustomResultView = ({ result, onClickLink }) => (
  <li className="sui-result">
    <div className="sui-result__header">
      <h3>
        <a
          onClick={onClickLink}
          href={result.url.raw}
          dangerouslySetInnerHTML={{ __html: result.name.snippet }}
          target="_blank"
        />
      </h3>
    </div>
    <div className="sui-result__body">
      <div className="sui-result__image">
        <img src={result.image.raw} />
      </div>
      <div className="sui-result__details">
        <div>
          ${result.price.raw}
          <br />
          {result.shipping && result.shipping.raw !== undefined
            ? result.shipping.raw === 0
              ? "Free shipping"
              : `+$${result.shipping.raw} shipping`
            : ""}
          {}
        </div>
        <br />
        <div>
          {[...Array(result.rating.raw)]
            .fill("★")
            .concat([...Array(5 - result.rating.raw)].fill("☆"))}{" "}
          {result.votes.raw}
        </div>
        <br />
        <div dangerouslySetInnerHTML={{ __html: result.description.snippet }} />
      </div>
    </div>
  </li>
);
