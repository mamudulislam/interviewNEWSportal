import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticleById } from '../services/api';

function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const data = await fetchArticleById(id);
        setArticle(data);
      } catch (err) {
        setError('Article not found');
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading article...</div>;
  if (error) return (
    <div className="error">
      <h2>{error}</h2>
      <Link to="/">← Back to Home</Link>
    </div>
  );

  return (
    <article className="article-page">
      <Link to="/" className="back-link">← Back to Feed</Link>
      
      {article.image_url && (
        <div className="article-hero">
          <img src={article.image_url} alt={article.title} />
        </div>
      )}

      <div className="article-container">
        <header className="article-header">
          <div className="article-meta">
            {article.source_id && <span className="source">{article.source_id}</span>}
            {article.pubDate && <span className="date">{formatDate(article.pubDate)}</span>}
            {article.language && <span className="language">{article.language.toUpperCase()}</span>}
          </div>
          <h1>{article.title}</h1>
          {article.creator?.length > 0 && (
            <p className="author">By {article.creator.join(', ')}</p>
          )}
        </header>

        <div className="article-tags">
          {article.category?.map(cat => (
            <span key={cat} className="tag">{cat}</span>
          ))}
          {article.content_type && (
            <span className="tag type">{article.content_type}</span>
          )}
          {article.country?.map(c => (
            <span key={c} className="tag country">{c.toUpperCase()}</span>
          ))}
        </div>

        <div className="article-content">
          {article.description && <p className="description">{article.description}</p>}
          {article.content && <div className="full-content">{article.content}</div>}
        </div>

        {article.link && (
          <div className="article-source">
            <a href={article.link} target="_blank" rel="noopener noreferrer">
              Read Original Source →
            </a>
          </div>
        )}
      </div>
    </article>
  );
}

export default ArticlePage;
