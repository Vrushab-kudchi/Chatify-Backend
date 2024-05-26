import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";
import { emitEvent } from "../utils/Features.js";
import ErrorHandler from "../utils/errorHandler.js";

export const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;
  if (members.length < 2)
    return next(
      new ErrorHandler(
        "there should be more then 3 members to create a group",
        400
      )
    );
  const allMembers = [...members, req.user._id];
  const chat = await Chat.create({
    name,
    members: allMembers,
    groupChat: true,
    creator: req.user._id,
  });
  emitEvent(req, ALERT, allMembers, "Welcome to Group Chat");
  emitEvent(req, REFETCH_CHATS, members);
  res.status(201).json({ success: true, message: "Group Created" });
});

export const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user._id }).populate(
    "members",
    "name username avatar"
  );

  const transformChats = chats.map((chat) => {
    const { _id, name, members, groupChat } = chat;
    const otherMember = getOtherMember(members, req.user._id);
    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map((member) => member.avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((previous, current) => {
        if (current._id.toString() !== req.user._id.toString()) {
          previous.push(current._id);
        }
        return previous;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformChats,
  });
});

export const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user._id,
    groupChat: true,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));
  return res.status(200).json({
    success: true,
    groups,
  });
});

//Add to a Group
export const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  if (!members || members.length < 1) {
    return next(new ErrorHandler("Please provide members", 400));
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return next(new ErrorHandler("Chat ID not found", 404));
  }

  if (!chat.groupChat) {
    return next(
      new ErrorHandler("Cannot add members to a non-group chat", 400)
    );
  }

  if (chat.creator.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not allowed to add members to this group", 403)
    );
  }

  // Fetch user details of new members
  const allNewMembersPromise = members.map((memberId) =>
    User.findById(memberId, "name")
  );
  const addNewMembers = await Promise.all(allNewMembersPromise);

  // Filter out members already in the chat
  const uniqueMembers = addNewMembers
    .filter(
      (newMember) =>
        !chat.members.some(
          (member) => member.toString() === newMember._id.toString()
        )
    )
    .map((newMember) => newMember._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100) {
    return next(new ErrorHandler("Group members limit reached", 400));
  }

  await chat.save();

  const allUsersName = addNewMembers.map((user) => user.name).join(", ");

  emitEvent(
    req,
    ALERT,
    chat.members,
    `${allUsersName} has been added to ${chat.name}`
  );
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

//remove from group
export const removeFromGroup = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!userId) {
    return next(new ErrorHandler("Please provide members", 400));
  }

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { members: userId },
    },
    { new: true }
  );

  emitEvent(req, REFETCH_CHATS, chat.members);
  res
    .status(200)
    .json({ Success: true, message: "Member Removed Successfull" });
});

// Leave Group

export const leaveFromGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;

  const chat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { members: req.user._id },
    },
    { new: true }
  );

  if (!chat) {
    return next(new ErrorHandler("Chat not found", 404));
  }

  // If the user leaving is the creator, assign a new creator
  if (String(chat.creator) === String(req.user._id)) {
    if (chat.members.length > 0) {
      const randomIndex = Math.floor(Math.random() * chat.members.length);
      chat.creator = chat.members[randomIndex];
      await chat.save();
    } else {
      return next(
        new ErrorHandler(
          "Cannot leave the group as there are no other members.",
          400
        )
      );
    }
  }

  emitEvent(req, REFETCH_CHATS, chat.members);
  res.status(200).json({ success: true, message: "You left the group" });
});
