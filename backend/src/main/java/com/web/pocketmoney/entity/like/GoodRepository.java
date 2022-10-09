package com.web.pocketmoney.entity.like;

import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface GoodRepository extends JpaRepository<Good, Long> {

    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying // select 문이 아님을 나타냄
    @Query(value = "UPDATE Good SET true_or_false = :t" +
            " where user_id_id = :me" +
            " and liked_id_id = :likedId"
    , nativeQuery = true)
    void plus(@Param("likedId") User likedId, @Param("me") User me, @Param("t") String t);

    @Transactional // Update, Delete문은 붙여줘야함
    @Modifying // select 문이 아님을 나타냄
    @Query(value = "UPDATE Good SET true_or_false = :f" +
            " where user_id_id = :me" +
            " and liked_id_id = :likedId"
            , nativeQuery = true)
    void minus(@Param("likedId") User likedId, @Param("me") User me, @Param("f") String f);

    @Query(value = "select l from Good l where l.userId = :me and l.likedId = :likedId")
    Optional<Good> findByMeAndLikedId(@Param("likedId") User likedId, @Param("me") User me);

    @Query("select count (g.id) > 0" +
            " from Good g" +
            " where g.userId = :me and g.likedId = :likedId")
    boolean exists(@Param("likedId") User likedId, @Param("me") User me);

}
