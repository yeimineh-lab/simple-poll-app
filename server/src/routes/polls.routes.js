const router = require("express").Router();

// GET /api/v1/polls
router.get("/polls", (req, res) => {
  res.json({ polls: [] });
});

// POST /api/v1/polls
router.post("/polls", (req, res) => {
  res.status(201).json({
    poll: { id: "poll_123", ...req.body },
  });
});

// GET /api/v1/polls/:pollId
router.get("/polls/:pollId", (req, res) => {
  res.json({ pollId: req.params.pollId });
});

// POST /api/v1/polls/:pollId/votes
router.post("/polls/:pollId/votes", (req, res) => {
  res.status(201).json({
    vote: {
      pollId: req.params.pollId,
      optionId: req.body.optionId,
    },
  });
});

// GET /api/v1/polls/:pollId/results
router.get("/polls/:pollId/results", (req, res) => {
  res.json({ pollId: req.params.pollId, results: [] });
});

module.exports = router;
