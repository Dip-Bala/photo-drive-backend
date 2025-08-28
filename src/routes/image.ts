import { Router, Response, Request } from "express";
import { ImageModel } from "../models/schema";
import authMiddleware from "../middleware/authMiddleware";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

const imageRouter = Router();

imageRouter.use(authMiddleware);

imageRouter.post("/upload", async (req: AuthRequest, res: Response) => {
  try {
    const { name, url, folder, public_id } = req.body;
    if (!name || !url) return res.status(400).send("Name and URL required");

    const image = await ImageModel.create({
      name,
      url,
      folder: folder || null,
      owner: req.user!.id,
      public_id: public_id || null,
    });

    res.status(201).json(image);
  } catch (err) {
    res.status(500).send("Failed to save image");
  }
});


imageRouter.get("/", async (req: AuthRequest, res: Response) => {
try {
    const { folder, q } = req.query;
    // Base query: only images owned by this user
    const query: any = { owner: req.user!.id };
    if (folder) query.folder = folder;
    if (q) query.name = { $regex: q as string, $options: "i" };
    const images = await ImageModel.find(query).sort({ createdAt: -1 });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// GET /api/images/:id — get single image
imageRouter.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const image = await ImageModel.findOne({ _id: req.params.id, owner: req.user!.id });
    if (!image) return res.status(404).send("Image not found");
    res.json(image);
  } catch (err) {
    res.status(500).send("Failed to fetch image");
  }
});

// DELETE /api/images/:id — delete metadata
imageRouter.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const image = await ImageModel.findOneAndDelete({ _id: req.params.id, owner: req.user!.id });
    if (!image) return res.status(404).send("Image not found");
    res.status(200).send("Image deleted");
  } catch (err) {
    res.status(500).send("Failed to delete image");
  }
});

export default imageRouter;
