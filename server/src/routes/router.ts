import express from "express";

const router = express.Router();

router.get("/", (req, res)=> {
    res.json({
        message: "server is up and running",
        status: true
    })
});

export default router;
