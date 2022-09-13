package com.web.pocketmoney.service.room;

import com.web.pocketmoney.dto.chatRoom.ChatRoomDetailDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomListDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomRequestDto;
import com.web.pocketmoney.dto.chatRoom.ChatRoomSaveDto;
import com.web.pocketmoney.dto.like.InsertLikeDTO;
import com.web.pocketmoney.dto.message.MessageDetailDto;
import com.web.pocketmoney.entity.board.Board;
import com.web.pocketmoney.entity.board.BoardRepository;
import com.web.pocketmoney.entity.like.Like;
import com.web.pocketmoney.entity.like.LikeRepository;
import com.web.pocketmoney.entity.message.Message;
import com.web.pocketmoney.entity.message.MessageRepository;
import com.web.pocketmoney.entity.room.ChatRoom;
import com.web.pocketmoney.entity.room.ChatRoomRepository;
import com.web.pocketmoney.entity.user.User;
import com.web.pocketmoney.entity.user.UserRepository;
import com.web.pocketmoney.exception.*;
import com.web.pocketmoney.exception.handler.ErrorCode;
import com.web.pocketmoney.service.like.LikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class ChatRoomServiceImpl implements ChatRoomService {

    private final ChatRoomRepository crr;
    private final MessageRepository cr;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;

    private final LikeService likeService;

    //채팅방 전체보기
    @Override
    public List<ChatRoomListDto> findAllRooms(Long userId) {
        //현재 로그인한 자신 user
        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));

        List<ChatRoom> chatRoomEntityList = crr.findAllByEmployeeOrEmployer(Sort.by(Sort.Direction.DESC, "id"), user);
//        List<ChatRoomDetailDto> chatRoomList = new ArrayList<>();
//
//        for(ChatRoom c : chatRoomEntityList){
//            chatRoomList.add(ChatRoomDetailDto.toChatRoomDetailDto(c));
//        }
//        return chatRoomList;
        return chatRoomEntityList.stream().map(chatRoom ->
                entityToDto(chatRoom, user)).collect(Collectors.toList());
    }

    //채팅방 id로 채팅방 찾기
    @Override
    public ChatRoomDetailDto findRoomById(Long id, Long userId) {
        //chatId, 로그인한 사용자 아이디 순으로 받아옴

        ChatRoom chatRoom = crr.findById(id)
                .orElseThrow(() -> new ChatRoomNotFoundException(
                        "채팅방을 찾을 수 없습니다.", ErrorCode.FORBIDDEN
                ));


        log.info("chatRoom : asd" + chatRoom);
        Optional<ChatRoom> result = crr.findById(id);
        log.info("result : " + result);
        ChatRoom chatRoom1 = (ChatRoom) result.get();
        log.info("result.get : " + chatRoom1);

        List<Message> messages = new ArrayList<>();
        messages = result.get().getChatMessageList();

        User employee = User.builder().id(chatRoom1.getEmployeeId().getId()).build();
        User employer = User.builder().id(chatRoom1.getEmployerId().getId()).build();
        if (userId.equals(employee.getId()) || userId.equals(employer.getId())) {
            return entitiesToDetailDto(chatRoom1, messages, userId);

        } else {
            throw new ChatRoomNotFoundException("권한이 없습니다.", ErrorCode.FORBIDDEN);
        }
    }
    @Override
    public void createRoom(ChatRoomRequestDto chatRoomRequestDto, Long userId) {

        Long boardId = chatRoomRequestDto.getBoardId();

        Board board = boardRepository.findById(boardId).orElseThrow(()->
                new CBoardNotFoundException("찾는 게시판이 없습니다.", ErrorCode.FORBIDDEN));

        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("찾는 유저가 없습니다.", ErrorCode.FORBIDDEN));
        log.info("ddd:" +crr.exists(user, board.getTitle(), board.getUser()));

        chatRoomRequestDto.setName(board.getTitle());

        if(crr.exists(user, board.getTitle(), board.getUser())){
            throw new ChatRoomExistsException("채팅방이 이미 존재합니다.", ErrorCode.CHATROOM_DUPLICATION);
        }

        ChatRoomSaveDto chatRoomSaveDto = ChatRoomSaveDto.builder()
                .employeeId(userId)
                .name(chatRoomRequestDto.getName())
                .employerId(board.getUser().getId())
                .build();

        //채팅방 개설시 서로가 좋아요를 아직 안 누른상태로 DB 삽입
        InsertLikeDTO insertLikeDTO = InsertLikeDTO.builder()
                .userId(chatRoomSaveDto.getEmployeeId())
                .likedId(chatRoomSaveDto.getEmployerId())
                .liked(false)
                .build();

        InsertLikeDTO insertLikeDTO1 = InsertLikeDTO.builder()
                .userId(chatRoomSaveDto.getEmployerId())
                .likedId(chatRoomSaveDto.getEmployeeId())
                .liked(false)
                .build();

        likeService.insertLike(insertLikeDTO);
        likeService.insertLike(insertLikeDTO1);


        ChatRoom chatRoom = chatRoomSaveDtoToEntity(chatRoomSaveDto);
        crr.save(chatRoom);
    }

    @Override
    public void deleteById(Long chatRoomId, Long userId) {

        ChatRoom chatRoom = crr.findById(chatRoomId).orElseThrow(()->
                new ChatRoomNotFoundException("해당 채팅방을 찾을 수 없습니다.", ErrorCode.NOT_FOUND));

        if(chatRoom.getEmployeeId().getId() == userId){
            crr.deleteEmployee(chatRoomId);
        }else{
            crr.deleteEmployer(chatRoomId);
        }
        if(chatRoom.getEmployeeId().getId() == null && chatRoom.getEmployerId().getId() == null){
            crr.deleteById(chatRoomId);
        }

    }



    //    @Override
