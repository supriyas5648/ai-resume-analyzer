import express from "express";
import multer from "multer";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { analyzeResume } from "../controllers/resumecontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import ResumeAnalysis from "../models/Resumeanalysis.js";

const router = express.Router();

// ✅ Multer (memory storage)
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.post(
  "/analyze",
  protect,
  upload.single("resumeFile"),
  async (req, res) => {
    try {
      let resumeText = req.body.resumeText;
      const jobRole = req.body.jobRole;
      const fileName = req.file?.originalname || "pasted-resume.txt";

      // ✅ If PDF uploaded → extract text properly
      if (req.file) {
        // 🔥 Convert Buffer → Uint8Array (IMPORTANT FIX)
        const uint8Array = new Uint8Array(req.file.buffer);

        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdf = await loadingTask.promise;

        let extractedText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();

          const pageText = content.items
            .map((item) => item.str)
            .join(" ");

          extractedText += pageText + " ";
        }

        resumeText = extractedText;
      }

      // ✅ Validation
      if (!resumeText || resumeText.trim().length < 50) {
        return res.status(400).json({
          error: "Resume text not readable or too short",
        });
      }

      // ✅ Send to controller
      const analysis = await analyzeResume(
        resumeText,
        jobRole,
        req.user.id,
        fileName
      );

      res.status(200).json({ success: true, data: analysis });

    } catch (error) {
      console.log("ANALYZE ERROR:", error);
      res.status(500).json({ error: error.message });
    }
  }
);


// ✅ History
router.get("/history", protect, async (req, res) => {
  try {
    const history = await ResumeAnalysis.find({
      user_id: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Match what frontend actually calls
router.get("/:id", protect, async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({ error: "Not found" });
    }

    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;