package com.web.pocketmoney.service.like;

import com.web.pocketmoney.dto.like.InsertLikeDTO;
import com.web.pocketmoney.entity.like.Good;
import com.web.pocketmoney.entity.like.GoodRepository;
//import com.web.pocketmoney.entity.like.Good;
//import com.web.pocketmoney.entity.like.LikeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Log4j2
public class LikeServiceImpl implements LikeService{

    private final GoodRepository likeRepository;

    @Override
    public void insertLike(InsertLikeDTO insertLikeDTO) {
        Good like = dtoToEntity(insertLikeDTO);

        likeRepository.save(like);
    }
}
