import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Section from "./components/Section.jsx";
import AppCard from "./components/AppCard.jsx";
import { loadFavorites, toggleFavorite, loadRecent, pushRecent } from "./lib/storage.js";

function sortApps(apps) {
  return [...apps].sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999));
}

export default function App() {
  const [apps, setApps] = useState([]);
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [recent, setRecent] = useState(() => loadRecent({ maxKeep: 20, expireDays: 90 }));

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}apps.json`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.apps) ? data.apps : [];
        setApps(sortApps(list));
      })
      .catch(() => setApps([]));
  }, []);

  const appsById = useMemo(() => {
    const m = new Map();
    for (const a of apps) m.set(a.id, a);
    return m;
  }, [apps]);

  const favoriteApps = useMemo(() => {
    // “移動なし”なので favorites の配列順（追加順）を尊重
    return favorites.map((id) => appsById.get(id)).filter(Boolean);
  }, [favorites, appsById]);

  const recentApps = useMemo(() => {
    // recent は ts desc。表示は 5 件。
    const items = recent
      .map((x) => ({ ...x, app: appsById.get(x.id) }))
      .filter((x) => x.app)
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 5);
    return items;
  }, [recent, appsById]);

  function onToggleFavorite(id) {
    const next = toggleFavorite(id);
    setFavorites(next);
  }

  function onOpen(_e, app) {
    // 通常遷移でOK（同一ドメイン中心）
    // “最近使った”のみ更新（クリック計測の最小形）
    setRecent(pushRecent(app.id, { maxKeep: 20 }));
  }

  return (
    <div id="top" className="page">
      <Header />

      <main className="main">
        <Section
          id="home"
          title="Home"
          right={<span className="muted">ログイン不要 / 1ページポータル</span>}
        >
          <p className="lead">
            Amber_Home は、あなたのアプリへ素早く移動するための導線ページです。
          </p>
        </Section>

        <Section id="favorites" title="Favorites">
          {favoriteApps.length ? (
            <div className="grid">
              {favoriteApps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={true}
                  onToggleFavorite={onToggleFavorite}
                  onOpen={onOpen}
                />
              ))}
            </div>
          ) : (
            <p className="muted">☆ を押すとお気に入りに追加されます。</p>
          )}
        </Section>

        <Section id="recent" title="Recently Used">
          {recentApps.length ? (
            <div className="grid">
              {recentApps.map(({ app }) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={favorites.includes(app.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpen={onOpen}
                />
              ))}
            </div>
          ) : (
            <p className="muted">最近開いたアプリがここに表示されます（最大5件）。</p>
          )}
        </Section>

        <Section id="apps" title="Apps">
          {apps.length ? (
            <div className="grid">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  isFavorite={favorites.includes(app.id)}
                  onToggleFavorite={onToggleFavorite}
                  onOpen={onOpen}
                />
              ))}
            </div>
          ) : (
            <p className="muted">apps.json を読み込めませんでした。</p>
          )}
        </Section>

        <Section id="about" title="About">
          <p className="muted">Coming soon</p>
        </Section>

        <footer className="footer">
          <span className="muted">Amber_Home</span>
        </footer>
      </main>
    </div>
  );
}
