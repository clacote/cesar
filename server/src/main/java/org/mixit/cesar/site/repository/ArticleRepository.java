package org.mixit.cesar.site.repository;

import static org.mixit.cesar.site.config.CesarCacheConfig.CACHE_ARTICLE;
import static org.mixit.cesar.site.config.CesarCacheConfig.CACHE_ARTICLE_DETAIL;

import java.util.List;

import org.mixit.cesar.site.model.article.Article;
import org.mixit.cesar.site.model.session.SessionLanguage;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

/**
 * {@link org.mixit.cesar.site.model.article.Article}
 */
public interface ArticleRepository extends CrudRepository<Article, Long> {

    @Cacheable(CACHE_ARTICLE)
    @Query(value = "SELECT a FROM Article a left join fetch a.author aut where a.valid=true order by a.postedAt desc")
    List<Article> findAllPublishedArticle();

    @Cacheable(CACHE_ARTICLE_DETAIL)
    @Query(value = "SELECT a FROM Article a left join fetch a.author aut where a.id=:idArticle and a.valid=true")
    Article findPublishedArticleById(@Param("idArticle") Long idArticle);

    @Query(value = "SELECT a FROM Article a left join fetch a.author aut where a.id=:idArticle")
    Article findArticleById(@Param("idArticle") Long idArticle);
}
