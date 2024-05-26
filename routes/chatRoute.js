import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  addMembers,
  getMyChats,
  getMyGroups,
  leaveFromGroup,
  newGroupChat,
  removeFromGroup,
} from "../controllers/chatController.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/new-group", newGroupChat);
router.get("/get-chats", getMyChats);
router.get("/get-groups", getMyGroups);
router.put("/add-members", addMembers);
router.put("/remove-member", removeFromGroup);
router.delete("/leave-group/:chatId", leaveFromGroup);

export default router;
