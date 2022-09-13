package com.web.pocketmoney.entity.like;

import com.web.pocketmoney.entity.board.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {

    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying // select 문이 아님을 나타냄
    @Query("update Like l set l.like = true" +
            " where l.userId = :me" +
            " and l.likedId = :likedId")
    void plus(@Param("likedId") Long likedId, @Param("me") Long me);

    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying // select 문이 아님을 나타냄
    @Query("update Like l set l.like = false" +
            " where l.userId = :me" +
            " and l.likedId = :likedId")
    void minus(@Param("likedId") Long likedId, @Param("me") Long me);

    @Query("select l from Like l where l.userId = :me and l.likedId = :likedId")
    Optional<Like> findByMeAndLikedId(@Param("likedId") Long likedId, @Param("me") Long me);

}
