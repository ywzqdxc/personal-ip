package cn.iocoder.yudao.module.ip.controller.app.article;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.app.article.vo.AppArticleRespVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.article.ArticleDO;
import cn.iocoder.yudao.module.ip.service.article.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.annotation.security.PermitAll;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 文章")
@RestController
@RequestMapping("/ip/article")
@Validated
@PermitAll
public class AppArticleController {

    @Resource
    private ArticleService articleService;

    @GetMapping("/page")
    @Operation(summary = "获得文章分页列表（已发布）")
    public CommonResult<List<AppArticleRespVO>> getPublishedArticleList(
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        List<ArticleDO> list = articleService.getPublishedArticleList(pageNo, pageSize);
        return success(BeanUtils.toBean(list, AppArticleRespVO.class));
    }

    @GetMapping("/get")
    @Operation(summary = "根据 slug 获得文章详情")
    @Parameter(name = "slug", description = "文章 slug", required = true)
    public CommonResult<AppArticleRespVO> getArticleBySlug(@RequestParam("slug") String slug) {
        ArticleDO article = articleService.getPublishedArticleBySlug(slug);
        return success(article == null ? null : BeanUtils.toBean(article, AppArticleRespVO.class));
    }
}
