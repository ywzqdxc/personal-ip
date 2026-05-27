package cn.iocoder.yudao.module.ip.controller.app.travel;

import cn.iocoder.yudao.framework.common.pojo.CommonResult;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelChapterDO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelPhotoDO;
import cn.iocoder.yudao.module.ip.dal.dataobject.travel.TravelTripDO;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelChapterMapper;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelPhotoMapper;
import cn.iocoder.yudao.module.ip.dal.mysql.travel.TravelTripMapper;
import cn.iocoder.yudao.framework.mybatis.core.query.LambdaQueryWrapperX;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.Resource;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

import static cn.iocoder.yudao.framework.common.pojo.CommonResult.success;

@Tag(name = "用户 App - 旅行日记")
@RestController
@RequestMapping("/ip/travel")
@Validated
public class AppTravelController {

    @Resource
    private TravelTripMapper tripMapper;

    @Resource
    private TravelChapterMapper chapterMapper;

    @Resource
    private TravelPhotoMapper photoMapper;

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/year/list")
    @Operation(summary = "获取所有旅行年份列表")
    public CommonResult<List<Map<String, Object>>> getTravelYears() {
        List<TravelTripDO> trips = tripMapper.selectList(
                new LambdaQueryWrapperX<TravelTripDO>()
                        .eq(TravelTripDO::getStatus, 1)
                        .orderByDesc(TravelTripDO::getYear)
                        .orderByAsc(TravelTripDO::getSortOrder));

        Map<Integer, List<TravelTripDO>> grouped = trips.stream()
                .collect(Collectors.groupingBy(TravelTripDO::getYear, LinkedHashMap::new, Collectors.toList()));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<Integer, List<TravelTripDO>> entry : grouped.entrySet()) {
            List<TravelTripDO> yearTrips = entry.getValue();
            String label = yearTrips.stream()
                    .map(TravelTripDO::getTitle)
                    .collect(Collectors.joining(" · "));
            String coverImg = yearTrips.get(0).getCoverImg();

            Map<String, Object> yearData = new LinkedHashMap<>();
            yearData.put("year", entry.getKey());
            yearData.put("trips", yearTrips);
            yearData.put("coverImg", coverImg);
            yearData.put("label", label);
            result.add(yearData);
        }
        return success(result);
    }

    @GetMapping("/year/get")
    @Operation(summary = "获取指定年份的旅行行程")
    @Parameter(name = "year", description = "年份", required = true)
    public CommonResult<Map<String, Object>> getTravelYear(@RequestParam("year") Integer year) {
        List<TravelTripDO> trips = tripMapper.selectList(
                new LambdaQueryWrapperX<TravelTripDO>()
                        .eq(TravelTripDO::getYear, year)
                        .eq(TravelTripDO::getStatus, 1)
                        .orderByAsc(TravelTripDO::getSortOrder));

        if (trips.isEmpty()) {
            return success(null);
        }

        String label = trips.stream()
                .map(TravelTripDO::getTitle)
                .collect(Collectors.joining(" · "));
        String coverImg = trips.get(0).getCoverImg();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("year", year);
        result.put("trips", trips);
        result.put("coverImg", coverImg);
        result.put("label", label);
        return success(result);
    }

    @GetMapping("/trip/get")
    @Operation(summary = "获取旅行行程详情（含章节和照片）")
    @Parameter(name = "year", description = "年份", required = true)
    @Parameter(name = "tripId", description = "行程 ID", required = true)
    public CommonResult<Map<String, Object>> getTravelTrip(
            @RequestParam("year") Integer year,
            @RequestParam("tripId") Long tripId) {

        TravelTripDO trip = tripMapper.selectOne(
                new LambdaQueryWrapperX<TravelTripDO>()
                        .eq(TravelTripDO::getYear, year)
                        .eq(TravelTripDO::getId, tripId)
                        .eq(TravelTripDO::getStatus, 1));

        if (trip == null) {
            return success(null);
        }

        List<TravelChapterDO> chapters = chapterMapper.selectList(
                new LambdaQueryWrapperX<TravelChapterDO>()
                        .eq(TravelChapterDO::getTripId, tripId)
                        .orderByAsc(TravelChapterDO::getSortOrder)
                        .orderByAsc(TravelChapterDO::getNum));

        // Attach photos to each chapter
        List<Map<String, Object>> chapterList = new ArrayList<>();
        for (TravelChapterDO ch : chapters) {
            List<TravelPhotoDO> photos = photoMapper.selectByChapterId(ch.getId());
            Map<String, Object> chMap = objectMapper.convertValue(ch, new TypeReference<Map<String, Object>>() {});
            chMap.put("photos", photos.stream().map(TravelPhotoDO::getUrl).collect(Collectors.toList()));
            chapterList.add(chMap);
        }

        Map<String, Object> result = objectMapper.convertValue(trip, new TypeReference<Map<String, Object>>() {});
        result.put("chapters", chapterList);
        return success(result);
    }
}
