import { useState, useEffect } from 'react';
import { fetchArticles, fetchFilterOptions, triggerNewsFetch, refreshNewsFetch } from '../services/api';
import FilterSidebar from '../components/FilterSidebar';
import ArticleCard from '../components/ArticleCard';

function Home() {
  const [articles, setArticles] = useState([]);
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [articlesData, options] = await Promise.all([
          fetchArticles({ limit: 12, page: 1 }),
          fetchFilterOptions()
        ]);
        setArticles(articlesData.articles || articlesData);
        if (articlesData.totalPages) setTotalPages(articlesData.totalPages);
        if (articlesData.total) setTotalArticles(articlesData.total);
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const options = await fetchFilterOptions();
        setFilterOptions(options);
      } catch (err) {
        console.error('Failed to load filter options:', err);
      }
    };
    if (articles.length > 0) {
      loadFilterOptions();
    }
  }, [articles]);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles({ ...filters, limit: 12, page });
        setArticles(data.articles || data);
        if (data.totalPages) setTotalPages(data.totalPages);
        if (data.total) setTotalArticles(data.total);
      } catch (err) {
        console.error('Failed to load articles:', err);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, [filters, page]);

  const handleFetch = async (source = 'file') => {
    setFetching(true);
    try {
      if (source === 'api') {
        await refreshNewsFetch();
      } else {
        await triggerNewsFetch();
      }
      const options = await fetchFilterOptions();
      setFilterOptions(options);
      setFilters({});
      setPage(1);
      const data = await fetchArticles({ limit: 12, page: 1 });
      setArticles(data.articles || data);
      if (data.totalPages) setTotalPages(data.totalPages);
      if (data.total) setTotalArticles(data.total);
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="home">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>News Aggregator</h1>
            <p>Latest news from around the world</p>
          </div>
        </div>
      </header>
      <div className="main-content">
        <FilterSidebar 
          filters={filters} 
          setFilters={setFilters} 
          filterOptions={filterOptions}
        />
        <main className="feed">
          <div className="stats-bar">
            <div className="stat-item">
              <span>Articles:</span>
              <strong>{totalArticles}</strong>
            </div>
            <div className="stat-item">
              <span>Languages:</span>
              <strong>{filterOptions.languages?.length || 0}</strong>
            </div>
            <div className="stat-item">
              <span>Countries:</span>
              <strong>{filterOptions.countries?.length || 0}</strong>
            </div>
            <div className="stat-item">
              <span>Categories:</span>
              <strong>{filterOptions.categories?.length || 0}</strong>
            </div>
          </div>
          {loading ? (
            <div className="loading">Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className="no-results">
              <p>No articles found. Click below to load data from data.json</p>
              <button onClick={() => handleFetch('file')} disabled={fetching}>
                {fetching ? 'Loading...' : 'Load from Data.json'}
              </button>
            </div>
          ) : (
            <>
              <div className="articles-grid">
                {articles.map(article => (
                  <ArticleCard key={article.article_id} article={article} />
                ))}
              </div>
              <div className="pagination">
                <button 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Home;
