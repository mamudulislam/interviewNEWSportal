import { Link } from 'react-router-dom';

function ArticleCard({ article }) {
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSnippet = (content, description) => {
    const text = content || description || '';
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <article className="article-card">
      {article.image_url ? (
        <div className="card-image">
          <img src={article.image_url} alt={article.title} />
        </div>
      ) : (
        <div className="card-image placeholder">
          <span>{article.source_name || 'News'}</span>
        </div>
      )}
      <div className="card-content">
        <div className="card-meta">
          {article.source_name && <span className="source">{article.source_name}</span>}
          {article.pubDate && <span className="date">{formatDate(article.pubDate)}</span>}
          {article.language && <span className="language">{article.language}</span>}
        </div>
        <Link to={`/article/${article.article_id}`} className="card-title">
          <h2>{article.title}</h2>
        </Link>
        {article.creator?.length > 0 && (
          <p className="author">By {article.creator[0]}</p>
        )}
        <p className="snippet">{getSnippet(article.content, article.description)}</p>
        <div className="card-footer">
          <div className="tags">
            {article.category?.slice(0, 2).map(cat => (
              <span key={cat} className="tag">{cat}</span>
            ))}
            {article.datatype && (
              <span className="tag type">{article.datatype}</span>
            )}
            {article.country?.[0] && (
              <span className="tag country">{article.country[0]}</span>
            )}
          </div>
          <Link to={`/article/${article.article_id}`} className="read-more">
            Read More →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
