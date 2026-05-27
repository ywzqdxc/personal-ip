package cn.iocoder.yudao.module.ip.service.project;

import cn.iocoder.yudao.framework.common.pojo.PageResult;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectPageReqVO;
import cn.iocoder.yudao.module.ip.controller.admin.project.vo.ProjectSaveReqVO;
import cn.iocoder.yudao.module.ip.dal.dataobject.project.ProjectDO;
import jakarta.validation.Valid;

import java.util.List;

/**
 * 项目展示 Service 接口
 */
public interface ProjectService {

    Long createProject(@Valid ProjectSaveReqVO createReqVO);

    void updateProject(@Valid ProjectSaveReqVO updateReqVO);

    void deleteProject(Long id);

    ProjectDO getProject(Long id);

    PageResult<ProjectDO> getProjectPage(ProjectPageReqVO pageReqVO);

    /** 获得已发布的项目列表，featured 优先，sort_order 降序 */
    List<ProjectDO> getPublishedProjectList();

    /** 根据 slug 获得已发布的项目 */
    ProjectDO getPublishedProjectBySlug(String slug);
}
