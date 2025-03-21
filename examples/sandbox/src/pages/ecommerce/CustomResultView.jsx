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
        <br />

        {result._group && result._group.length > 0 && (
          <>
            <div>Variants:</div>
            <ul>
              {result._group.map((variant) => (
                <li>
                  <a
                    href={variant.url.raw}
                    target="_blank"
                    class="flex items-center"
                  >
                    <div
                      style={{ backgroundImage: `url(${variant.image.raw})` }}
                      class="inline-block w-[25px] h-[25px] bg-contain bg-no-repeat bg-center"
                    ></div>
                    <span
                      dangerouslySetInnerHTML={{ __html: variant.name.snippet }}
                      class="text-xs ml-2"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  </li>
);
