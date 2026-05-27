package cn.iocoder.yudao.module.ip.controller.admin.article;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.framework.common.util.object.BeanUtils;
import cn.iocoder.yudao.module.ip.controller.admin.article.vo.*;
import cn.iocoder.yudao.module.ip.dal.dataobject.article.ArticleDO;
import cn.iocoder.yudao.module.ip.service.article.ArticleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "管理后台 - 文章")
@RestController
@RequestMapping("/ip/article")
@Validated
public class ArticleController {

    @Resource
    private ArticleService articleService;

    @PostMapping("/create")
    @Operation(summary = "创建文章")
    @PreAuthorize("@ss.hasPermission('ip:article:create')")
    public CommonResult<Long> createArticle(@Valid @RequestBody ArticleSaveReqVO createReqVO) {
        return success(articleService.createArticle(createReqVO));
    }

    @PutMapping("/update")
    @Operation(summary = "更新文章")
    @PreAuthorize("@ss.hasPermission('ip:article:update')")
    public CommonResult<Boolean> updateArticle(@Valid @RequestBody ArticleSaveReqVO updateReqVO) {
        articleService.updateArticle(updateReqVO);
        return success(true);
    }

    @DeleteMapping("/delete")
    @Operation(summary = "删除文章")
    @Parameter(name = "id", description = "编号", required = true)
    @PreAuthorize("@ss.hasPermission('ip:article:delete')")
    public CommonResult<Boolean> deleteArticle(@RequestParam("id") Long id) {
        articleService.deleteArticle(id);
        return success(true);
    }

    @GetMapping("/get")
    @Operation(summary = "获得文章")
    @PreAuthorize("@ss.hasPermission('ip:article:query')")
    public CommonResult<ArticleRespVO> getArticle(@RequestParam("id") Long id) {
        return success(BeanUtils.toBean(articleService.getArticle(id), ArticleRespVO.class));
    }

    @GetMapping("/page")
    @Operation(summary = "获得文章分页")
    @PreAuthorize("@ss.hasPermission('ip:article:query')")
    public CommonResult<PageResult<ArticleRespVO>> getArticlePage(@Valid ArticlePageReqVO pageReqVO) {
        return success(BeanUtils.toBean(articleService.getArticlePage(pageReqVO), ArticleRespVO.class));
    }
}
