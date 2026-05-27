package cn.iocoder.yudao.module.ip.service.article;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.ArticlePageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.ArticleSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.article.ArticleDO;
import jakarta.validation.Valid;

import java.util.List;

public interface ArticleService {

    Long createArticle(@Valid ArticleSaveReqVO createReqVO);
    void updateArticle(@Valid ArticleSaveReqVO updateReqVO);
    void deleteArticle(Long id);
    ArticleDO getArticle(Long id);
    PageResult<ArticleDO> getArticlePage(ArticlePageReqVO pageReqVO);
    List<ArticleDO> getPublishedArticleList(Integer pageNo, Integer pageSize);
    ArticleDO getPublishedArticleBySlug(String slug);
}
