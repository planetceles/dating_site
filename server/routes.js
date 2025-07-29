const express = require("express");
const router = express.Router();
const db = require("./db");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]);
        if (rows.length > 0) {
            res.json({ success: true, userId: rows[0].id });
        } else {
            res.json({ success: false });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;



router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        await db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );
        res.json({ success: true, message: "Registered successfully!" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            res.json({ success: false, message: "Username or email already exists." });
        } else {
            console.error(err);
            res.status(500).json({ success: false, message: "Server error." });
        }
    }
});



const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/profile", upload.single("photo"), async (req, res) => {
    const { gender, preference } = req.body;
    const photo = req.file.filename;
    const userId = 1;

    try {
        await db.query("UPDATE users SET gender = ?, preference = ?, photo = ? WHERE id = ?", [
            gender,
            preference,
            photo,
            userId,
        ]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});



router.get("/matches/:id", async (req, res) => {
    const userId = req.params.id;

    try {
        const [[user]] = await db.query("SELECT * FROM  users WHERE id = ?", [userId]);

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const [matches] = await db.query(
            "SELECT id, username, gender, photo FROM users WHERE gender = ? AND preference IN (?, 'Any') AND id != ?",
            [user.preference, user.gender, user.id]
        );

        res.json({ success: true, matches });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Error fetching matches" });
    }
});


router.get("/profile/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [[user]] = await db.query(
      "SELECT id, username, email, gender, preference, photo FROM users WHERE id = ?",
      [userId]
    );
    if (!user) return res.status(404).json({ success: false });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});



router.post("/message", async (req, res) => {
    const { sender_id, receiver_id, message } = req.body;
    await db.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)", [sender_id, receiver_id, message]);
    res.json({ success: true });
});

router.get("/messages/:userId", async (req, res) => {
    const userId = req.params.userId;
    const [msgs] = await db.query(
        "SELECT * FROM messages WHERE sender_id = ? OR receiver_id = ? ORDER BY created_at DESC",
        [userId, userId]
    );
    res.json({ success: true, messages: msgs });
});