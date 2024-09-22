import React, { useState } from 'react';

function Noticias() {
  const [news, setNews] = React.useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [loading, setLoading] = useState(false);
  const [cor, setCor] = useState('ligth');

  async function atualizarNoticias() {
    setLoading(true);
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v3/noticias?page=${page}`,
      );
      const dados = await response.json();
      setNews(dados.items);
      setTotalPages(dados.totalPages);
    } catch (error) {
      console.error('Erro ao buscar notícias:', error);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    atualizarNoticias();
  }, []);
  React.useEffect(() => {
    atualizarNoticias();
  }, [page]);

  React.useEffect(() => {
    document.body.classList.add(cor);

    return () => {
      document.body.classList.remove(cor);
    };
  }, [cor]);

  function avancarPage() {
    setPage(page + 1);
    window.scrollTo(0, 0);
  }
  function voltarPage() {
    page > 1 ? setPage(page - 1) : page;
    window.scrollTo(0, 0);
  }

  function mudaCor() {
    setCor(cor.includes('dark') ? 'ligth' : 'dark');
  }

  return (
    <section className="exibe-card">
      <button className="btn-cor" onClick={mudaCor}>
        Modo {cor == 'ligth' ? 'escuro' : 'claro'}
      </button>
      <div className={'btn-acoes'}>
        <button
          disabled={page == 1 ? true : false}
          onClick={() => (page !== 1 ? setPage(1) : '')}
        >
          Início{' '}
        </button>
        <button disabled={page == 1 ? true : false} onClick={voltarPage}>
          {'<'}
        </button>
        <button onClick={avancarPage}>{'>'}</button>
      </div>
      <div className="contador-pages">
        <span>
          Página: {page}/{totalPages}
        </span>
      </div>
      {!loading ? (
        <section>
          <ul className="noticias">
            {news.map((noticia) => (
              <li key={noticia.id} className={'noticia-card ' + cor + 'cd'}>
                <img
                  src={`https://agenciadenoticias.ibge.gov.br/${
                    JSON.parse(noticia.imagens).image_intro
                  }`}
                  alt={noticia.titulo}
                />
                <h3>{noticia.titulo}</h3>
                <span className="noticia-data">
                  <b>Data:</b> {noticia.data_publicacao.split(' ')[0]}
                </span>
                <p>{noticia.introducao}</p>
                <a
                  href={noticia.link}
                  className="btn-noticia"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Leia mais
                </a>
              </li>
            ))}
          </ul>

          <div className={'btn-acoes'}>
            <button
              onClick={() => (page !== 1 ? setPage(1) : window.scroll(0, 0))}
            >
              Início{' '}
            </button>
            <button disabled={page == 1 ? true : false} onClick={voltarPage}>
              {'<'}
            </button>
            <button onClick={avancarPage}>{'>'}</button>
          </div>
          <div className="contador-pages">
            <span>
              Página: {page}/{totalPages}
            </span>
          </div>
        </section>
      ) : (
        <p>Carregando noticias...</p>
      )}
    </section>
  );
}

export default Noticias;
