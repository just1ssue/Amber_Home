import { useEffect, useState } from "react";

function resolveTitleImageSrc(raw) {
  if (!raw || typeof raw !== "string") return "";
  if (/^(https?:)?\/\//.test(raw) || raw.startsWith("data:") || raw.startsWith("blob:")) {
    return raw;
  }
  if (raw.startsWith("/")) {
    const base = import.meta.env.BASE_URL ?? "/";
    return `${base}${raw.slice(1)}`;
  }
  return raw;
}

export default function AppCard({ app, isFavorite, onToggleFavorite, onOpen }) {
  const titleImage = resolveTitleImageSrc(app.titleImage ?? app.titleImageUrl ?? app.title_image ?? "");
  const [titleImageError, setTitleImageError] = useState(false);

  useEffect(() => {
    setTitleImageError(false);
  }, [app.id, titleImage]);

  const showTitleImage = Boolean(titleImage) && !titleImageError;
  const linkLabel = `${app.name} を開く`;

  function openApp(event) {
    onOpen(event, app);
    window.open(app.url, "_blank", "noopener,noreferrer");
  }

  function onCardKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openApp(event);
    }
  }

  return (
    <div
      className="card cardLink"
      role="link"
      tabIndex={0}
      aria-label={linkLabel}
      onClick={openApp}
      onKeyDown={onCardKeyDown}
    >
      <div className="cardHead">
        <div className="cardIcon">{app.icon ?? "🔗"}</div>
        <button
          className={`favBtn ${isFavorite ? "isFav" : ""}`}
          type="button"
          aria-label="favorite"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFavorite(app.id);
          }}
          onKeyDown={(event) => {
            event.stopPropagation();
          }}
          title="お気に入り"
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="cardTitleArea">
        {showTitleImage ? (
          <img
            className="cardTitleImage"
            src={titleImage}
            alt={app.name}
            loading="lazy"
            onError={() => setTitleImageError(true)}
          />
        ) : (
          <div className="cardName">{app.name}</div>
        )}
        {app.description ? <div className="cardDesc">{app.description}</div> : null}
      </div>
    </div>
  );
}