//    public List<MessageDetailDto> findAllChatByRoomId(Long id) {
//        List<Message> messageEntityList = cr.findAllByChatRoom_RoomId(roomId);
//        List<MessageDetailDto> messageList = new ArrayList<>();
//
//        for(Message m : messageEntityList){
//            messageList.add(MessageDetailDto.toChatMessageDetailDto(m));
//        }
//        return messageList;
//    }
//채팅방 여러개 불러올 때
    ChatRoomListDto entityToDto(ChatRoom chatRoom, User user){
    //상대방 이름 뽑아내기
    String nickName;
    Long userId;
    //user는 현재 로그인 사용자
    //사용자 아이디가 구직자 아이디일경우, 상대방 닉네임은 구인자 닉네임
    if (user.getId().equals(chatRoom.getEmployeeId().getId())) {
       User user1 = userRepository.findById(chatRoom.getEmployerId().getId()).orElseThrow(()->
               new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
       nickName = user1.getNickName();
       userId = user1.getId();
    }else{
        User user1 = userRepository.findById(chatRoom.getEmployeeId().getId()).orElseThrow(()->
                new CUserNotFoundException("해당 유저가 없습니다.", ErrorCode.FORBIDDEN));
        nickName = user1.getNickName();
        userId = user1.getId();
    }

    Like liked = likeRepository.findByMeAndLikedId(userId, user.getId())
            .orElseThrow(() ->
                    new CLikeNotFoundException("좋아요를 누를 권한이 없습니다.",ErrorCode.FORBIDDEN));

    ChatRoomListDto chatRoomListDto = ChatRoomListDto.builder()
            .nickName(nickName)
            .id(chatRoom.getId())
            .regDate(chatRoom.getRegDate())
            .like(liked.isLike())
            .name(chatRoom.getRoomName())
            .userId(userId)
            .build();

    return chatRoomListDto;
}
    // 채팅방 하나 불러올 때, 메시지까지
    ChatRoomDetailDto entitiesToDetailDto(ChatRoom chatRoom, List<Message> messages, Long userId){
        String nickName;
        Long opponentId;
        if (userId.equals(chatRoom.getEmployeeId().getId())) {
            User user1 = userRepository.findById(chatRoom.getEmployerId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            opponentId = user1.getId();
        }else{
            User user1 = userRepository.findById(chatRoom.getEmployeeId().getId()).orElseThrow(()->
                    new CUserNotFoundException("해당 유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));
            nickName = user1.getNickName();
            opponentId = user1.getId();
        }

        Like liked = likeRepository.findByMeAndLikedId(opponentId, userId)
                .orElseThrow(() -> new CLikeNotFoundException("좋아요를 누를 권한이 없습니다.", ErrorCode.FORBIDDEN));


        User employee = User.builder()
                .id(chatRoom.getEmployeeId().getId())
                .build();

        User employer = User.builder()
                .id(chatRoom.getEmployerId().getId())
                .build();

        ChatRoomDetailDto chatRoomDetailDto = ChatRoomDetailDto.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getRoomName())
                .like(liked.isLike())
                .nickName(nickName)
                .userId(opponentId)
                .regDate(chatRoom.getRegDate())
                .build();

        List<MessageDetailDto> messageDetailDtoList = messages.stream().map(message -> {
            return MessageDetailDto.builder()
                    .messageId(message.getId())
                    .sendDate(message.getSendDate())
                    .chatRoomId(message.getChatRoom().getId())
                    .roomName(message.getChatRoom().getRoomName())
                    .writer(message.getWriterNickName())
                    .writerId(userRepository.findByNickName(message.getWriterNickName()).getId())
                    .myId(userId)
                    .message(message.getMessage())
                    .build();
        }).collect(Collectors.toList());

        chatRoomDetailDto.setMessageDetailDtoList(messageDetailDtoList);
        return chatRoomDetailDto;
    }

    @Override
    public List<ChatRoomListDto> searchRoom(Long userId ,String roomName) {

        User user = userRepository.findById(userId).orElseThrow(()->
                new CUserNotFoundException("유저를 찾을 수 없습니다.", ErrorCode.FORBIDDEN));

        List<ChatRoom> chatRoomList = crr.findByRoomNameContaining(Sort.by(Sort.Direction.DESC, "id"), roomName, user);

        return chatRoomList.stream().map(arr -> entityToDto(arr, user)).collect(Collectors.toList());
    }
}
