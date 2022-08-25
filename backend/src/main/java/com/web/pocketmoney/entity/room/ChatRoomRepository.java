package com.web.pocketmoney.entity.room;

import com.web.pocketmoney.entity.user.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {

    //방 주소를 통해 ChatRoomEntity 가져오기
//    ChatRoom findByRoomId(String roomId);

//    @Query("select cr, m" +
//            " from ChatRoom cr left join Message m on m.chatRoom = cr" +
//            " where cr.id = :id")
//    List<Object[]> findByUserIdWithMessages(@Param("id") ChatRoom id);

    @Query("select count (cr.id) > 0" +
            " from ChatRoom cr" +
            " where cr.employeeId = :employeeId and cr.roomName = :roomName and cr.employerId = :employerId")
    boolean exists(@Param("employeeId") User employeeId, @Param("roomName") String roomName, @Param("employerId") User employerId);

    @Query("select cr" +
            " from ChatRoom cr " +
            " where cr.employeeId = :userId or cr.employerId = :userId")
    List<ChatRoom> findAllByEmployeeOrEmployer(Sort sort, @Param("userId") User userId);

    //메소드명의 By 이후는 SQL의 Where조건절에 대응되는데, Containing을 붙여주면 Like검색이 가능해진다.
    //즉, %{title}%가 가능함.
    @Query("select cr" +
            " from ChatRoom cr " +
            " where cr.employeeId = :userId or cr.employerId = :userId" +
            " and cr.roomName LIKE %:roomName%")
    List<ChatRoom> findByRoomNameContaining(Sort sort, @Param("roomName") String roomName, @Param("userId") User userId);

//    Optional<ChatRoom> findById(Long id);

}